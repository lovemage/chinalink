export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PricingSection } from '@/components/services/PricingSection'
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

            {/* LINE CTA for custom pricing */}
            {service.pricingMode === 'custom' && (
              <div className="mt-12 border-t border-brand-primary/10 pt-12">
                <h2 className="mb-6 font-serif text-2xl font-medium text-brand-text">專屬諮詢</h2>
                <p className="mb-6 text-brand-muted">此服務為客製化方案，歡迎加入官方 LINE 與我們聊聊您的需求。</p>
                <a
                  href="https://lin.ee/S2VgXpn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#05b04d] active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304" />
                  </svg>
                  加入官方 LINE 了解
                </a>
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
