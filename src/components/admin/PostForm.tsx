'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminFormField from '@/components/admin/AdminFormField'
import ImageUploader from '@/components/admin/ImageUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { createPost, updatePost } from '@/lib/actions/posts'
import { useToast } from '@/components/admin/AdminToast'

interface PostFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post?: any
  categories: { id: number; name: string }[]
  mode: 'create' | 'edit'
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16)
}

export default function PostForm({ post, categories, mode }: PostFormProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Basic info
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [categoryId, setCategoryId] = useState(String(post?.categoryId ?? ''))
  const [author, setAuthor] = useState(post?.author ?? '懂陸姐')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')

  // Cover image
  const [coverImages, setCoverImages] = useState<string[]>(
    post?.coverImage?.url ? [post.coverImage.url] : []
  )

  // Status & publish date
  const [status, setStatus] = useState(post?.status ?? 'draft')
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(post?.publishedAt))

  // Content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any>(post?.content ?? null)

  // SEO
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? '')

  // Auto-generate slug from title (only if not manually touched)
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugTouched])

  // Auto-set publishedAt when status changes to published
  useEffect(() => {
    if (status === 'published' && !publishedAt) {
      setPublishedAt(toDateInputValue(new Date()))
    }
  }, [status, publishedAt])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = '文章標題為必填'
    if (!slug.trim()) newErrors.slug = 'Slug 為必填'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    if (mode === 'edit') formData.set('id', String(post.id))

    formData.set('title', title)
    formData.set('slug', slug)
    if (categoryId) formData.set('categoryId', categoryId)
    formData.set('coverImageUrl', coverImages[0] ?? '')
    formData.set('excerpt', excerpt)
    formData.set('author', author)
    formData.set('status', status)
    if (publishedAt) formData.set('publishedAt', publishedAt)
    formData.set('content', content ? JSON.stringify(content) : '')
    formData.set('seoTitle', seoTitle)
    formData.set('seoDescription', seoDescription)

    try {
      if (mode === 'create') {
        const result = await createPost(formData)
        if ('error' in result) {
          addToast(result.error, 'error')
        } else {
          router.push('/admin/posts')
        }
      } else {
        const result = await updatePost(formData)
        if ('error' in result) {
          addToast(result.error, 'error')
        } else {
          addToast('文章已更新', 'success')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const selectClass = inputClass

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Section 1: Basic Info */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">基本資訊</h2>

        <AdminFormField label="文章標題" name="title" required error={errors.title}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="例如：2024 跨境電商趨勢分析"
          />
        </AdminFormField>

        <AdminFormField
          label="Slug"
          name="slug"
          required
          error={errors.slug}
          description="URL 路徑識別符，留空將依標題自動產生"
        >
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            className={inputClass}
            placeholder="2024-cross-border-ecommerce-trends"
          />
        </AdminFormField>

        <AdminFormField label="分類" name="categoryId">
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={selectClass}
          >
            <option value="">— 不分類 —</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </AdminFormField>

        <AdminFormField label="作者" name="author">
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClass}
            placeholder="懂陸姐"
          />
        </AdminFormField>

        <AdminFormField label="摘要" name="excerpt" description="顯示於文章列表的簡短說明">
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="輸入文章摘要..."
          />
        </AdminFormField>
      </section>

      {/* Section 2: Cover Image */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">封面圖片</h2>
        <AdminFormField label="封面圖片" name="coverImage">
          <ImageUploader images={coverImages} onChange={setCoverImages} single />
        </AdminFormField>
      </section>

      {/* Section 3: Status */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">發布設定</h2>

        <div className="grid grid-cols-2 gap-4">
          <AdminFormField label="狀態" name="status">
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              <option value="draft">草稿</option>
              <option value="published">已發布</option>
            </select>
          </AdminFormField>

          <AdminFormField label="發布日期" name="publishedAt" description="留空則不顯示發布時間">
            <input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputClass}
            />
          </AdminFormField>
        </div>
      </section>

      {/* Section 4: Content */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">文章內容</h2>
        <AdminFormField label="內文" name="content">
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="輸入文章內容..."
          />
        </AdminFormField>
      </section>

      {/* Section 5: SEO */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">SEO 設定</h2>

        <AdminFormField label="SEO 標題" name="seoTitle" description="留空則使用文章標題">
          <input
            id="seoTitle"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className={inputClass}
            placeholder="搜尋引擎顯示的標題"
          />
        </AdminFormField>

        <AdminFormField label="SEO 描述" name="seoDescription">
          <textarea
            id="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="搜尋引擎顯示的描述文字（建議 120–160 字元）"
          />
        </AdminFormField>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3 pb-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '儲存中...' : mode === 'create' ? '建立文章' : '儲存變更'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
