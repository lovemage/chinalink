export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ServiceFilters } from '@/components/services/ServiceFilters'
import { ServiceCard } from '@/components/services/ServiceCard'
import type { Service, ServiceCategory } from '@/payload-types'
import type { Where } from 'payload'

export const metadata = {
  title: '服務列表 - 懂陸姐 ChinaLink',
  description: '懂陸姐提供帳號代辦、代購驗貨、公司註冊、新媒體運營等全方位大陸經營服務',
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const categoriesResult = await payload.find({
    collection: 'service-categories',
    limit: 100,
  })

  const where: Where = {
    status: { equals: 'published' },
    visibility: { equals: 'public' },
  }

  if (category) {
    const matchedCategory = categoriesResult.docs.find(
      (c: ServiceCategory) => c.slug === category,
    )
    if (matchedCategory) {
      where.serviceCategory = { equals: matchedCategory.id }
    }
  }

  const servicesResult = await payload.find({
    collection: 'services',
    where,
    limit: 100,
    depth: 1,
  })

  const categories = categoriesResult.docs as ServiceCategory[]
  const services = servicesResult.docs as Service[]

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-brand-text sm:text-4xl">我們的服務</h1>
        <p className="mt-3 text-brand-muted">
          從帳號辦理到公司註冊，懂陸姐幫你搞定大陸經營的大小事
        </p>

        <div className="mt-8">
          <ServiceFilters categories={categories} />
        </div>

        {services.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg text-brand-muted">目前沒有符合條件的服務</p>
          </div>
        )}
      </div>
    </section>
  )
}
