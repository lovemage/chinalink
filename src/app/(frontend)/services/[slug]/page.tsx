export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PricingSection } from '@/components/services/PricingSection'
import { InquiryForm } from '@/components/services/InquiryForm'
import { MaterialSymbol } from '@/components/ui/MaterialSymbol'
import { defaultServiceIconName } from '@/lib/services/serviceIcons'
import type { Service, ServiceCategory, Media } from '@/payload-types'
import type { ComponentProps } from 'react'

type BlockRendererBlocks = ComponentProps<typeof BlockRenderer>['blocks']

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

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const lineUrl = (siteSettings as { lineOfficialUrl?: string } | null)?.lineOfficialUrl || ''

  const cover = typeof service.coverImage === 'object' && service.coverImage ? (service.coverImage as Media) : null
  const category = typeof service.serviceCategory === 'object' && service.serviceCategory ? (service.serviceCategory as ServiceCategory) : null

  return (
    <article className="relative min-h-screen overflow-hidden bg-brand-bg pt-32 pb-24">
      <div className="pointer-events-none absolute top-0 left-0 h-[50vh] w-full bg-gradient-to-b from-brand-primary/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Back link */}
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          返回服務列表
        </Link>

        {/* Cover image */}
        {cover?.url && (
          <div className="relative mb-12 aspect-[2/1] overflow-hidden rounded-[2.5rem] border border-white/50 shadow-2xl shadow-brand-text/5">
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
        <div className="mb-4 text-center sm:text-left">
          {category && (
            <span className="inline-block rounded-full border border-brand-primary/20 bg-white/50 px-5 py-1.5 text-xs font-semibold tracking-widest text-brand-primary uppercase backdrop-blur-md shadow-sm">
              {category.name}
            </span>
          )}
        </div>

        <h1 className="text-center font-serif text-4xl font-medium leading-tight text-brand-text sm:text-left sm:text-5xl lg:text-6xl">
          {service.title}
        </h1>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Main content column */}
          <div className="rounded-[2.5rem] border border-brand-primary/10 bg-white p-8 shadow-xl shadow-brand-primary/5 sm:p-12">
            {/* Block content */}
            {service.description && (
              <div className="prose prose-lg prose-stone max-w-none font-light leading-relaxed text-brand-muted prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-text prose-a:text-brand-primary">
                <BlockRenderer blocks={service.description as BlockRendererBlocks} />
              </div>
            )}

            {/* Features list */}
            {service.features && service.features.length > 0 && (
              <div className="mt-12 border-t border-brand-primary/10 pt-12">
                <h2 className="mb-6 font-serif text-2xl font-medium text-brand-text">服務特點</h2>
                <ul className="space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-4">
                      <div className="mt-1 flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-2xl bg-brand-primary/8 text-brand-primary ring-1 ring-brand-primary/12">
                        <MaterialSymbol name={service.iconName || defaultServiceIconName} className="text-[34px]" />
                      </div>
                      <span className="text-lg font-light leading-relaxed text-brand-muted">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inquiry form for custom pricing */}
            {service.pricingMode === 'custom' && (
              <div className="mt-12 border-t border-brand-primary/10 pt-12">
                <h2 className="mb-6 font-serif text-2xl font-medium text-brand-text">專屬諮詢</h2>
                <InquiryForm serviceId={service.id} serviceTitle={service.title} />
              </div>
            )}
          </div>

          {/* Sidebar pricing */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <PricingSection service={service} lineUrl={lineUrl} />
          </div>
        </div>
      </div>
    </article>
  )
}
