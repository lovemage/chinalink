import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '關於我們 - 懂陸姐 ChinaLink',
  description: '懂陸姐是台灣人在大陸生活與經商的最佳夥伴，提供帳號代辦、代購驗貨、公司註冊、新媒體運營等全方位服務',
}

const services = [
  {
    iconSrc: '/icons/account.png',
    title: '帳號代辦與租用',
    description:
      '微信、支付寶、淘寶、小紅書等大陸常用帳號代辦與租用，讓你輕鬆融入大陸數位生活，不再因為帳號問題而卡關。',
  },
  {
    iconSrc: '/icons/procurement.png',
    title: '代購與驗貨',
    description:
      '淘寶、拼多多商品代購，廣州倉庫實地驗貨，確保商品品質與規格符合需求，為你的跨境採購保駕護航。',
  },
  {
    iconSrc: '/icons/company.png',
    title: '公司註冊與開戶',
    description:
      '大陸企業營業執照申請、銀行帳戶開設一條龍服務，從資料準備到核准取得，全程專人協助處理。',
  },
  {
    iconSrc: '/icons/marketing.png',
    title: '新媒體運營',
    description:
      '小紅書、抖音帳號經營與投流策略規劃，幫助你的品牌在大陸社群平台上建立影響力，精準觸達目標客群。',
  },
]

const trustPoints = [
  {
    iconSrc: '/icons/consulting.png',
    title: '在地經驗',
    description: '多年大陸生活經商實戰經驗',
  },
  {
    iconSrc: '/icons/legal.png',
    title: '專業可靠',
    description: '合法合規，保障客戶權益',
  },
  {
    iconSrc: '/icons/account.png',
    title: '一對一服務',
    description: 'Line／微信即時溝通，專人處理',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-brand-bg">
        <div className="absolute top-0 inset-x-0 h-[600px] w-[800px] mx-auto rounded-full bg-brand-primary/5 blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary"></span>
            關於我們
            <span className="h-px w-8 bg-brand-primary"></span>
          </div>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl md:text-7xl">
            關於 <span className="font-playfair italic text-brand-primary">ChinaLink</span> 懂陸姐
          </h1>
          <p className="mt-8 text-xl font-light text-brand-muted max-w-2xl mx-auto">
            台灣人在大陸生活與經商的<span className="font-serif italic font-medium text-brand-text">最佳夥伴</span>
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[3/4] max-w-md mx-auto w-full overflow-hidden rounded-t-[200px] rounded-b-[40px] border border-brand-primary/10 bg-brand-bg shadow-2xl shadow-brand-text/5">
              <Image
                src="/hero-illustration.png"
                alt="Tina - 懂陸姐創辦人"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover opacity-90"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-medium text-brand-text sm:text-5xl mb-8">
                我們的故事 <span className="font-playfair italic text-brand-primary">Our Story</span>
              </h2>
              <div className="space-y-6 text-lg font-light leading-relaxed text-brand-muted">
                <p>
                  Tina 是一位在大陸生活多年的台灣人，深刻了解台灣朋友在大陸遇到的各種困難——從手機號碼、支付工具到公司註冊。
                </p>
                <p>
                  「懂陸姐」的誕生，就是為了幫助更多台灣人順利在大陸生活與創業。我們致力於打破兩岸資訊落差，提供充滿溫度的專業顧問服務。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-brand-bg py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-medium text-brand-text sm:text-5xl">
              專業服務 <span className="font-playfair italic text-brand-primary">Services</span>
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.title}
                href="/services"
                className="group flex flex-col rounded-[2.5rem] bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/10 border border-brand-primary/5"
              >
                <div className="mb-8 relative h-[105px] w-[105px] transition-transform duration-500 group-hover:scale-110">
                  <Image src={service.iconSrc} alt={service.title} fill sizes="105px" className="object-contain" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-text mb-4">
                  {service.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-brand-muted flex-1">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-medium text-brand-text sm:text-5xl">
              為什麼選擇我們 <span className="font-playfair italic text-brand-primary">Why Us</span>
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex flex-col items-center text-center">
                <div className="relative h-[105px] w-[105px] mb-6 transition-transform duration-500 hover:scale-110">
                  <Image src={point.iconSrc} alt={point.title} fill sizes="105px" className="object-contain" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-text mb-3">{point.title}</h3>
                <p className="text-base font-light text-brand-muted">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
