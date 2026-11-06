export const dynamic = 'force-dynamic'

import { ServiceAccordion } from '@/components/services/ServiceAccordion'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/PageHeader'
import Link from 'next/link'
import { getPublishedServicesWithDetails } from '@/lib/queries/services'
import { getSetting } from '@/lib/queries/settings'

export const metadata: Metadata = {
  title: '顧問服務｜懂陸姐 ChinaLink',
  description: '懂陸姐提供帳號代辦、代購驗貨、公司註冊、新媒體運營等全方位大陸經營服務',
  alternates: { canonical: '/services' },
}

export default async function ServicesPage() {
  const [services, lineUrl] = await Promise.all([
    getPublishedServicesWithDetails(),
    getSetting('lineOfficialUrl'),
  ])

  return (
    <>
      <PageHeader title="顧問服務" description="從帳號辦理到公司註冊，懂陸姐幫你處理大陸經營的大小事。點開看每項服務的完整介紹。" />
      <div className="mx-auto max-w-5xl px-4 py-10 pb-20 sm:px-6">
        <p className="mb-8 text-[15px] leading-7 text-brand-muted">
          想了解在地貨源如何串接？
          <Link href="/supply-chain" className="text-link ml-2 text-brand-text">
            看供應鏈推薦
          </Link>
        </p>

        {services.length > 0 ? (
          <ServiceAccordion services={services} lineUrl={lineUrl ?? ''} />
        ) : (
          <p className="py-24 text-center font-serif text-xl">目前沒有可用的服務項目</p>
        )}
      </div>
    </>
  )
}
