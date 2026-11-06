import { auditContent } from './tiptap'
import { isPostSection } from './constants'
import type { PostFaqItem, PostSource } from '@/lib/db/schema'

/** The fields the publish check looks at. Shared by the form and the server. */
export interface PostCheckInput {
  title: string
  slug: string
  excerpt: string
  content: unknown
  section: string
  categoryId: number | null
  coverImageUrl: string
  coverImageAlt: string
  author: string
  seoTitle: string
  seoDescription: string
  focusKeyword: string
  tagCount: number
  ogTitle: string
  ogDescription: string
  sources: PostSource[]
  faq: PostFaqItem[]
  relatedPostIds: number[]
}

export type PostFieldId =
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'content'
  | 'section'
  | 'category'
  | 'cover'
  | 'author'
  | 'seoTitle'
  | 'seoDescription'
  | 'focusKeyword'
  | 'tags'
  | 'social'
  | 'sources'
  | 'related'
  | 'faq'

export interface PostIssue {
  field: PostFieldId
  message: string
}

export interface PostCheckResult {
  /** Block publishing and scheduling. */
  required: PostIssue[]
  /** Shown but never blocking. */
  recommended: PostIssue[]
  /** 0-100, used by the admin list. */
  completion: number
}

// Display-length hints only; the proposal rules out hard limits.
export const SEO_TITLE_HINT = 32
export const SEO_DESCRIPTION_HINT = 80

export function checkPost(input: PostCheckInput): PostCheckResult {
  const required: PostIssue[] = []
  const recommended: PostIssue[] = []
  const audit = auditContent(input.content)

  if (!input.title.trim()) required.push({ field: 'title', message: '請填寫文章標題' })
  if (!input.slug.trim()) required.push({ field: 'slug', message: '請填寫網址 slug' })
  if (!input.excerpt.trim()) required.push({ field: 'excerpt', message: '請填寫摘要' })
  if (!audit.hasText) required.push({ field: 'content', message: '請填寫正文' })
  if (!isPostSection(input.section)) required.push({ field: 'section', message: '請選擇欄目' })
  if (!input.categoryId) required.push({ field: 'category', message: '請選擇文章分類' })
  if (!input.coverImageUrl.trim()) {
    required.push({ field: 'cover', message: '請上傳封面圖' })
  } else if (!input.coverImageAlt.trim()) {
    required.push({ field: 'cover', message: '請填寫封面圖的替代文字（alt）' })
  }
  if (!input.author.trim()) required.push({ field: 'author', message: '請填寫作者' })
  if (audit.imagesMissingAlt.length > 0) {
    required.push({
      field: 'content',
      message: `正文有 ${audit.imagesMissingAlt.length} 張圖片缺替代文字；裝飾圖可勾選「裝飾圖」`,
    })
  }

  if (audit.hasH1) {
    recommended.push({ field: 'content', message: '正文含 H1，頁面標題已是 H1，前台會自動降為 H2' })
  }
  if (audit.skippedHeadingLevel) {
    recommended.push({ field: 'content', message: '正文標題層級有跳接，建議依 H2、H3 順序' })
  }
  if (!input.seoTitle.trim()) {
    recommended.push({ field: 'seoTitle', message: 'SEO 標題未填，將使用文章標題' })
  } else if (input.seoTitle.trim().length > SEO_TITLE_HINT) {
    recommended.push({ field: 'seoTitle', message: `SEO 標題 ${input.seoTitle.trim().length} 字，搜尋結果可能被截斷` })
  }
  if (!input.seoDescription.trim()) {
    recommended.push({ field: 'seoDescription', message: 'SEO 描述未填，將使用摘要' })
  } else if (input.seoDescription.trim().length > SEO_DESCRIPTION_HINT) {
    recommended.push({
      field: 'seoDescription',
      message: `SEO 描述 ${input.seoDescription.trim().length} 字，搜尋結果可能被截斷`,
    })
  }
  if (!input.focusKeyword.trim()) recommended.push({ field: 'focusKeyword', message: '建議填寫焦點關鍵字' })
  if (input.tagCount === 0) recommended.push({ field: 'tags', message: '建議加上標籤' })
  if (!input.ogTitle.trim() && !input.ogDescription.trim()) {
    recommended.push({ field: 'social', message: '社群分享未自訂，將沿用 SEO 標題、描述與封面' })
  }
  if (input.section === 'observation' && input.sources.length === 0) {
    recommended.push({ field: 'sources', message: '供應鏈觀察建議附上資料來源' })
  }
  if (input.relatedPostIds.length === 0) {
    recommended.push({ field: 'related', message: '尚未指定相關文章，將依同分類自動帶入' })
  }

  const requiredTotal = 8
  const blockingFields = new Set(required.map((issue) => issue.field))
  const doneRequired = Math.max(0, requiredTotal - blockingFields.size)
  const recommendedTotal = 7
  const doneRecommended = Math.max(0, recommendedTotal - new Set(recommended.map((i) => i.field)).size)
  const completion = Math.round(((doneRequired * 3 + doneRecommended) / (requiredTotal * 3 + recommendedTotal)) * 100)

  return { required, recommended, completion }
}
