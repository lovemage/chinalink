import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    iconSrc: '/icons/account.webp',
    title: '帳號代辦與租用',
    description: '微信、支付寶、淘寶、小紅書等各類大陸生活必備帳號一站搞定，免除繁瑣實名認證。',
    href: '/services/account-agent',
    color: 'from-[#FFF7ED] to-[#FFEDD5]'
  },
  {
    iconSrc: '/icons/procurement.webp',
    title: '代購與驗貨',
    description: '提供淘寶、拼多多等平台商品代購，並在廣州專屬倉庫進行嚴格驗貨，確保商品品質。',
    href: '/services/procurement',
    color: 'from-white to-[#F5F5F4]'
  },
  {
    iconSrc: '/icons/company.webp',
    title: '公司註冊與開戶',
    description: '全程代辦大陸企業營業執照、銀行企業帳戶，提供地址掛靠與稅務諮詢，助您快速落地。',
    href: '/services/company-registration',
    color: 'from-[#FFF7ED] to-[#FFEDD5]'
  },
  {
    iconSrc: '/icons/marketing.webp',
    title: '新媒體運營',
    description: '專精小紅書、抖音帳號經營與投流策略，為品牌打造精準曝光，掌握大陸流量密碼。',
    href: '/services/marketing',
    color: 'from-white to-[#F5F5F4]'
  },
]

export function ServiceOverview() {
  return (
    <section className="bg-brand-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
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
            className="group inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-primary transition-colors"
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
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${service.color} p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/10 border border-white/50 min-h-[320px]`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="relative h-16 w-16 transition-transform duration-500 group-hover:scale-110">
                  <Image src={service.iconSrc} alt={service.title} fill sizes="64px" className="object-contain" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-white">
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
              <div className="absolute -right-4 -bottom-4 text-[120px] font-black text-black/[0.03] leading-none pointer-events-none transition-transform duration-500 group-hover:-translate-y-4">
                0{index + 1}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
