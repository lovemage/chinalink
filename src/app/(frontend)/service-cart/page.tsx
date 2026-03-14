export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Service, ServiceCategory } from '@/payload-types'
import { ServiceCartClient } from '@/components/service-cart/ServiceCartClient'

export const metadata = {
  title: '服務選購 - 懂陸姐 ChinaLink',
  description: '選擇您需要的服務項目，輕鬆加入購物車並完成預約。',
}

export default async function ServiceCartPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>
}) {
  const { add } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const categoriesResult = await payload.find({
    collection: 'service-categories',
    limit: 100,
  })

  const servicesResult = await payload.find({
    collection: 'services',
    where: {
      status: { equals: 'published' },
      visibility: { equals: 'public' },
    },
    limit: 100,
    depth: 1,
    sort: '-createdAt',
  })

  const categories = categoriesResult.docs as ServiceCategory[]
  const services = servicesResult.docs as Service[]

  // Parse the service ID to auto-add from query param
  const initialAddId = add ? parseInt(add, 10) : undefined

  return (
    <ServiceCartClient
      services={services}
      categories={categories}
      initialAddServiceId={initialAddId && !isNaN(initialAddId) ? initialAddId : undefined}
    />
  )
}
