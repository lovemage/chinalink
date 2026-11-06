import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/site/PageHeader'
import { SihuiCasePreview } from '@/components/supply-chain/SihuiCasePreview'

export const metadata: Metadata = {
  title: '供應鏈推薦｜懂陸姐 ChinaLink',
  description: '從廣東四會翡翠供應鏈開始，認識懂陸姐實際接觸過的在地從業者、產業背景與合作關係。',
  alternates: { canonical: '/supply-chain' },
}

export default function SupplyChainPage() {
  return (
    <>
      <PageHeader
        title="供應鏈推薦"
        description="找大陸貨源時，知道對方從哪裡做起、在產業裡做了多久，能讓合作多一分了解。這裡記錄懂陸姐實際接觸過的從業者與產業關係，供你評估合作時參考。"
      />
      <div className="mx-auto max-w-[1200px] px-4 py-10 pb-20 sm:px-6 lg:py-14">
        <SihuiCasePreview headingAs="h2" />
        <div className="mt-12 flex flex-col gap-5 border-t border-brand-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-base leading-8 text-brand-muted">
            有正在尋找的貨源或加工需求，可以先和懂陸姐聊聊，再確認是否有合適的在地資源。
          </p>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-brand-primary px-6 py-3 text-sm font-medium text-brand-raised transition-colors hover:bg-brand-deep">
            聊聊供應鏈需求
          </Link>
        </div>
      </div>
    </>
  )
}
