import Link from 'next/link'
import Image from 'next/image'
import type { Service, ServiceCategory, Media } from '@/payload-types'
import { MaterialSymbol } from '@/components/ui/MaterialSymbol'
import { defaultServiceIconName } from '@/lib/services/serviceIcons'
import { ServiceActionButton } from './ServiceActionButton'

interface ServiceCardProps {
  service: Service
  lineUrl: string
}

function formatPrice(service: Service): string {
  switch (service.pricingMode) {
    case 'fixed':
      return service.price ? `NT$ ${service.price.toLocaleString()}` : '免費'
    case 'addons':
      return service.basePrice ? `NT$ ${service.basePrice.toLocaleString()} 起` : '諮詢報價'
    case 'custom':
      return '諮詢報價'
    default:
      return ''
  }
}

export function ServiceCard({ service, lineUrl }: ServiceCardProps) {
  const cover = typeof service.coverImage === 'object' && service.coverImage ? service.coverImage as Media : null
  const category = typeof service.serviceCategory === 'object' && service.serviceCategory ? service.serviceCategory as ServiceCategory : null
  const cartEnabled = service.cartEnabled !== false

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-brand-primary/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg m-2 rounded-[2rem]">
        {cover?.url ? (
          <Image
            src={cover.sizes?.card?.url || cover.url}
            alt={cover.alt || service.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-30">
            <div className="flex h-[105px] w-[105px] items-center justify-center rounded-[2rem] bg-white/80 text-brand-text shadow-sm ring-1 ring-brand-primary/10">
              <MaterialSymbol name={service.iconName || defaultServiceIconName} className="text-[56px]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {category && (
          <span className="mb-4 w-fit rounded-full border border-brand-primary/20 bg-white px-4 py-1 text-xs font-semibold tracking-wider text-brand-primary">
            {category.name}
          </span>
        )}
        <h3 className="font-serif text-2xl font-bold text-brand-text group-hover:text-brand-primary transition-colors">
          {service.title}
        </h3>
        <div className="mt-auto pt-6 flex items-end justify-between gap-4">
          <span className="font-serif text-xl font-medium text-brand-primary">{formatPrice(service)}</span>
          {service.pricingMode !== 'custom' && (
            <ServiceActionButton
              serviceId={service.id}
              cartEnabled={cartEnabled}
              lineUrl={lineUrl}
              variant="card"
            />
          )}
        </div>
      </div>
    </Link>
  )
}
