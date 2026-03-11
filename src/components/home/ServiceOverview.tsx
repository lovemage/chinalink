import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    iconSrc: '/icons/account.png',
    title: '帳號代辦與租用',
    description: '微信、支付寶、淘寶、小紅書等各類大陸生活必備帳號一站搞定，免除繁瑣實名認證。',
    href: '/services/account-agent',
    color: 'from-brand-bg to-card'
  },
  {
    iconSrc: '/icons/procurement.png',
    title: '代購與驗貨',
    description: '提供淘寶、拼多多等平台商品代購，並在廣州專屬倉庫進行嚴格驗貨，確保商品品質。',
    href: '/services/procurement',
    color: 'from-card to-muted'
  },
  {
    iconSrc: '/icons/company.png',
    title: '公司註冊與開戶',
    description: '全程代辦大陸企業營業執照、銀行企業帳戶，提供地址掛靠與稅務諮詢，助您快速落地。',
    href: '/services/company-registration',
    color: 'from-brand-bg to-card'
  },
  {
    iconSrc: '/icons/marketing.png',
    title: '新媒體運營',
    description: '專精小紅書、抖音帳號經營與投流策略，為品牌打造精準曝光，掌握大陸流量密碼。',
    href: '/services/marketing',
    color: 'from-card to-muted'
  },
]

export function ServiceOverview() {
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

        <div className="grid gap-8 lg:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${service.color} p-8 sm:p-10 transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-primary/8 border border-border/70 min-h-[320px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="relative h-[80px] w-[80px] transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image src={service.iconSrc} alt="" fill sizes="80px" className="object-contain" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/70 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-card">
                  <ArrowRight className="h-5 w-5 text-brand-text" />
                </div>
              </div>
              
              <div className="relative z-10 mt-16">
                <h3 className="text-2xl font-bold text-brand-text">
                  {service.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-brand-muted max-w-md">
                  {service.description}
                </p>
              </div>
              
              {/* Decorative Number */}
              <div className="absolute -right-2 -bottom-2 text-[84px] font-black text-black/[0.025] leading-none pointer-events-none">
                0{index + 1}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
