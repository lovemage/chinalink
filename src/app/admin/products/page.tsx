import Link from 'next/link'
import { getProducts } from '@/lib/queries/products'
import { getProductCategories } from '@/lib/queries/categories'
import ProductsTable from './ProductsTable'

interface PageProps {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    status?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ''
  const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined
  const status = params.status ?? ''

  const [productsList, categories] = await Promise.all([
    getProducts({
      search: search || undefined,
      categoryId,
      status: status || undefined,
    }),
    getProductCategories(),
  ])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">產品管理</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          新增產品
        </Link>
      </div>

      <ProductsTable
        products={productsList}
        categories={categories}
        initialSearch={search}
        initialCategoryId={categoryId?.toString() ?? ''}
        initialStatus={status}
      />
    </div>
  )
}
