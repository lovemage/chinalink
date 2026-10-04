import type { Metadata } from 'next'
import Link from 'next/link'
import { SihuiCasePreview } from '@/components/supply-chain/SihuiCasePreview'

export const metadata: Metadata = {
  title: '供應鏈串接案例｜懂陸姐 ChinaLink',
  description: '從廣東四會翡翠供應鏈開始，認識懂陸姐實際接觸過的在地從業者、產業背景與合作關係。',
  alternates: { canonical: '/supply-chain' },
}

export default function SupplyChainPage() {
  return (
    <section className="bg-brand-bg pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-[#3e5948]">懂陸姐的在地人脈</p>
          <h1 className="mt-4 font-serif text-4xl leading-snug text-brand-text sm:text-5xl">供應鏈串接案例</h1>
          <p className="mt-6 text-lg leading-8 text-brand-text/75">
            找大陸貨源時，知道對方從哪裡做起、在產業裡做了多久，能讓合作多一分了解。這裡記錄懂陸姐實際接觸過的從業者與產業關係，供你評估合作時參考。
          </p>
        </div>
        <SihuiCasePreview headingAs="h2" />
        <div className="mt-12 flex flex-col gap-5 border-t border-brand-text/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-base leading-8 text-brand-text/75">
            有正在尋找的貨源或加工需求，可以先和懂陸姐聊聊，再確認是否有合適的在地資源。
          </p>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#3e5948] px-6 py-3 text-sm font-semibold text-[#fff7ed] transition-colors hover:bg-[#2f4537]">
            聊聊供應鏈需求
          </Link>
        </div>
      </div>
    </section>
  )
}
