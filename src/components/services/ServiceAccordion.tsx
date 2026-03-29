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
  const [openId, setOpenId] = useState<number | null>(null)

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-5">
      {services.map((service, index) => {
        const isOpen = openId === service.id
        const cover =
          typeof service.coverImage === 'object' && service.coverImage
            ? (service.coverImage as Media)
            : null

        return (
          <div
            key={service.id}
            className={`relative overflow-hidden rounded-2xl sm:rounded-[2rem] border transition-all duration-300 ${
              isOpen
                ? 'col-span-2 sm:col-span-1 border-brand-primary/20 bg-white shadow-xl shadow-brand-primary/5'
                : 'border-border/70 bg-white hover:border-brand-primary/15 hover:shadow-md'
            }`}
          >
            {/* Header — always visible */}
            <button
              type="button"
              onClick={() => toggle(service.id)}
              className="group flex w-full items-center gap-3 sm:gap-5 px-4 py-4 sm:px-10 sm:py-7 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg rounded-2xl sm:rounded-[2rem]"
            >
              <div
                className={`flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-[1.25rem] ring-1 transition-all duration-300 ${
                  isOpen
                    ? 'bg-brand-primary/10 text-brand-primary ring-brand-primary/15'
                    : 'bg-muted text-brand-muted ring-border/50 group-hover:ring-brand-primary/10'
                }`}
              >
                <MaterialSymbol
                  name={service.iconName || defaultServiceIconName}
                  className="text-[20px] sm:text-[28px]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-sm sm:text-xl font-medium text-brand-text sm:text-2xl">
                  {service.title}
                </h2>
                {!isOpen && service.seo?.metaDescription && (
                  <p className="mt-1 sm:mt-1.5 line-clamp-1 text-xs sm:text-sm font-light text-brand-muted hidden sm:block">
                    {service.seo.metaDescription}
                  </p>
                )}
                {!isOpen && (
                  <span className="mt-1 block text-xs font-medium text-brand-primary sm:hidden">
                    {formatPrice(service)}
                  </span>
                )}
              </div>

              <span className="hidden shrink-0 font-serif text-lg font-medium text-brand-primary sm:block">
                {formatPrice(service)}
              </span>

              <ChevronDown
                className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-brand-muted transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expandable content */}
            <div
              className="grid transition-[grid-template-rows] duration-500"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="border-t border-brand-primary/10 px-4 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10">
                  {/* Cover image */}
                  {cover?.url && (
                    <div className="relative mb-8 sm:mb-10 aspect-[5/2] overflow-hidden rounded-xl sm:rounded-[1.5rem]">
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
                  <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_300px]">
                    {/* Main content */}
                    <div>
                      {/* Block content */}
                      {service.description && (
                        <div className="prose prose-sm sm:prose-lg prose-stone max-w-none font-light leading-relaxed text-brand-muted prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-text prose-a:text-brand-primary prose-table:text-sm prose-table:border prose-table:border-border/50 prose-th:bg-brand-bg prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-medium prose-th:text-brand-text prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-border/30">
                          <BlockRenderer
                            blocks={service.description as BlockRendererBlocks}
                          />
                        </div>
                      )}

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mt-8 sm:mt-10 border-t border-brand-primary/10 pt-8 sm:pt-10">
                          <h3 className="mb-4 sm:mb-5 font-serif text-base sm:text-lg font-medium text-brand-text">
                            服務特點
                          </h3>
                          <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                            {service.features.map((feature) => (
                              <li
                                key={feature.id}
                                className="flex items-start gap-2 sm:gap-3"
                              >
                                <div className="mt-0.5 flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-brand-primary/8 text-brand-primary ring-1 ring-brand-primary/10">
                                  <MaterialSymbol
                                    name={
                                      service.iconName || defaultServiceIconName
                                    }
                                    className="text-[12px] sm:text-[16px]"
                                  />
                                </div>
                                <span className="text-xs sm:text-sm font-light leading-relaxed text-brand-muted">
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
                      <PricingSection service={service} lineUrl={lineUrl} compact />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative number */}
            <div className="pointer-events-none absolute -right-2 -bottom-2 text-[48px] sm:text-[72px] font-black leading-none text-black/[0.02]">
              0{index + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}
