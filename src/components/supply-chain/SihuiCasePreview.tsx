import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { sihuiJadeCase } from '@/lib/content/supply-chain'

export function SihuiCasePreview({ headingAs = 'h3' }: { headingAs?: 'h2' | 'h3' }) {
  const Heading = headingAs
  return (
    <Link
      href={sihuiJadeCase.href}
      className="group grid overflow-hidden border border-[#d6ddd3] bg-[#eef1e8] transition-colors hover:bg-[#e5eadc] md:grid-cols-[1.1fr_1fr]"
    >
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
        <Image
          src={sihuiJadeCase.cover}
          alt={sihuiJadeCase.coverAlt}
          fill
          sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) 55vw, 650px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#3e5948]">
            {sihuiJadeCase.location}
          </p>
          <Heading className="mt-5 font-serif text-2xl leading-relaxed text-brand-text sm:text-3xl">
            {sihuiJadeCase.title}
          </Heading>
          <p className="mt-4 text-base leading-8 text-brand-text/75">
            {sihuiJadeCase.description}
          </p>
        </div>
        <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[#3e5948]">
          閱讀四會翡翠案例
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
