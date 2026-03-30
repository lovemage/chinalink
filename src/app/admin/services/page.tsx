import Link from 'next/link'
import { getServices } from '@/lib/queries/services'
import { getServiceCategories } from '@/lib/queries/categories'
import ServicesTable from './ServicesTable'

interface PageProps {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    status?: string
  }>
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ''
  const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined
  const status = params.status ?? ''

  const [servicesList, categories] = await Promise.all([
    getServices({
      search: search || undefined,
      categoryId,
      status: status || undefined,
    }),
    getServiceCategories(),
  ])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">服務管理</h1>
        <Link
          href="/admin/services/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          新增服務
        </Link>
      </div>

      <ServicesTable
        services={servicesList}
        categories={categories}
        initialSearch={search}
        initialCategoryId={categoryId?.toString() ?? ''}
        initialStatus={status}
      />
    </div>
  )
}
