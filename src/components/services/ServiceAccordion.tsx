'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PricingSection } from '@/components/services/PricingSection'
import { MaterialSymbol } from '@/components/ui/MaterialSymbol'
import { defaultServiceIconName } from '@/lib/services/serviceIcons'
import type { Service, Media } from '@/payload-types'
import type { ComponentProps } from 'react'

type BlockRendererBlocks = ComponentProps<typeof BlockRenderer>['blocks']

interface ServiceAccordionProps {
  services: Service[]
  lineUrl: string
}

function formatPrice(service: Service): string {
  if (service.pricingMode === 'custom') return '諮詢報價'
  if (service.pricingMode === 'addons') {
    return service.basePrice ? `NT$ ${service.basePrice.toLocaleString()} 起` : '諮詢報價'
  }
  return service.price ? `NT$ ${service.price.toLocaleString()}` : '免費'
}

export function ServiceAccordion({ services, lineUrl }: ServiceAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(services[0]?.id ?? null)

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isOpen = openId === service.id
        const cover =
          typeof service.coverImage === 'object' && service.coverImage
            ? (service.coverImage as Media)
            : null

        return (
          <div
            key={service.id}
            className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
              isOpen
                ? 'border-brand-primary/20 bg-white shadow-lg shadow-brand-primary/5'
                : 'border-border/70 bg-white hover:border-brand-primary/15'
            }`}
          >
            {/* Header — always visible */}
            <button
              type="button"
              onClick={() => toggle(service.id)}
              className="flex w-full items-center gap-5 px-6 py-5 text-left transition-colors sm:px-8 sm:py-6"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                  isOpen
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-muted text-brand-muted'
                }`}
              >
                <MaterialSymbol
                  name={service.iconName || defaultServiceIconName}
                  className="text-[24px]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-xl font-medium text-brand-text sm:text-2xl">
                  {service.title}
                </h2>
                {!isOpen && service.seo?.metaDescription && (
                  <p className="mt-1 truncate text-sm text-brand-muted">
                    {service.seo.metaDescription}
                  </p>
                )}
              </div>

              <span className="hidden shrink-0 font-serif text-lg font-medium text-brand-primary sm:block">
                {formatPrice(service)}
              </span>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-brand-muted transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expandable content */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-8 sm:px-8">
                  {/* Cover image */}
                  {cover?.url && (
                    <div className="relative mb-8 aspect-[5/2] overflow-hidden rounded-xl">
                      <Image
                        src={cover.sizes?.hero?.url || cover.url}
                        alt={cover.alt || service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  )}

                  {/* Two-column: content + pricing */}
                  <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    {/* Main content */}
                    <div>
                      {/* Block content */}
                      {service.description && (
                        <div className="prose prose-lg prose-stone max-w-none font-light leading-relaxed text-brand-muted prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-text prose-a:text-brand-primary">
                          <BlockRenderer
                            blocks={service.description as BlockRendererBlocks}
                          />
                        </div>
                      )}

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mt-8 border-t border-brand-primary/10 pt-8">
                          <h3 className="mb-4 font-serif text-lg font-medium text-brand-text">
                            服務特點
                          </h3>
                          <ul className="grid gap-3 sm:grid-cols-2">
                            {service.features.map((feature) => (
                              <li
                                key={feature.id}
                                className="flex items-start gap-3"
                              >
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/8 text-brand-primary">
                                  <MaterialSymbol
                                    name={
                                      service.iconName || defaultServiceIconName
                                    }
                                    className="text-[16px]"
                                  />
                                </div>
                                <span className="text-sm leading-relaxed text-brand-muted">
                                  {feature.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Pricing sidebar */}
                    <div className="lg:sticky lg:top-32 lg:self-start">
                      <PricingSection service={service} lineUrl={lineUrl} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
