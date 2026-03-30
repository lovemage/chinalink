import Link from 'next/link'
import { getServiceCategories } from '@/lib/queries/categories'
import ServiceForm from '@/components/admin/ServiceForm'

export default async function NewServicePage() {
  const categories = await getServiceCategories()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/services"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回服務管理
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">新增服務</h1>

      <ServiceForm
        categories={categories}
        mode="create"
      />
    </div>
  )
}
