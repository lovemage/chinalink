import Link from 'next/link'
import { getProductCategories, getProductTags } from '@/lib/queries/categories'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const [categories, tags] = await Promise.all([
    getProductCategories(),
    getProductTags(),
  ])

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-sm text-brand-muted hover:text-brand-muted transition-colors"
        >
          ← 返回產品管理
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-brand-text">新增產品</h1>

      <ProductForm
        categories={categories}
        tags={tags}
        mode="create"
      />
    </div>
  )
}
