import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SihuiCasePreview } from '@/components/supply-chain/SihuiCasePreview'

export function SupplyChainCases() {
  return (
    <section aria-labelledby="supply-chain-heading" className="bg-brand-bg py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-[#3e5948]">供應鏈串接案例</p>
            <h2 id="supply-chain-heading" className="mt-4 font-serif text-3xl leading-snug text-brand-text sm:text-4xl">
              找貨源，先認識在地的人
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-brand-text/75">
              從實際接觸過的從業者出發，看懂產業背景，也了解合作對象如何在當地累積經驗與信用。
            </p>
          </div>
          <Link href="/supply-chain" className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#3e5948] md:self-auto">
            瀏覽供應鏈案例
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <SihuiCasePreview />
      </div>
    </section>
  )
}
