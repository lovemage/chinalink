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

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const lineUrl = (siteSettings as { lineOfficialUrl?: string } | null)?.lineOfficialUrl || ''

  const categories = categoriesResult.docs as ServiceCategory[]
  const services = servicesResult.docs as Service[]

  return (
    <section className="relative min-h-screen overflow-hidden bg-brand-bg pt-32 pb-24">
      {/* Background organic shape */}
      <div className="pointer-events-none absolute -top-20 right-0 h-[600px] w-[600px] rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-brand-primary/5 blur-3xl opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary" />
            Our Services
          </div>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl">
            專業服務 <span className="font-playfair italic text-brand-primary">Solutions</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-brand-muted">
            從帳號辦理到公司註冊，懂陸姐幫你搞定大陸經營的大小事，讓您的兩岸商務之旅暢通無阻。
          </p>
        </div>

        <div className="mt-12">
          <ServiceFilters categories={categories} />
        </div>

        {services.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} lineUrl={lineUrl} />
            ))}
          </div>
        ) : (
          <div className="mt-24 text-center">
            <p className="font-serif text-xl text-brand-muted">目前沒有符合條件的服務</p>
          </div>
        )}
      </div>
    </section>
  )
}
