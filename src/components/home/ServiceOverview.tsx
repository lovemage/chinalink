import Link from 'next/link'
import { UserCheck, ShoppingBag, Building2, Megaphone } from 'lucide-react'

const services = [
  {
    icon: UserCheck,
    emoji: '',
    title: '帳號代辦與租用',
    description: '微信、支付寶、淘寶、小紅書帳號一站搞定',
  },
  {
    icon: ShoppingBag,
    emoji: '',
    title: '代購與驗貨',
    description: '淘寶、拼多多商品代購，廣州倉庫驗貨',
  },
  {
    icon: Building2,
    emoji: '',
    title: '公司註冊與開戶',
    description: '大陸企業營業執照、銀行帳戶代辦',
  },
  {
    icon: Megaphone,
    emoji: '',
    title: '新媒體運營',
    description: '小紅書、抖音帳號經營與投流策略',
  },
]

export function ServiceOverview() {
  return (
    <section className="bg-brand-bg py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">
          我們的服務
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.title}
              href="/services"
              className="group rounded-2xl border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFEDD5] transition-colors group-hover:bg-brand-primary/20">
                <service.icon className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text group-hover:text-brand-primary">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
