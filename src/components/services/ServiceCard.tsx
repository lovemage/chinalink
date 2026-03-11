import Link from 'next/link'
import Image from 'next/image'
import type { Service, ServiceCategory, Media } from '@/payload-types'

interface ServiceCardProps {
  service: Service
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

export function ServiceCard({ service }: ServiceCardProps) {
  const cover = typeof service.coverImage === 'object' && service.coverImage ? service.coverImage as Media : null
  const category = typeof service.serviceCategory === 'object' && service.serviceCategory ? service.serviceCategory as ServiceCategory : null

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-primary/10">
        {cover?.url ? (
          <Image
            src={cover.sizes?.card?.url || cover.url}
            alt={cover.alt || service.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-brand-primary/30">&#128736;</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="mb-2 w-fit rounded-full bg-brand-primary/10 px-3 py-0.5 text-xs font-medium text-brand-primary">
            {category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold text-brand-text group-hover:text-brand-primary">
          {service.title}
        </h3>
        <div className="mt-auto pt-4">
          <span className="text-lg font-bold text-brand-cta">{formatPrice(service)}</span>
        </div>
      </div>
    </Link>
  )
}
