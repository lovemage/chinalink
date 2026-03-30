import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getService } from '@/lib/queries/services'
import { getServiceCategories } from '@/lib/queries/categories'
import ServiceForm from '@/components/admin/ServiceForm'
import { deleteService } from '@/lib/actions/services'
import DeleteServiceButton from './DeleteServiceButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params
  const serviceId = parseInt(id)

  if (isNaN(serviceId)) notFound()

  const [service, categories] = await Promise.all([
    getService(serviceId),
    getServiceCategories(),
  ])

  if (!service) notFound()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/services"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回服務管理
        </Link>
        <DeleteServiceButton serviceId={serviceId} serviceTitle={service.title} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">編輯服務：{service.title}</h1>

      <ServiceForm
        service={service}
        categories={categories}
        mode="edit"
      />
    </div>
  )
}
