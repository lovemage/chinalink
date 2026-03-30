import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MaterialSymbol } from '@/components/ui/MaterialSymbol'
import { defaultServiceIconName } from '@/lib/services/serviceIcons'
import { getPublishedServices } from '@/lib/queries/services'

const cardColors = ['from-brand-bg to-card', 'from-card to-muted', 'from-brand-bg to-card', 'from-card to-muted'] as const

export async function ServiceOverview() {
  const allServices = await getPublishedServices()
  const services = allServices.slice(0, 4)

  return (
    <section className="bg-brand-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-brand-primary uppercase">
              <span className="h-px w-8 bg-brand-primary"></span>
              核心服務
            </div>
            <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl md:text-5xl">
              專業服務，助您<br/>在大陸暢通無阻
            </h2>
          </div>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-semibold text-brand-text transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg"
          >
            瀏覽所有服務
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br ${cardColors[index % cardColors.length]} p-5 sm:p-8 md:p-10 transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-primary/8 border border-border/70 min-h-[200px] sm:min-h-[320px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex h-12 w-12 sm:h-[80px] sm:w-[80px] items-center justify-center rounded-xl sm:rounded-[1.75rem] bg-white/75 text-brand-text shadow-sm ring-1 ring-brand-primary/10 transition-transform duration-300 group-hover:scale-[1.02]">
                  <MaterialSymbol name={service.iconName || defaultServiceIconName} className="text-[28px] sm:text-[44px]" />
                </div>
                <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-card/70 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-card">
                  <ArrowRight className="h-5 w-5 text-brand-text" />
                </div>
              </div>

              <div className="relative z-10 mt-6 sm:mt-16">
                <h3 className="text-base sm:text-2xl font-bold text-brand-text">
                  {service.title}
                </h3>
                <p className="mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed text-brand-muted max-w-md line-clamp-2 sm:line-clamp-none">
                  {'專業服務，協助你更順利展開大陸市場相關流程。'}
                </p>
              </div>

              {/* Decorative Number */}
              <div className="absolute -right-2 -bottom-2 text-[48px] sm:text-[84px] font-black text-black/[0.025] leading-none pointer-events-none">
                0{index + 1}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
