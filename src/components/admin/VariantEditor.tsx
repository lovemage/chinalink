'use client'

export interface Variant {
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  stock: number
  isDefault: boolean
  isActive: boolean
  specs?: { key: string; value: string }[]
}

interface VariantEditorProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
}

const cellClass =
  'px-2 py-1.5 text-sm border border-brand-rule focus:outline-none focus:ring-1 focus:ring-brand-primary w-full'

export default function VariantEditor({ variants, onChange }: VariantEditorProps) {
  function updateVariant(index: number, field: keyof Variant, value: string | number | boolean) {
    onChange(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }

  function removeVariant(index: number) {
    const next = variants.filter((_, i) => i !== index)
    // If removed variant was default and there are remaining, set first as default
    const hadDefault = variants[index].isDefault
    if (hadDefault && next.length > 0) {
      next[0] = { ...next[0], isDefault: true }
    }
    onChange(next)
  }

  function addVariant() {
    const isFirst = variants.length === 0
    onChange([
      ...variants,
      {
        sku: '',
        name: '',
        price: 0,
        compareAtPrice: undefined,
        stock: 0,
        isDefault: isFirst,
        isActive: true,
      },
    ])
  }

  function setDefault(index: number) {
    onChange(variants.map((v, i) => ({ ...v, isDefault: i === index })))
  }

  return (
    <div className="space-y-3">
      {variants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-bg border border-brand-rule">
                <th className="px-3 py-2 text-left text-xs font-medium text-brand-muted border-r border-brand-rule min-w-[90px]">
                  SKU
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-brand-muted border-r border-brand-rule min-w-[110px]">
                  名稱
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-brand-muted border-r border-brand-rule min-w-[90px]">
                  價格
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-brand-muted border-r border-brand-rule min-w-[90px]">
                  原價
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-brand-muted border-r border-brand-rule min-w-[80px]">
                  庫存
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-brand-muted border-r border-brand-rule w-14">
                  預設
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-brand-muted border-r border-brand-rule w-14">
                  啟用
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-brand-muted w-12">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={i} className="border border-brand-rule hover:bg-brand-bg transition-colors">
                  <td className="px-2 py-1.5 border-r border-brand-rule">
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                      placeholder="SKU-001"
                      className={cellClass}
                    />
                  </td>
                  <td className="px-2 py-1.5 border-r border-brand-rule">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => updateVariant(i, 'name', e.target.value)}
                      placeholder="規格名稱"
                      className={cellClass}
                    />
                  </td>
                  <td className="px-2 py-1.5 border-r border-brand-rule">
                    <input
                      type="number"
                      min="0"
                      value={v.price || ''}
                      onChange={(e) => updateVariant(i, 'price', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className={cellClass}
                    />
                  </td>
                  <td className="px-2 py-1.5 border-r border-brand-rule">
                    <input
                      type="number"
                      min="0"
                      value={v.compareAtPrice ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        updateVariant(i, 'compareAtPrice', val ? parseInt(val) : 0)
                      }}
                      placeholder="—"
                      className={cellClass}
                    />
                  </td>
                  <td className="px-2 py-1.5 border-r border-brand-rule">
                    <input
                      type="number"
                      min="0"
                      value={v.stock || ''}
                      onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className={cellClass}
                    />
                  </td>
                  <td className="px-2 py-1.5 border-r border-brand-rule text-center">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={v.isDefault}
                      onChange={() => setDefault(i)}
                      className="w-4 h-4 text-brand-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-2 py-1.5 border-r border-brand-rule text-center">
                    <input
                      type="checkbox"
                      checked={v.isActive}
                      onChange={(e) => updateVariant(i, 'isActive', e.target.checked)}
                      className="w-4 h-4 border-brand-rule text-brand-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none"
                      aria-label="移除規格"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {variants.length === 0 && (
        <p className="text-sm text-brand-muted">尚無規格，請至少新增一個規格</p>
      )}

      <button
        type="button"
        onClick={addVariant}
        className="text-xs text-brand-primary hover:text-brand-deep font-medium"
      >
        + 新增規格
      </button>
    </div>
  )
}
