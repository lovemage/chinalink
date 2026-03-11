import type { Metadata } from 'next'
import { UserCheck, ShoppingBag, Building2, Megaphone, MapPin, ShieldCheck, HeadsetIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '關於我們 - 懂陸姐 ChinaLink',
  description: '懂陸姐是台灣人在大陸生活與經商的最佳夥伴，提供帳號代辦、代購驗貨、公司註冊、新媒體運營等全方位服務',
}

const services = [
  {
    icon: UserCheck,
    title: '帳號代辦與租用',
    description:
      '微信、支付寶、淘寶、小紅書等大陸常用帳號代辦與租用，讓你輕鬆融入大陸數位生活，不再因為帳號問題而卡關。',
  },
  {
    icon: ShoppingBag,
    title: '代購與驗貨',
    description:
      '淘寶、拼多多商品代購，廣州倉庫實地驗貨，確保商品品質與規格符合需求，為你的跨境採購保駕護航。',
  },
  {
    icon: Building2,
    title: '公司註冊與開戶',
    description:
      '大陸企業營業執照申請、銀行帳戶開設一條龍服務，從資料準備到核准取得，全程專人協助處理。',
  },
  {
    icon: Megaphone,
    title: '新媒體運營',
    description:
      '小紅書、抖音帳號經營與投流策略規劃，幫助你的品牌在大陸社群平台上建立影響力，精準觸達目標客群。',
  },
]

const trustPoints = [
  {
    icon: MapPin,
    title: '在地經驗',
    description: '多年大陸生活經商實戰經驗',
  },
  {
    icon: ShieldCheck,
    title: '專業可靠',
    description: '合法合規，保障客戶權益',
  },
  {
    icon: HeadsetIcon,
    title: '一對一服務',
    description: 'Line／微信即時溝通，專人處理',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FFF7ED] to-brand-bg py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold text-brand-text sm:text-4xl">關於懂陸姐</h1>
          <p className="mt-4 text-lg text-brand-muted">台灣人在大陸生活與經商的最佳夥伴</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-brand-bg py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">
            我們的故事
          </h2>
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm sm:p-12">
            <p className="text-base leading-relaxed text-brand-muted sm:text-lg">
              Tina
              是一位在大陸生活多年的台灣人，深刻了解台灣朋友在大陸遇到的各種困難——從手機號碼、支付工具到公司註冊。「懂陸姐」的誕生，就是為了幫助更多台灣人順利在大陸生活與創業。
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">
            我們的服務
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.title}
                href="/services"
                className="group rounded-2xl border border-transparent bg-brand-bg p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFEDD5] transition-colors group-hover:bg-brand-primary/20">
                  <service.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-text group-hover:text-brand-primary">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#FFF1E6] py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">
            為什麼選擇我們？
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
                  <point.icon className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-brand-text">{point.title}</h3>
                <p className="mt-2 text-sm text-brand-muted">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
