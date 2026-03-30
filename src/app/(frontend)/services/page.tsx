export const dynamic = 'force-dynamic'

import { ServiceAccordion } from '@/components/services/ServiceAccordion'
import type { Metadata } from 'next'
import { getPublishedServicesWithDetails } from '@/lib/queries/services'
import { getSetting } from '@/lib/queries/settings'

export const metadata: Metadata = {
  title: '服務項目 - 懂陸姐 ChinaLink',
  description: '懂陸姐提供帳號代辦、代購驗貨、公司註冊、新媒體運營等全方位大陸經營服務',
}

export default async function ServicesPage() {
  const [services, lineUrl] = await Promise.all([
    getPublishedServicesWithDetails(),
    getSetting('lineOfficialUrl'),
  ])

  return (
    <section className="relative min-h-screen overflow-hidden bg-brand-bg py-24 pt-32 sm:py-32 sm:pt-40">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary" />
            服務項目
          </div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-brand-text sm:text-5xl">
            我們能幫你處理的事
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-brand-muted">
            從帳號辦理到公司註冊，懂陸姐幫你搞定大陸經營的大小事。點擊展開了解每項服務的完整介紹。
          </p>
        </div>

        {/* Accordion */}
        {services.length > 0 ? (
          <ServiceAccordion services={services} lineUrl={lineUrl ?? ''} />
        ) : (
          <div className="mt-24 text-center">
            <p className="font-serif text-xl text-brand-muted">目前沒有可用的服務項目</p>
          </div>
        )}
      </div>
    </section>
  )
}
