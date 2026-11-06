'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ExternalLink, Loader2, Sparkles, X } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { TiptapEditor, type TiptapEditorHandle } from '@/components/admin/TiptapEditor'
import { useToast } from '@/components/admin/AdminToast'
import { savePost, suggestPostSlug, unpublishPost, type SavePostIntent } from '@/lib/actions/posts'
import type { PostAiSource, PostFaqItem, PostSource } from '@/lib/db/schema'
import type { AssistantDraft, AssistantReviewNote } from '@/lib/posts/ai-assistant'
import { checkPost, SEO_DESCRIPTION_HINT, SEO_TITLE_HINT, type PostFieldId, type PostIssue } from '@/lib/posts/checks'
import { POST_SECTIONS, POST_STATUS_LABELS, type PostSection } from '@/lib/posts/constants'
import { toTaipeiInputValue } from '@/lib/posts/time'

interface PostFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post?: any
  categories: { id: number; name: string; slug: string }[]
  availableTags: { id: number; name: string; slug: string }[]
  allPosts: { id: number; title: string }[]
  mode: 'create' | 'edit'
  siteUrl: string
}

interface Fields {
  title: string
  slug: string
  section: PostSection
  categoryId: number | null
  excerpt: string
  author: string
  coverImageUrl: string
  coverImageAlt: string
  content: unknown
  seoTitle: string
  seoDescription: string
  focusKeyword: string
  ogTitle: string
  ogDescription: string
  ogImageUrl: string
  sources: PostSource[]
  faq: PostFaqItem[]
  relatedPostIds: number[]
  noindex: boolean
  canonicalUrl: string
  tagNames: string[]
  scheduledAt: string
  publishedAt: string
}

type Suggestion =
  | { key: 'seoTitle' | 'seoDescription' | 'focusKeyword' | 'coverImageAlt' | 'ogTitle' | 'ogDescription'; label: string; value: string }
  | { key: 'tagNames'; label: string; value: string[] }
  | { key: 'relatedPostIds'; label: string; value: number[]; display: string }

const inputClass =
  'w-full border border-brand-rule bg-white px-3 py-2.5 text-base outline-none transition-colors focus:border-brand-primary md:text-sm'
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-1.5 border border-brand-rule bg-white px-3 text-sm font-medium text-brand-text hover:bg-brand-tint disabled:opacity-50'
const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-1.5 bg-brand-primary px-4 text-sm font-bold text-brand-raised hover:bg-brand-deep disabled:opacity-50'
const sectionClass = 'border border-brand-rule bg-brand-raised p-4 sm:p-5'

function fieldAnchor(field: PostFieldId | string) {
  return `field-${field}`
}

function Field({
  id,
  label,
  required,
  hint,
  counter,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: React.ReactNode
  counter?: { value: number; limit: number }
  children: React.ReactNode
}) {
  return (
    <div id={fieldAnchor(id)} className="scroll-mt-20 transition-colors">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={`input-${id}`} className="text-sm font-bold text-brand-text">
          {label}
          {required && <span className="ml-1 font-normal text-brand-alert">必填</span>}
        </label>
        {counter && (
          <span className={`dateline text-xs ${counter.value > counter.limit ? 'text-brand-alert' : 'text-brand-muted'}`}>
            {counter.value} / 約 {counter.limit}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-[13px] leading-5 text-brand-muted">{hint}</p>}
    </div>
  )
}

function initialFields(post: PostFormProps['post']): Fields {
  return {
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    section: post?.section === 'observation' ? 'observation' : 'opinion',
    categoryId: post?.categoryId ?? null,
    excerpt: post?.excerpt ?? '',
    author: post?.author ?? '懂陸姐',
    coverImageUrl: post?.coverImage?.url ?? '',
    coverImageAlt: post?.coverImageAlt ?? post?.coverImage?.alt ?? '',
    content: post?.content ?? null,
    seoTitle: post?.seoTitle ?? '',
    seoDescription: post?.seoDescription ?? '',
    focusKeyword: post?.focusKeyword ?? '',
    ogTitle: post?.ogTitle ?? '',
    ogDescription: post?.ogDescription ?? '',
    ogImageUrl: post?.ogImageUrl ?? '',
    sources: post?.sources ?? [],
    faq: post?.faq ?? [],
    relatedPostIds: post?.relatedPostIds ?? [],
    noindex: post?.noindex ?? false,
    canonicalUrl: post?.canonicalUrl ?? '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tagNames: (post?.tagRelations ?? []).map((relation: any) => relation.tag?.name).filter(Boolean),
    scheduledAt: toTaipeiInputValue(post?.scheduledAt),
    publishedAt: toTaipeiInputValue(post?.publishedAt),
  }
}

/** Keeps a fixed bottom bar above the on-screen keyboard. */
function useKeyboardOffset() {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => setOffset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop))
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    update()
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])
  return offset
}

const AI_FIELD_LABELS = {
  title: '標題',
  excerpt: '摘要',
  content: '正文',
  section: '欄目',
  categoryId: '分類',
  sources: '資料來源',
  faq: 'FAQ',
} as const
type AiField = keyof typeof AI_FIELD_LABELS

function isFilled(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') return true
  return value !== '' && value !== null && value !== undefined
}

export default function PostForm({ post, categories, availableTags, allPosts, mode, siteUrl }: PostFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const editorRef = useRef<TiptapEditorHandle>(null)
  const storageKey = `chinalink:post-draft:${post?.id ?? 'new'}`
  const legacyBlocks = Array.isArray(post?.content)
  const keyboardOffset = useKeyboardOffset()

  const [postId, setPostId] = useState<number | undefined>(post?.id)
  const [status, setStatus] = useState<string>(post?.status ?? 'draft')
  const [fields, setFields] = useState<Fields>(() => initialFields(post))
  const [slugManual, setSlugManual] = useState(mode === 'edit')
  const [savedSlug, setSavedSlug] = useState<string>(post?.slug ?? '')
  const [editorKey, setEditorKey] = useState(0)

  const [saving, setSaving] = useState<SavePostIntent | 'preview' | null>(null)
  const [serverIssues, setServerIssues] = useState<PostIssue[]>([])
  const [published, setPublished] = useState<string | null>(null)
  const [panel, setPanel] = useState<'checklist' | 'schedule' | null>(null)
  const [recoverable, setRecoverable] = useState<Fields | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  // AI assistant
  const initialSource = post?.aiSource as PostAiSource | null | undefined
  const [aiOpen, setAiOpen] = useState(mode === 'create')
  const [rawText, setRawText] = useState(initialSource?.text ?? '')
  const [sourceUrl, setSourceUrl] = useState(initialSource?.sourceUrl ?? '')
  const [notes, setNotes] = useState(initialSource?.notes ?? '')
  const [aiSource, setAiSource] = useState<PostAiSource | null>(initialSource ?? null)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState<AssistantReviewNote[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [pendingDraft, setPendingDraft] = useState<{ draft: AssistantDraft; conflicts: AiField[]; overwrite: AiField[] } | null>(null)
  const aiApplied = useRef<Partial<Record<AiField, string>>>({})
  const [faqBusy, setFaqBusy] = useState(false)
  const [faqError, setFaqError] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')

  const set = useCallback(<K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((previous) => ({ ...previous, [key]: value }))
  }, [])

  const check = useMemo(
    () =>
      checkPost({
        ...fields,
        tagCount: fields.tagNames.length,
      }),
    [fields]
  )

  // ---- slug follows the title until Tina edits it ----
  useEffect(() => {
    if (slugManual || !fields.title.trim()) return
    const timer = setTimeout(async () => {
      try {
        const suggestion = await suggestPostSlug(fields.title, postId)
        setFields((previous) => (previous.slug === suggestion ? previous : { ...previous, slug: suggestion }))
      } catch {
        // The server resolves the slug again when saving.
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [fields.title, slugManual, postId])

  // ---- autosave to this device ----
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      try {
        const stored = window.localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored) as { fields: Fields }
          if (JSON.stringify(parsed.fields) !== JSON.stringify(fields)) setRecoverable(parsed.fields)
          else window.localStorage.removeItem(storageKey)
        }
      } catch {
        // Unavailable storage only loses the local backup.
      }
      return
    }
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ fields, savedAt: Date.now() }))
      } catch {
        // Same as above.
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [fields, storageKey])

  const jumpTo = useCallback((field: string, quote?: string) => {
    setPanel(null)
    const target = document.getElementById(fieldAnchor(field))
    target?.closest('details')?.setAttribute('open', '')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (field === 'content' && quote && editorRef.current?.focusQuote(quote)) return
    target?.querySelector<HTMLElement>('input, textarea, select')?.focus({ preventScroll: true })
    setFlash(field)
    setTimeout(() => setFlash(null), 1400)
  }, [])

  useEffect(() => {
    if (!flash) return
    const target = document.getElementById(fieldAnchor(flash))
    target?.classList.add('tiptap-flash')
    return () => target?.classList.remove('tiptap-flash')
  }, [flash])

  // ---- save ----
  async function submit(intent: SavePostIntent, opts?: { preview?: boolean }) {
    if (saving) return
    setSaving(opts?.preview ? 'preview' : intent)
    setServerIssues([])
    // Popups must open during the tap, or phones block them.
    const previewWindow = opts?.preview ? window.open('', '_blank') : null
    try {
      const result = await savePost(
        // Tiptap attrs are not plain objects; server actions only carry plain data.
        { ...fields, content: fields.content ? JSON.parse(JSON.stringify(fields.content)) : null, id: postId, slugManual, aiSource },
        intent
      )
      if ('error' in result) {
        previewWindow?.close()
        addToast(result.error, 'error')
        if (result.issues?.length) {
          setServerIssues(result.issues)
          setPanel('checklist')
        }
        return
      }
      setPostId(result.id)
      setStatus(result.status)
      setSavedSlug(result.slug)
      setSlugManual(true)
      set('slug', result.slug)
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // Nothing to clean up.
      }
      if (previewWindow) {
        previewWindow.location.href = `/blog/${encodeURI(result.slug)}`
      } else if (intent === 'publish') {
        setPublished(result.url)
        addToast('文章已發布', 'success')
      } else if (intent === 'schedule') {
        setPanel(null)
        addToast(`已排程：${fields.scheduledAt.replace('T', ' ')}（台灣時間）`, 'success')
      } else {
        addToast(intent === 'draft' ? '草稿已儲存' : '已儲存', 'success')
      }
      if (mode === 'create' && !postId) {
        window.history.replaceState(null, '', `/admin/posts/${result.id}`)
      }
      router.refresh()
    } catch {
      previewWindow?.close()
      addToast('連線失敗，內容已保留，請再試一次', 'error')
    } finally {
      setSaving(null)
    }
  }

  async function handleUnpublish() {
    if (!postId || saving) return
    if (!window.confirm('確定下架這篇文章？下架後讀者將看不到，sitemap 也會移除。')) return
    const result = await unpublishPost(postId)
    if ('error' in result) addToast(result.error, 'error')
    else {
      setStatus('draft')
      addToast('已下架，文章改為草稿', 'success')
      router.refresh()
    }
  }

  // ---- AI assistant ----
  function fieldValueForAi(field: AiField): string {
    if (field === 'content') return JSON.stringify(editorRef.current?.getJson() ?? fields.content)
    return JSON.stringify(fields[field])
  }

  function isManuallyEdited(field: AiField): boolean {
    const hasValue =
      field === 'content'
        ? Boolean(editorRef.current?.getText().trim())
        : field === 'section'
          ? false
          : isFilled(fields[field])
    if (!hasValue) return false
    return aiApplied.current[field] !== fieldValueForAi(field)
  }

  function applyDraft(draft: AssistantDraft, overwrite: AiField[], skip: AiField[]) {
    const allow = (field: AiField) => !skip.includes(field) || overwrite.includes(field)
    const next: Partial<Fields> = {}
    if (allow('title')) next.title = draft.title
    if (allow('excerpt') && draft.excerpt) next.excerpt = draft.excerpt
    if (allow('section') && draft.section) next.section = draft.section
    const category = categories.find((item) => item.slug === draft.categorySlug)
    if (allow('categoryId') && category) next.categoryId = category.id
    if (allow('sources') && draft.sources.length) next.sources = draft.sources
    if (allow('faq') && draft.faq.length) next.faq = draft.faq
    setFields((previous) => ({ ...previous, ...next }))
    if (allow('content')) editorRef.current?.setHtml(draft.contentHtml)

    // Remember what the AI wrote so later edits can be told apart from it.
    window.setTimeout(() => {
      setFields((current) => {
        for (const field of Object.keys(AI_FIELD_LABELS) as AiField[]) {
          if (!allow(field)) continue
          aiApplied.current[field] =
            field === 'content' ? JSON.stringify(editorRef.current?.getJson()) : JSON.stringify(current[field])
        }
        return current
      })
    }, 0)
  }

  function buildSuggestions(draft: AssistantDraft, relatedPosts: { id: number; title: string }[]) {
    const s = draft.suggestions
    const list: Suggestion[] = []
    const addText = (
      key: 'seoTitle' | 'seoDescription' | 'focusKeyword' | 'coverImageAlt' | 'ogTitle' | 'ogDescription',
      label: string,
      value: string
    ) => {
      if (value && !fields[key].trim()) list.push({ key, label, value })
    }
    addText('seoTitle', 'SEO 標題', s.seoTitle)
    addText('seoDescription', 'SEO 描述', s.seoDescription)
    addText('focusKeyword', '焦點關鍵字', s.focusKeyword)
    addText('coverImageAlt', '封面圖替代文字', s.coverImageAlt)
    if (s.tags.length && fields.tagNames.length === 0) list.push({ key: 'tagNames', label: '標籤', value: s.tags })
    addText('ogTitle', '社群分享標題', s.ogTitle)
    addText('ogDescription', '社群分享描述', s.ogDescription)
    if (relatedPosts.length && fields.relatedPostIds.length === 0) {
      list.push({
        key: 'relatedPostIds',
        label: '相關文章',
        value: relatedPosts.map((item) => item.id),
        display: relatedPosts.map((item) => item.title).join('、'),
      })
    }
    return list
  }

  async function runAssistant() {
    const text = rawText.trim()
    const title = text ? '' : fields.title.trim()
    if (!text && !title) {
      setAiError('請先貼上標題、重點或原稿')
      return
    }
    setAiBusy(true)
    setAiError(null)
    try {
      const response = await fetch('/api/admin/post-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'organize', text, title, sourceUrl, notes }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        draft?: AssistantDraft
        relatedPosts?: { id: number; title: string }[]
        error?: string
      }
      if (!response.ok || !data.draft) throw new Error(data.error || 'AI 整理失敗，請再試一次')

      setAiSource({ text: text || title, sourceUrl, notes, savedAt: new Date().toISOString() })
      setReviewNotes(data.draft.reviewNotes)
      setSuggestions(buildSuggestions(data.draft, data.relatedPosts ?? []))

      const conflicts = (Object.keys(AI_FIELD_LABELS) as AiField[]).filter(isManuallyEdited)
      if (conflicts.length > 0) {
        setPendingDraft({ draft: data.draft, conflicts, overwrite: [] })
      } else {
        applyDraft(data.draft, [], [])
        addToast('AI 已帶入欄位，請確認內容', 'success')
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'AI 整理失敗，請再試一次')
    } finally {
      setAiBusy(false)
    }
  }

  function adoptSuggestion(suggestion: Suggestion) {
    if (suggestion.key === 'tagNames') set('tagNames', suggestion.value)
    else if (suggestion.key === 'relatedPostIds') set('relatedPostIds', suggestion.value)
    else set(suggestion.key, suggestion.value)
    setSuggestions((previous) => previous.filter((item) => item.key !== suggestion.key))
  }

  async function generateFaq() {
    const articleText = editorRef.current?.getText().trim()
    if (!articleText) {
      setFaqError('請先完成正文，FAQ 會依正文產生')
      return
    }
    setFaqBusy(true)
    setFaqError(null)
    try {
      const response = await fetch('/api/admin/post-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'faq', title: fields.title, text: articleText }),
      })
      const data = (await response.json().catch(() => ({}))) as { faq?: PostFaqItem[]; error?: string }
      if (!response.ok || !data.faq) throw new Error(data.error || 'FAQ 產生失敗，請再試一次')
      const existing = new Set(fields.faq.map((item) => item.question))
      set('faq', [...fields.faq, ...data.faq.filter((item) => !existing.has(item.question))])
    } catch (error) {
      setFaqError(error instanceof Error ? error.message : 'FAQ 產生失敗，請再試一次')
    } finally {
      setFaqBusy(false)
    }
  }

  const isPublished = status === 'published'
  const isScheduled = status === 'scheduled'
  const issues = serverIssues.length ? serverIssues : check.required
  const slugMoved = isPublished && savedSlug && fields.slug !== savedSlug
  const seoTitleLen = fields.seoTitle.trim().length
  const seoDescLen = fields.seoDescription.trim().length

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="mx-auto max-w-3xl space-y-4 pb-40 md:pb-28"
    >
      {recoverable && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-tint p-4 text-sm" role="status">
          <span>這台裝置上有尚未儲存的內容。</span>
          <div className="flex gap-2">
            <button
              type="button"
              className={secondaryButton}
              onClick={() => {
                setFields(recoverable)
                setEditorKey((key) => key + 1)
                setRecoverable(null)
              }}
            >
              還原
            </button>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => {
                try {
                  window.localStorage.removeItem(storageKey)
                } catch {
                  // Nothing to clean up.
                }
                setRecoverable(null)
              }}
            >
              捨棄
            </button>
          </div>
        </div>
      )}

      {post?.scheduleError && isScheduled && (
        <p className="bg-brand-tint p-4 text-sm text-brand-alert" role="alert">
          上次排程發布失敗：{post.scheduleError}。修正後請重新排程或立即發布。
        </p>
      )}

      {published && (
        <div className="bg-brand-tint p-4 text-sm" role="status">
          <p className="font-bold">文章已發布</p>
          <a href={published} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 break-all underline">
            {published}
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      )}

      {/* AI assistant */}
      <section className={sectionClass}>
        <button
          type="button"
          onClick={() => setAiOpen((open) => !open)}
          aria-expanded={aiOpen}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="inline-flex items-center gap-2 font-bold">
            <Sparkles className="size-4 text-brand-wood" aria-hidden="true" />
            AI 上架助手
          </span>
          <ChevronDown className={`size-5 transition-transform ${aiOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {aiOpen && (
          <div className="mt-4 space-y-3">
            <p className="text-[13px] leading-5 text-brand-muted">
              貼上標題、重點或完整原稿，AI 會整理後帶入下方欄位。AI 不會自動發布，內容請再確認。
            </p>
            <textarea
              id="ai-raw"
              aria-label="原稿或重點"
              rows={6}
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="貼上標題、重點或原稿"
              className={inputClass}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                aria-label="來源網址"
                type="url"
                inputMode="url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="來源網址（選填）"
                className={inputClass}
              />
              <input
                aria-label="補充說明"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="補充說明（選填）"
                className={inputClass}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={runAssistant} disabled={aiBusy} className={primaryButton}>
                {aiBusy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                {aiBusy ? 'AI 整理中…' : 'AI 整理'}
              </button>
              {aiSource && (
                <button
                  type="button"
                  className="text-sm underline underline-offset-4"
                  onClick={() => {
                    setRawText(aiSource.text)
                    setSourceUrl(aiSource.sourceUrl ?? '')
                    setNotes(aiSource.notes ?? '')
                  }}
                >
                  還原上次送出的原稿
                </button>
              )}
            </div>
            {aiError && (
              <p className="flex flex-wrap items-center gap-3 text-sm text-brand-alert" role="alert">
                {aiError}
                <button type="button" onClick={runAssistant} className="text-brand-text underline">
                  重試
                </button>
              </p>
            )}

            {pendingDraft && (
              <div className="border border-brand-rule bg-white p-4 text-sm">
                <p className="font-bold">這些欄位你已修改過，要用 AI 的新內容覆蓋嗎？</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {pendingDraft.conflicts.map((field) => (
                    <label key={field} className="flex min-h-8 items-center gap-2">
                      <input
                        type="checkbox"
                        className="size-4"
                        checked={pendingDraft.overwrite.includes(field)}
                        onChange={(event) =>
                          setPendingDraft({
                            ...pendingDraft,
                            overwrite: event.target.checked
                              ? [...pendingDraft.overwrite, field]
                              : pendingDraft.overwrite.filter((item) => item !== field),
                          })
                        }
                      />
                      {AI_FIELD_LABELS[field]}
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className={primaryButton}
                    onClick={() => {
                      applyDraft(pendingDraft.draft, pendingDraft.overwrite, pendingDraft.conflicts)
                      setPendingDraft(null)
                      addToast('AI 已帶入欄位，請確認內容', 'success')
                    }}
                  >
                    套用
                  </button>
                  <button type="button" className={secondaryButton} onClick={() => setPendingDraft(null)}>
                    全部不要
                  </button>
                </div>
              </div>
            )}

            {reviewNotes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold">需要修改</h3>
                <ul className="mt-2 border-t border-brand-rule">
                  {reviewNotes.map((note, index) => (
                    <li key={`${note.field}-${index}`} className="border-b border-brand-rule">
                      <button
                        type="button"
                        onClick={() => jumpTo(note.field === 'category' ? 'category' : note.field, note.quote)}
                        className="w-full py-2.5 text-left text-sm leading-6 hover:bg-brand-tint"
                      >
                        {note.message}
                        {note.quote && <span className="mt-0.5 block text-[13px] text-brand-muted">「{note.quote}」</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold">尚未填寫，AI 建議</h3>
                  <button
                    type="button"
                    className="text-sm underline underline-offset-4"
                    onClick={() => suggestions.forEach(adoptSuggestion)}
                  >
                    全部採用
                  </button>
                </div>
                <ul className="mt-2 border-t border-brand-rule">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.key} className="flex items-start justify-between gap-3 border-b border-brand-rule py-2.5">
                      <div className="min-w-0 text-sm leading-6">
                        <span className="font-medium">{suggestion.label}</span>
                        <span className="block break-words text-brand-muted">
                          {suggestion.key === 'relatedPostIds'
                            ? suggestion.display
                            : suggestion.key === 'tagNames'
                              ? suggestion.value.join('、')
                              : suggestion.value}
                        </span>
                      </div>
                      <button type="button" className={`${secondaryButton} shrink-0 whitespace-nowrap`} onClick={() => adoptSuggestion(suggestion)}>
                        採用
                      </button>
                    </li>
                  ))}
                </ul>
                {!fields.coverImageUrl && (
                  <p className="mt-2 text-[13px] text-brand-muted">封面圖需要你親自上傳，AI 無法提供。</p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Required */}
      <section className={`${sectionClass} space-y-5`}>
        <Field id="title" label="文章標題" required>
          <input
            id="input-title"
            value={fields.title}
            onChange={(event) => set('title', event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          id="slug"
          label="網址 slug"
          required
          hint={
            <>
              <span className="break-all">
                {siteUrl}/blog/{fields.slug || '…'}
              </span>
              {slugMoved && <span className="mt-1 block text-brand-alert">已發布文章改網址後，舊網址會永久轉址到新網址。</span>}
            </>
          }
        >
          <div className="flex gap-2">
            <input
              id="input-slug"
              value={fields.slug}
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              onChange={(event) => {
                setSlugManual(true)
                set('slug', event.target.value)
              }}
              className={inputClass}
            />
            <button
              type="button"
              className={`${secondaryButton} shrink-0`}
              onClick={async () => {
                const suggestion = await suggestPostSlug(fields.title, postId)
                if (suggestion) set('slug', suggestion)
              }}
            >
              依標題產生
            </button>
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <div id={fieldAnchor('section')} className="scroll-mt-20">
            <p className="mb-1.5 text-sm font-bold">
              欄目 <span className="font-normal text-brand-alert">必填</span>
            </p>
            <div className="grid grid-cols-2 border border-brand-rule" role="radiogroup" aria-label="欄目">
              {(Object.keys(POST_SECTIONS) as PostSection[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={fields.section === key}
                  onClick={() => set('section', key)}
                  className={`min-h-11 text-sm ${fields.section === key ? 'bg-brand-tint font-bold' : 'bg-white'}`}
                >
                  {POST_SECTIONS[key].label}
                </button>
              ))}
            </div>
          </div>
          <Field id="category" label="文章分類" required>
            <select
              id="input-category"
              value={fields.categoryId ?? ''}
              onChange={(event) => set('categoryId', event.target.value ? Number(event.target.value) : null)}
              className={inputClass}
            >
              <option value="">請選擇</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="excerpt" label="摘要" required hint="顯示在文章列表，也是分享時的預設描述。">
          <textarea
            id="input-excerpt"
            rows={3}
            value={fields.excerpt}
            onChange={(event) => set('excerpt', event.target.value)}
            className={inputClass}
          />
        </Field>

        <div id={fieldAnchor('cover')} className="scroll-mt-20 space-y-2">
          <p className="text-sm font-bold">
            封面圖 <span className="font-normal text-brand-alert">必填</span>
          </p>
          <ImageUploader
            images={fields.coverImageUrl ? [fields.coverImageUrl] : []}
            onChange={(images) => set('coverImageUrl', images[0] ?? '')}
            single
          />
          <label htmlFor="input-cover" className="block pt-1 text-sm font-medium">
            封面圖替代文字（alt）
          </label>
          <input
            id="input-cover"
            value={fields.coverImageAlt}
            onChange={(event) => set('coverImageAlt', event.target.value)}
            placeholder="描述圖片內容"
            className={inputClass}
          />
        </div>

        <div id={fieldAnchor('content')} className="scroll-mt-20">
          <p className="mb-1.5 text-sm font-bold">
            正文 <span className="font-normal text-brand-alert">必填</span>
          </p>
          {legacyBlocks ? (
            <p className="bg-brand-tint p-4 text-sm leading-6">
              這篇使用舊版區塊格式，前台照常顯示，內容會原樣保留，但無法在這裡編輯。
            </p>
          ) : (
            <TiptapEditor
              key={editorKey}
              handleRef={editorRef}
              content={fields.content}
              onChange={(json) => set('content', json)}
              placeholder="輸入文章內容…"
            />
          )}
        </div>

        <Field id="author" label="作者" required>
          <input
            id="input-author"
            value={fields.author}
            onChange={(event) => set('author', event.target.value)}
            className={inputClass}
          />
        </Field>
      </section>

      {/* Sources */}
      <section className={`${sectionClass} space-y-3 scroll-mt-20`} id={fieldAnchor('sources')}>
        <h2 className="font-bold">
          資料來源
          {fields.section === 'observation' && <span className="ml-2 text-[13px] font-normal text-brand-muted">供應鏈觀察建議填寫</span>}
        </h2>
        {fields.sources.map((source, index) => (
          <div key={index} className="grid gap-2 border-b border-brand-rule pb-3 sm:grid-cols-[1fr_1.5fr_auto]">
            <input
              aria-label="來源名稱"
              placeholder="來源名稱"
              value={source.name}
              onChange={(event) =>
                set('sources', fields.sources.map((item, i) => (i === index ? { ...item, name: event.target.value } : item)))
              }
              className={inputClass}
            />
            <input
              aria-label="來源網址"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={source.url}
              onChange={(event) =>
                set('sources', fields.sources.map((item, i) => (i === index ? { ...item, url: event.target.value } : item)))
              }
              className={inputClass}
            />
            <button type="button" className={secondaryButton} onClick={() => set('sources', fields.sources.filter((_, i) => i !== index))}>
              移除
            </button>
          </div>
        ))}
        <button type="button" className={secondaryButton} onClick={() => set('sources', [...fields.sources, { name: '', url: '' }])}>
          新增來源
        </button>
      </section>

      {/* FAQ */}
      <section className={`${sectionClass} space-y-3 scroll-mt-20`} id={fieldAnchor('faq')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold">文章 FAQ</h2>
          <button type="button" className={secondaryButton} onClick={generateFaq} disabled={faqBusy}>
            {faqBusy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
            {faqBusy ? '產生中…' : '依正文產生'}
          </button>
        </div>
        {faqError && (
          <p className="text-sm text-brand-alert" role="alert">
            {faqError}
          </p>
        )}
        {fields.faq.map((item, index) => (
          <div key={index} className="space-y-2 border-b border-brand-rule pb-3">
            <input
              aria-label={`問題 ${index + 1}`}
              placeholder="問題"
              value={item.question}
              onChange={(event) =>
                set('faq', fields.faq.map((faq, i) => (i === index ? { ...faq, question: event.target.value } : faq)))
              }
              className={inputClass}
            />
            <textarea
              aria-label={`回答 ${index + 1}`}
              placeholder="回答"
              rows={3}
              value={item.answer}
              onChange={(event) =>
                set('faq', fields.faq.map((faq, i) => (i === index ? { ...faq, answer: event.target.value } : faq)))
              }
              className={inputClass}
            />
            <button type="button" className="text-sm underline underline-offset-4" onClick={() => set('faq', fields.faq.filter((_, i) => i !== index))}>
              移除這組
            </button>
          </div>
        ))}
        <button type="button" className={secondaryButton} onClick={() => set('faq', [...fields.faq, { question: '', answer: '' }])}>
          手動新增
        </button>
      </section>

      {/* Advanced */}
      <details className={sectionClass}>
        <summary className="flex items-center justify-between font-bold">
          SEO 與進階設定
          <ChevronDown className="size-5" aria-hidden="true" />
        </summary>
        <div className="mt-5 space-y-5">
          <Field id="seoTitle" label="SEO 標題" hint="未填時使用文章標題。" counter={{ value: seoTitleLen, limit: SEO_TITLE_HINT }}>
            <input id="input-seoTitle" value={fields.seoTitle} onChange={(event) => set('seoTitle', event.target.value)} className={inputClass} />
          </Field>
          <Field id="seoDescription" label="SEO 描述" hint="未填時使用摘要。" counter={{ value: seoDescLen, limit: SEO_DESCRIPTION_HINT }}>
            <textarea id="input-seoDescription" rows={3} value={fields.seoDescription} onChange={(event) => set('seoDescription', event.target.value)} className={inputClass} />
          </Field>
          <Field id="focusKeyword" label="焦點關鍵字" hint="撰寫參考用，不會輸出到頁面。">
            <input id="input-focusKeyword" value={fields.focusKeyword} onChange={(event) => set('focusKeyword', event.target.value)} className={inputClass} />
          </Field>

          <div id={fieldAnchor('tags')} className="scroll-mt-20">
            <label htmlFor="input-tags" className="mb-1.5 block text-sm font-bold">
              標籤
            </label>
            {fields.tagNames.length > 0 && (
              <ul className="mb-2 flex flex-wrap gap-1.5">
                {fields.tagNames.map((name) => (
                  <li key={name} className="inline-flex items-center gap-1 bg-brand-tint py-1 pl-2.5 pr-1 text-sm">
                    {name}
                    <button
                      type="button"
                      aria-label={`移除標籤 ${name}`}
                      className="flex size-7 items-center justify-center"
                      onClick={() => set('tagNames', fields.tagNames.filter((tag) => tag !== name))}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                id="input-tags"
                list="available-tags"
                value={newTag}
                onChange={(event) => setNewTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    const name = newTag.trim()
                    if (name && !fields.tagNames.includes(name)) set('tagNames', [...fields.tagNames, name])
                    setNewTag('')
                  }
                }}
                placeholder="輸入標籤"
                className={inputClass}
              />
              <datalist id="available-tags">
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.name} />
                ))}
              </datalist>
              <button
                type="button"
                className={`${secondaryButton} shrink-0`}
                onClick={() => {
                  const name = newTag.trim()
                  if (name && !fields.tagNames.includes(name)) set('tagNames', [...fields.tagNames, name])
                  setNewTag('')
                }}
              >
                加入
              </button>
            </div>
          </div>

          <div id={fieldAnchor('related')} className="scroll-mt-20">
            <label htmlFor="input-related" className="mb-1.5 block text-sm font-bold">
              相關文章
            </label>
            {fields.relatedPostIds.length > 0 && (
              <ul className="mb-2 space-y-1">
                {fields.relatedPostIds.map((id) => (
                  <li key={id} className="flex items-center justify-between gap-2 bg-brand-tint py-1 pl-2.5 pr-1 text-sm">
                    <span className="min-w-0 truncate">{allPosts.find((item) => item.id === id)?.title ?? `#${id}`}</span>
                    <button
                      type="button"
                      aria-label="移除相關文章"
                      className="flex size-7 shrink-0 items-center justify-center"
                      onClick={() => set('relatedPostIds', fields.relatedPostIds.filter((item) => item !== id))}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <select
              id="input-related"
              value=""
              onChange={(event) => {
                const id = Number(event.target.value)
                if (id && !fields.relatedPostIds.includes(id)) set('relatedPostIds', [...fields.relatedPostIds, id])
              }}
              className={inputClass}
            >
              <option value="">選擇要加入的文章（未選時自動帶同分類）</option>
              {allPosts
                .filter((item) => item.id !== postId && !fields.relatedPostIds.includes(item.id))
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
            </select>
          </div>

          <div id={fieldAnchor('social')} className="scroll-mt-20 space-y-3">
            <p className="text-sm font-bold">社群分享</p>
            <input aria-label="社群分享標題" placeholder="分享標題（未填沿用 SEO 標題）" value={fields.ogTitle} onChange={(event) => set('ogTitle', event.target.value)} className={inputClass} />
            <textarea aria-label="社群分享描述" placeholder="分享描述（未填沿用 SEO 描述）" rows={2} value={fields.ogDescription} onChange={(event) => set('ogDescription', event.target.value)} className={inputClass} />
            <ImageUploader
              images={fields.ogImageUrl ? [fields.ogImageUrl] : []}
              onChange={(images) => set('ogImageUrl', images[0] ?? '')}
              single
            />
          </div>

          <Field id="canonicalUrl" label="canonical 覆寫" hint="一般不用填，系統會指向這篇文章的正式網址。">
            <input id="input-canonicalUrl" type="url" inputMode="url" value={fields.canonicalUrl} onChange={(event) => set('canonicalUrl', event.target.value)} className={inputClass} />
          </Field>

          {isPublished && (
            <Field id="publishedAt" label="發布時間（台灣時間）">
              <input id="input-publishedAt" type="datetime-local" value={fields.publishedAt} onChange={(event) => set('publishedAt', event.target.value)} className={inputClass} />
            </Field>
          )}

          <label className="flex min-h-8 items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5 size-4" checked={fields.noindex} onChange={(event) => set('noindex', event.target.checked)} />
            不讓搜尋引擎收錄（noindex，同時從 sitemap 移除）
          </label>

          {mode === 'edit' && isPublished && (
            <button type="button" className={secondaryButton} onClick={handleUnpublish}>
              下架這篇文章
            </button>
          )}
        </div>
      </details>

      {/* Bottom action bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-rule bg-brand-raised md:left-60"
        style={{ transform: keyboardOffset ? `translateY(-${keyboardOffset}px)` : undefined }}
      >
        {panel === 'checklist' && (
          <div className="max-h-[50vh] overflow-y-auto border-b border-brand-rule p-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">發布前檢查</h2>
                <button type="button" aria-label="關閉" className="flex size-9 items-center justify-center" onClick={() => setPanel(null)}>
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              {issues.length > 0 ? (
                <ul className="mt-1">
                  {issues.map((issue, index) => (
                    <li key={`${issue.field}-${index}`}>
                      <button type="button" onClick={() => jumpTo(issue.field)} className="w-full py-2 text-left text-sm text-brand-alert underline-offset-4 hover:underline">
                        {issue.message}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 py-2 text-sm">必填項目都完成了。</p>
              )}
              {check.recommended.length > 0 && (
                <>
                  <h3 className="mt-3 text-sm font-bold">建議補上</h3>
                  <ul className="mt-1">
                    {check.recommended.map((issue, index) => (
                      <li key={`${issue.field}-${index}`}>
                        <button type="button" onClick={() => jumpTo(issue.field)} className="w-full py-2 text-left text-sm text-brand-muted underline-offset-4 hover:underline">
                          {issue.message}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {panel === 'schedule' && (
          <div className="border-b border-brand-rule p-4">
            <div className="mx-auto flex max-w-3xl flex-wrap items-end gap-3">
              <label className="min-w-0 flex-1 text-sm font-bold" htmlFor="input-scheduledAt">
                發布時間（台灣時間）
                <input
                  id="input-scheduledAt"
                  type="datetime-local"
                  value={fields.scheduledAt}
                  onChange={(event) => set('scheduledAt', event.target.value)}
                  className={`${inputClass} mt-1.5 font-normal`}
                />
              </label>
              <button type="button" className={primaryButton} disabled={Boolean(saving) || !fields.scheduledAt} onClick={() => submit('schedule')}>
                {saving === 'schedule' ? '排程中…' : '確認排程'}
              </button>
              {isScheduled && (
                <button type="button" className={secondaryButton} disabled={Boolean(saving)} onClick={() => submit('draft')}>
                  取消排程
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setPanel(panel === 'checklist' ? null : 'checklist')}
            className="mr-auto min-h-11 shrink-0 whitespace-nowrap text-left text-[13px] leading-4"
          >
            <span className="block font-bold">{POST_STATUS_LABELS[status] ?? status}</span>
            <span className={issues.length ? 'text-brand-alert underline' : 'text-brand-muted underline'}>
              {issues.length ? `還缺 ${issues.length} 項` : `完成度 ${check.completion}%`}
            </span>
          </button>

          {!isPublished && (
            <button type="button" className={secondaryButton} disabled={Boolean(saving)} onClick={() => submit(isScheduled ? 'update' : 'draft')}>
              {saving === 'draft' || saving === 'update' ? '儲存中…' : isScheduled ? '儲存' : '存草稿'}
            </button>
          )}
          <button
            type="button"
            className={secondaryButton}
            disabled={Boolean(saving)}
            onClick={() => {
              if (isPublished) window.open(`/blog/${encodeURI(savedSlug)}`, '_blank')
              else void submit(isScheduled ? 'update' : 'draft', { preview: true })
            }}
          >
            {saving === 'preview' ? '開啟中…' : isPublished ? '看文章' : '預覽'}
          </button>
          {!isPublished && (
            <button type="button" className={secondaryButton} disabled={Boolean(saving)} onClick={() => setPanel(panel === 'schedule' ? null : 'schedule')}>
              排程
            </button>
          )}
          {isPublished ? (
            <button type="button" className={primaryButton} disabled={Boolean(saving)} onClick={() => submit('update')}>
              {saving === 'update' ? '更新中…' : '更新'}
            </button>
          ) : (
            <button type="button" className={primaryButton} disabled={Boolean(saving)} onClick={() => submit('publish')}>
              {saving === 'publish' ? '發布中…' : '發布'}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
