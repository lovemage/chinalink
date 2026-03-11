export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PricingSection } from '@/components/services/PricingSection'
import { InquiryForm } from '@/components/services/InquiryForm'
import type { Service, ServiceCategory, Media } from '@/payload-types'
import { CheckCircle2 } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  const service = result.docs[0] as Service | undefined
  if (!service) return { title: '找不到服務' }

  return {
    title: service.seo?.metaTitle || `${service.title} - 懂陸姐 ChinaLink`,
    description: service.seo?.metaDescription || `懂陸姐 - ${service.title}`,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
      visibility: { in: ['public', 'unlisted'] },
    },
    limit: 1,
    depth: 2,
  })

  const service = result.docs[0] as Service | undefined
  if (!service) notFound()

  const cover = typeof service.coverImage === 'object' && service.coverImage ? (service.coverImage as Media) : null
  const category = typeof service.serviceCategory === 'object' && service.serviceCategory ? (service.serviceCategory as ServiceCategory) : null

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Cover image */}
        {cover?.url && (
          <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-2xl">
            <Image
              src={cover.sizes?.hero?.url || cover.url}
              alt={cover.alt || service.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Category badge */}
        {category && (
          <span className="mb-3 inline-block rounded-full bg-brand-primary/10 px-4 py-1 text-sm font-medium text-brand-primary">
            {category.name}
          </span>
        )}

        <h1 className="text-3xl font-bold text-brand-text sm:text-4xl">{service.title}</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content column */}
          <div>
            {/* Block content */}
            {service.description && (
              <BlockRenderer blocks={service.description as unknown as any[]} />
            )}

            {/* Features list */}
            {service.features && service.features.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-brand-text">服務特點</h2>
                <ul className="mt-4 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-primary" />
                      <span className="text-brand-text">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inquiry form for custom pricing */}
            {service.pricingMode === 'custom' && (
              <div className="mt-10">
                <InquiryForm serviceId={service.id} serviceTitle={service.title} />
              </div>
            )}
          </div>

          {/* Sidebar pricing */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PricingSection service={service} />
          </div>
        </div>
      </div>
    </article>
  )
}
