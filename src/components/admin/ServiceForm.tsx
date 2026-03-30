'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminFormField from '@/components/admin/AdminFormField'
import ImageUploader from '@/components/admin/ImageUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { createService, updateService } from '@/lib/actions/services'
import { useToast } from '@/components/admin/AdminToast'

const ICON_OPTIONS = [
  'handshake',
  'phone_android',
  'shopping_cart',
  'store',
  'campaign',
  'account_balance',
  'inventory',
  'support_agent',
]

interface AddonRow {
  name: string
  price: string
  required: boolean
  sortOrder: number
}

interface FeatureRow {
  text: string
  sortOrder: number
}

interface ServiceFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service?: any
  categories: { id: number; name: string }[]
  mode: 'create' | 'edit'
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

export default function ServiceForm({ service, categories, mode }: ServiceFormProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Basic info
  const [title, setTitle] = useState(service?.title ?? '')
  const [slug, setSlug] = useState(service?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [categoryId, setCategoryId] = useState(String(service?.serviceCategoryId ?? ''))
  const [iconName, setIconName] = useState(service?.iconName ?? 'handshake')

  // Cover image
  const [coverImages, setCoverImages] = useState<string[]>(
    service?.coverImage?.url ? [service.coverImage.url] : []
  )

  // Description
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [description, setDescription] = useState<any>(service?.description ?? null)

  // Status & visibility
  const [status, setStatus] = useState(service?.status ?? 'draft')
  const [visibility, setVisibility] = useState(service?.visibility ?? 'public')
  const [cartEnabled, setCartEnabled] = useState(service?.cartEnabled ?? true)

  // Pricing
  const [pricingMode, setPricingMode] = useState(service?.pricingMode ?? 'fixed')
  const [price, setPrice] = useState(String(service?.price ?? ''))
  const [basePrice, setBasePrice] = useState(String(service?.basePrice ?? ''))
  const [addons, setAddons] = useState<AddonRow[]>(
    (service?.addons ?? []).map((a: AddonRow & { price: number }) => ({
      name: a.name,
      price: String(a.price),
      required: a.required,
      sortOrder: a.sortOrder,
    }))
  )

  // Features
  const [features, setFeatures] = useState<FeatureRow[]>(
    service?.features ?? []
  )

  // SEO
  const [seoTitle, setSeoTitle] = useState(service?.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(service?.seoDescription ?? '')

  // Auto-generate slug from title (only if not manually touched)
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugTouched])

  // --- Addon helpers ---
  function addAddon() {
    setAddons((prev) => [
      ...prev,
      { name: '', price: '', required: false, sortOrder: prev.length },
    ])
  }

  function removeAddon(index: number) {
    setAddons((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAddon(index: number, field: keyof AddonRow, value: string | boolean) {
    setAddons((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    )
  }

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

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = '服務名稱為必填'
    if (!slug.trim()) newErrors.slug = 'Slug 為必填'
    if (pricingMode === 'fixed' && price && isNaN(parseInt(price))) {
      newErrors.price = '價格必須為數字'
    }
    if (pricingMode === 'addons' && basePrice && isNaN(parseInt(basePrice))) {
      newErrors.basePrice = '基本價格必須為數字'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    if (mode === 'edit') formData.set('id', String(service.id))

    formData.set('title', title)
    formData.set('slug', slug)
    if (categoryId) formData.set('categoryId', categoryId)
    formData.set('iconName', iconName)
    formData.set('coverImageUrl', coverImages[0] ?? '')
    formData.set('description', description ? JSON.stringify(description) : '')
    formData.set('status', status)
    formData.set('visibility', visibility)
    formData.set('cartEnabled', String(cartEnabled))
    formData.set('pricingMode', pricingMode)
    if (price) formData.set('price', price)
    if (basePrice) formData.set('basePrice', basePrice)

    const addonsPayload = addons
      .filter((a) => a.name.trim())
      .map((a, i) => ({
        name: a.name.trim(),
        price: parseInt(a.price) || 0,
        required: a.required,
        sortOrder: i,
      }))
    formData.set('addons', JSON.stringify(addonsPayload))

    const featuresPayload = features
      .filter((f) => f.text.trim())
      .map((f, i) => ({ text: f.text.trim(), sortOrder: i }))
    formData.set('features', JSON.stringify(featuresPayload))

    formData.set('seoTitle', seoTitle)
    formData.set('seoDescription', seoDescription)

    try {
      if (mode === 'create') {
        const result = await createService(formData)
        if ('error' in result) {
          addToast(result.error, 'error')
        } else {
          router.push('/admin/services')
        }
      } else {
        const result = await updateService(formData)
        if ('error' in result) {
          addToast(result.error, 'error')
        } else {
          addToast('服務已更新', 'success')
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

        <AdminFormField label="服務名稱" name="title" required error={errors.title}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="例如：跨境物流諮詢"
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
            placeholder="cross-border-logistics"
          />
        </AdminFormField>

        <AdminFormField label="服務分類" name="categoryId">
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

        <AdminFormField label="圖示名稱" name="iconName" description="Material Symbols 圖示名稱">
          <select
            id="iconName"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            className={selectClass}
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </AdminFormField>
      </section>

      {/* Section 2: Cover Image */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">封面圖片</h2>
        <AdminFormField label="封面圖片" name="coverImage">
          <ImageUploader images={coverImages} onChange={setCoverImages} single />
        </AdminFormField>
      </section>

      {/* Section 3: Description */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">服務說明</h2>
        <AdminFormField label="詳細說明" name="description">
          <TiptapEditor
            content={description}
            onChange={setDescription}
            placeholder="輸入服務的詳細說明..."
          />
        </AdminFormField>
      </section>

      {/* Section 4: Status & Visibility */}
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

        <AdminFormField label="購物車功能" name="cartEnabled">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              id="cartEnabled"
              type="checkbox"
              checked={cartEnabled}
              onChange={(e) => setCartEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">啟用購物車（允許線上購買）</span>
          </label>
        </AdminFormField>
      </section>

      {/* Section 5: Pricing */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">定價</h2>

        <AdminFormField label="定價模式" name="pricingMode">
          <select
            id="pricingMode"
            value={pricingMode}
            onChange={(e) => setPricingMode(e.target.value)}
            className={selectClass}
          >
            <option value="fixed">固定價格</option>
            <option value="addons">基本價格 + 加購項目</option>
            <option value="custom">洽談訂製</option>
          </select>
        </AdminFormField>

        {pricingMode === 'fixed' && (
          <AdminFormField label="價格（TWD）" name="price" error={errors.price}>
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </AdminFormField>
        )}

        {pricingMode === 'addons' && (
          <>
            <AdminFormField label="基本價格（TWD）" name="basePrice" error={errors.basePrice}>
              <input
                id="basePrice"
                type="number"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </AdminFormField>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">加購項目</span>
                <button
                  type="button"
                  onClick={addAddon}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  + 新增項目
                </button>
              </div>

              {addons.length === 0 && (
                <p className="text-sm text-gray-400">尚無加購項目</p>
              )}

              {addons.map((addon, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => updateAddon(i, 'name', e.target.value)}
                    placeholder="項目名稱"
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    value={addon.price}
                    onChange={(e) => updateAddon(i, 'price', e.target.value)}
                    placeholder="價格"
                    className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                    <input
                      type="checkbox"
                      checked={addon.required}
                      onChange={(e) => updateAddon(i, 'required', e.target.checked)}
                      className="w-3.5 h-3.5"
                    />
                    必選
                  </label>
                  <button
                    type="button"
                    onClick={() => removeAddon(i)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none shrink-0"
                    aria-label="移除"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {pricingMode === 'custom' && (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            洽談訂製模式：不顯示固定價格，客戶需聯繫詢價。
          </p>
        )}
      </section>

      {/* Section 6: Features */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">服務特點</h2>

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
            <p className="text-sm text-gray-400">尚無服務特點</p>
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

      {/* Section 7: SEO */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">SEO 設定</h2>

        <AdminFormField label="SEO 標題" name="seoTitle" description="留空則使用服務名稱">
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
          {submitting ? '儲存中...' : mode === 'create' ? '建立服務' : '儲存變更'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
