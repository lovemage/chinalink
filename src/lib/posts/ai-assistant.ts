import { ARTICLE_CATEGORY_SLUGS, isPostSection, type PostSection } from './constants'
import type { PostFaqItem, PostSource } from '@/lib/db/schema'

export interface AssistantInput {
  text: string
  title?: string
  sourceUrl?: string
  notes?: string
}

export interface AssistantReviewNote {
  field: string
  message: string
  quote?: string
}

export interface AssistantDraft {
  title: string
  excerpt: string
  contentHtml: string
  section: PostSection | null
  categorySlug: string | null
  sources: PostSource[]
  faq: PostFaqItem[]
  suggestions: {
    seoTitle: string
    seoDescription: string
    focusKeyword: string
    tags: string[]
    coverImageAlt: string
    ogTitle: string
    ogDescription: string
    relatedSlugs: string[]
  }
  reviewNotes: AssistantReviewNote[]
}

export interface ExistingPostRef {
  title: string
  slug: string
  excerpt: string | null
}

const TRUTH_RULES = `
規則：
- 一律使用台灣繁體中文與台灣慣用語。
- 只能使用原稿與補充說明中的資訊。不得新增原稿沒有的事實、數字、人物、案例、引語或親身經歷。
- 原稿資訊不足時保持簡短，並把缺口寫進 reviewNotes，不要自行補寫。
- 不使用行銷套話，不使用「不僅…更…」、「在當今…的時代」這類句型。
- 只輸出一個 JSON 物件，不要加說明文字或 Markdown 圍欄。
`.trim()

export function buildOrganizePrompt(existingPosts: ExistingPostRef[]): string {
  const posts = existingPosts
    .slice(0, 60)
    .map((post) => `- ${post.slug}｜${post.title}`)
    .join('\n')
  return `
你是懂陸姐（Tina）的編輯助手。Tina 是在大陸生活多年的台灣人，文風直接、具體、像熟悉當地的前輩。
使用者會提供文章標題、重點或完整原稿，請整理成可發布的草稿。修正錯字與語句、整理段落，加上 H2／H3、清單與重點，但保留 Tina 的觀點與語氣。

${TRUTH_RULES}

欄目 section 只能是 "opinion"（陸姐觀點：個人看法與經驗）或 "observation"（供應鏈觀察：市場與產業動態，附來源）。
分類 categorySlug 只能是：
- ecommerce-platforms（電商與平台）
- retail-consumer（零售與消費）
- b2b-supply-chain（To B 與產業供應鏈）
- new-media-traffic（新媒體與流量）

JSON 格式：
{
  "title": "文章標題",
  "excerpt": "摘要，60 到 100 字",
  "contentHtml": "正文 HTML，只用 h2 h3 p ul ol li blockquote strong em table thead tbody tr th td a，不要 h1",
  "section": "opinion 或 observation",
  "categorySlug": "上列四者之一",
  "sources": [{"name": "來源名稱", "url": "原稿或補充說明中出現的完整網址"}],
  "faq": [{"question": "問題", "answer": "只根據文章內容回答"}],
  "suggestions": {
    "seoTitle": "SEO 標題，約 30 字內",
    "seoDescription": "SEO 描述，約 80 字內",
    "focusKeyword": "一個焦點關鍵字",
    "tags": ["標籤"],
    "coverImageAlt": "依文章主題建議的封面圖替代文字",
    "ogTitle": "社群分享標題",
    "ogDescription": "社群分享描述",
    "relatedSlugs": ["從下方既有文章清單挑選最多 3 個 slug"]
  },
  "reviewNotes": [
    {"field": "title|excerpt|content|section|category|sources", "message": "需要 Tina 確認或修改的地方", "quote": "正文中對應的原句，可省略"}
  ]
}

faq 產生 3 到 5 組。reviewNotes 要標出：待確認的事實或數字、缺來源的說法、語意不清的段落、分類判斷不確定之處。

既有文章清單：
${posts || '（目前沒有）'}
`.trim()
}

export function buildFaqPrompt(): string {
  return `
你是懂陸姐網站的編輯助手，請根據使用者提供的文章或資料，產生給讀者看的常見問答草稿。

${TRUTH_RULES}
- 答案只能根據提供的資料，資料沒提到就不要回答該問題。

JSON 格式：
{ "faq": [{"question": "問題", "answer": "回答"}] }

產生 3 到 5 組。
`.trim()
}

export function buildUserMessage(input: AssistantInput): string {
  return [
    input.title ? `標題：${input.title}` : null,
    input.sourceUrl ? `來源網址：${input.sourceUrl}` : null,
    input.notes ? `補充說明：${input.notes}` : null,
    input.text ? `原稿或重點：\n${input.text}` : null,
  ]
    .filter(Boolean)
    .join('\n\n')
}

/** Tolerates code fences and prose around the JSON object. */
export function extractJsonObject(raw: string): unknown {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end <= start) throw new AssistantFormatError('AI 回覆沒有 JSON 內容')
  try {
    return JSON.parse(raw.slice(start, end + 1))
  } catch {
    throw new AssistantFormatError('AI 回覆的 JSON 格式有誤')
  }
}

export class AssistantFormatError extends Error {}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export function parseFaq(value: unknown): PostFaqItem[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({ question: str(record(item).question), answer: str(record(item).answer) }))
    .filter((item) => item.question && item.answer)
    .slice(0, 8)
}

export function parseSources(value: unknown): PostSource[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({ name: str(record(item).name), url: str(record(item).url) }))
    .filter((item) => item.name && isHttpUrl(item.url))
    .slice(0, 10)
}

/**
 * Validates model output. Required text must be present; anything that cannot be
 * trusted (category, slugs not on this site, malformed URLs) is dropped and reported.
 */
export function parseAssistantDraft(raw: unknown, knownSlugs: string[]): AssistantDraft {
  const data = record(raw)
  const title = str(data.title)
  const contentHtml = str(data.contentHtml)
  if (!title || !contentHtml) throw new AssistantFormatError('AI 回覆缺少標題或正文')

  const reviewNotes: AssistantReviewNote[] = Array.isArray(data.reviewNotes)
    ? data.reviewNotes
        .map((note) => ({
          field: str(record(note).field) || 'content',
          message: str(record(note).message),
          quote: str(record(note).quote) || undefined,
        }))
        .filter((note) => note.message)
    : []

  const categorySlug = str(data.categorySlug)
  const validCategory = (ARTICLE_CATEGORY_SLUGS as readonly string[]).includes(categorySlug)
  if (!validCategory) {
    reviewNotes.push({ field: 'category', message: 'AI 無法判斷文章分類，請手動選擇' })
  }
  const section = isPostSection(data.section) ? data.section : null
  if (!section) reviewNotes.push({ field: 'section', message: 'AI 無法判斷欄目，請手動選擇' })

  const suggestions = record(data.suggestions)
  const known = new Set(knownSlugs)
  return {
    title,
    excerpt: str(data.excerpt),
    contentHtml,
    section,
    categorySlug: validCategory ? categorySlug : null,
    sources: parseSources(data.sources),
    faq: parseFaq(data.faq),
    suggestions: {
      seoTitle: str(suggestions.seoTitle),
      seoDescription: str(suggestions.seoDescription),
      focusKeyword: str(suggestions.focusKeyword),
      tags: Array.isArray(suggestions.tags)
        ? suggestions.tags.map(str).filter(Boolean).slice(0, 8)
        : [],
      coverImageAlt: str(suggestions.coverImageAlt),
      ogTitle: str(suggestions.ogTitle),
      ogDescription: str(suggestions.ogDescription),
      relatedSlugs: Array.isArray(suggestions.relatedSlugs)
        ? suggestions.relatedSlugs.map(str).filter((slug) => known.has(slug)).slice(0, 3)
        : [],
    },
    reviewNotes,
  }
}
