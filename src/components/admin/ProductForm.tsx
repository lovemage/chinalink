'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminFormField from '@/components/admin/AdminFormField'
import ImageUploader from '@/components/admin/ImageUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import VariantEditor, { Variant } from '@/components/admin/VariantEditor'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { useToast } from '@/components/admin/AdminToast'

interface FeatureRow {
  text: string
  sortOrder: number
}

interface ProductFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any
  categories: { id: number; name: string }[]
  tags: { id: number; name: string }[]
  mode: 'create' | 'edit'
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

export default function ProductForm({ product, categories, tags, mode }: ProductFormProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Basic info
  const [title, setTitle] = useState(product?.title ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [categoryId, setCategoryId] = useState(String(product?.productCategoryId ?? ''))
  const [summary, setSummary] = useState(product?.summary ?? '')

  // Cover image
  const [coverImages, setCoverImages] = useState<string[]>(
    product?.coverImage?.url ? [product.coverImage.url] : []
  )

  // Additional images
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    (product?.images ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img: any) => img.media?.url
    ).filter(Boolean) ?? []
  )

  // Description
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [description, setDescription] = useState<any>(product?.description ?? null)

  // Variants
  const [variants, setVariants] = useState<Variant[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (product?.variants ?? []).map((v: any) => ({
      sku: v.sku,
      name: v.name,
      price: v.price,
      compareAtPrice: v.compareAtPrice ?? undefined,
      stock: v.stock,
      isDefault: v.isDefault ?? false,
      isActive: v.isActive ?? true,
      specs: v.specs ?? [],
    }))
  )

  // Features
  const [features, setFeatures] = useState<FeatureRow[]>(
    product?.features ?? []
  )

  // Tags
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (product?.tagRelations ?? []).map((tr: any) => tr.tagId ?? tr.tag?.id).filter(Boolean) ?? []
  )

  // Status & visibility
  const [status, setStatus] = useState(product?.status ?? 'draft')
  const [visibility, setVisibility] = useState(product?.visibility ?? 'public')

  // SEO
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription ?? '')

  // Auto-generate slug from title (only if not manually touched)
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugTouched])

  // --- Feature helpers ---
  function addFeature() {
    setFeatures((prev) => [...prev, { text: '', sortOrder: prev.length }])
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  function updateFeature(index: number, value: string) {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, text: value } : f))
    )
  }

  // --- Tag helpers ---
  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = '產品名稱為必填'
    if (!slug.trim()) newErrors.slug = 'Slug 為必填'
    if (variants.length === 0) newErrors.variants = '至少需要一個規格'
    if (variants.some((v) => !v.sku.trim())) newErrors.variants = '每個規格都需要填寫 SKU'
    if (variants.some((v) => !v.name.trim())) newErrors.variants = '每個規格都需要填寫名稱'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    if (mode === 'edit') formData.set('id', String(product.id))

    formData.set('title', title)
    formData.set('slug', slug)
    if (categoryId) formData.set('categoryId', categoryId)
    formData.set('summary', summary)
    formData.set('coverImageUrl', coverImages[0] ?? '')
    formData.set('description', description ? JSON.stringify(description) : '')
    formData.set('status', status)
    formData.set('visibility', visibility)
    formData.set('seoTitle', seoTitle)
    formData.set('seoDescription', seoDescription)

    const variantsPayload = variants.map((v, i) => ({
      sku: v.sku.trim(),
      name: v.name.trim(),
      price: v.price,
      compareAtPrice: v.compareAtPrice || undefined,
      stock: v.stock,
      isDefault: v.isDefault,
      isActive: v.isActive,
      specs: v.specs,
      sortOrder: i,
    }))
    formData.set('variants', JSON.stringify(variantsPayload))

    const featuresPayload = features
      .filter((f) => f.text.trim())
      .map((f, i) => ({ text: f.text.trim(), sortOrder: i }))
    formData.set('features', JSON.stringify(featuresPayload))

    formData.set('tagIds', JSON.stringify(selectedTagIds))
    formData.set('additionalImages', JSON.stringify(additionalImages))

    try {
      if (mode === 'create') {
        const result = await createProduct(formData)
        if ('error' in result) {
          addToast(result.error, 'error')
        } else {
          router.push('/admin/products')
        }
      } else {
        const result = await updateProduct(formData)
        if ('error' in result) {
          addToast(result.error, 'error')
        } else {
          addToast('產品已更新', 'success')
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

        <AdminFormField label="產品名稱" name="title" required error={errors.title}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="例如：跨境電商選品服務"
          />
        </AdminFormField>

        <AdminFormField
          label="Slug"
          name="slug"
          required
          error={errors.slug}
          description="URL 路徑識別符，留空將依名稱自動產生"
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
            placeholder="product-slug"
          />
        </AdminFormField>

        <AdminFormField label="產品分類" name="categoryId">
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

        <AdminFormField label="摘要" name="summary" description="短描述，顯示於列表頁">
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="一段簡短的產品描述..."
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

      {/* Section 3: Additional Images */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">附加圖片</h2>
        <AdminFormField label="產品圖片" name="additionalImages" description="可上傳多張產品展示圖">
          <ImageUploader images={additionalImages} onChange={setAdditionalImages} />
        </AdminFormField>
      </section>

      {/* Section 4: Description */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">產品說明</h2>
        <AdminFormField label="詳細說明" name="description">
          <TiptapEditor
            content={description}
            onChange={setDescription}
            placeholder="輸入產品的詳細說明..."
          />
        </AdminFormField>
      </section>

      {/* Section 5: Variants */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
          規格管理
          <span className="text-red-500 ml-1">*</span>
        </h2>
        {errors.variants && (
          <p className="text-xs text-red-500">{errors.variants}</p>
        )}
        <VariantEditor variants={variants} onChange={setVariants} />
      </section>

      {/* Section 6: Features */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">產品特點</h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">特點列表</span>
            <button
              type="button"
              onClick={addFeature}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              + 新增特點
            </button>
          </div>

          {features.length === 0 && (
            <p className="text-sm text-gray-400">尚無產品特點</p>
          )}

          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={feature.text}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={`特點 ${i + 1}`}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="text-red-400 hover:text-red-600 text-lg leading-none shrink-0"
                aria-label="移除"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Tags */}
      {tags.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">標籤</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Section 8: Status & Visibility */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">狀態與可見性</h2>

        <div className="grid grid-cols-2 gap-4">
          <AdminFormField label="發布狀態" name="status">
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

          <AdminFormField label="可見性" name="visibility">
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className={selectClass}
            >
              <option value="public">公開</option>
              <option value="private">私密</option>
              <option value="unlisted">不公開列出</option>
            </select>
          </AdminFormField>
        </div>
      </section>

      {/* Section 9: SEO */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">SEO 設定</h2>

        <AdminFormField label="SEO 標題" name="seoTitle" description="留空則使用產品名稱">
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
          {submitting ? '儲存中...' : mode === 'create' ? '建立產品' : '儲存變更'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
