import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: '關於懂陸姐｜懂陸姐 ChinaLink',
  description: '懂陸姐是 Tina 的個人專欄與顧問品牌。Tina 是在大陸生活多年的台灣人，寫市場觀察，也協助台灣人處理帳號、採購、公司註冊與新媒體經營。',
  alternates: { canonical: '/about' },
}

const topics = [
  { title: '電商與平台', href: '/category/ecommerce-platforms' },
  { title: '零售與消費', href: '/category/retail-consumer' },
  { title: 'To B 與產業供應鏈', href: '/category/b2b-supply-chain' },
  { title: '新媒體與流量', href: '/category/new-media-traffic' },
]

const services = [
  {
    title: '帳號代辦與租用',
    description: '微信、支付寶、淘寶、小紅書等大陸常用帳號代辦與租用。',
  },
  {
    title: '代購與驗貨',
    description: '淘寶、拼多多商品代購，廣州倉庫實地驗貨，確認品質與規格。',
  },
  {
    title: '公司註冊與開戶',
    description: '大陸企業營業執照申請、銀行帳戶開設，從資料準備到核准取得都有專人協助。',
  },
  {
    title: '新媒體運營',
    description: '小紅書、抖音帳號經營與投流策略規劃。',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader title="關於懂陸姐" />

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16 lg:py-16">
        <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-brand-tint">
          <Image
            src="/hero-illustration.png"
            alt="懂陸姐 Tina 的插畫形象"
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-[62ch]">
          <h2 className="font-serif text-[1.75rem] font-bold leading-snug sm:text-[2.25rem]">Tina 與懂陸姐</h2>
          <div className="mt-6 space-y-5 text-[1.0625rem] leading-9">
            <p>Tina 是一位在大陸生活多年的台灣人，深刻了解台灣朋友在大陸遇到的各種困難，從手機號碼、支付工具到公司註冊。</p>
            <p>「懂陸姐」的誕生，就是為了幫助更多台灣人順利在大陸生活與創業，打破兩岸的資訊落差。</p>
          </div>

          <h2 className="mt-12 font-serif text-xl font-bold">持續關注的議題</h2>
          <ul className="mt-4 border-t border-brand-text">
            {topics.map((topic) => (
              <li key={topic.href} className="border-b border-brand-rule">
                <Link href={topic.href} className="block py-3.5 font-serif text-[1.0625rem] font-medium transition-colors hover:text-brand-primary">
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-brand-rule">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="font-serif text-[1.75rem] font-bold sm:text-[2.25rem]">可以協助的事</h2>
          <ul className="mt-8 grid border-t border-brand-text md:grid-cols-2 md:gap-x-14">
            {services.map((service) => (
              <li key={service.title} className="border-b border-brand-rule py-5">
                <h3 className="font-serif text-lg font-medium">{service.title}</h3>
                <p className="mt-1.5 text-[15px] leading-7 text-brand-muted">{service.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
            <Link href="/services" className="inline-flex min-h-12 items-center bg-brand-primary px-6 font-medium text-brand-raised transition-colors hover:bg-brand-deep">
              看顧問服務
            </Link>
            <Link href="/contact" className="text-link">
              聯絡懂陸姐
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
