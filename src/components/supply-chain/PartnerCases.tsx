import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { partnerCases } from '@/lib/content/supply-chain'
import { getPublishedPostsBySlugs } from '@/lib/queries/posts'

export async function PartnerCases() {
  const posts = await getPublishedPostsBySlugs(partnerCases.flatMap((item) => item.articleSlugs))

  return (
    <section aria-labelledby="partner-cases" className="mt-14 lg:mt-20">
      <h2 id="partner-cases" className="font-serif text-[1.75rem] font-bold leading-tight sm:text-[2.25rem]">
        目前合作的產業
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-brand-muted">
        三個實際在經營的品牌網站。商品、價格與交易條件以各網站公告為準。
      </p>
      <ul className="mt-8 border-t border-brand-text">
        {partnerCases.map((item) => {
          const related = item.articleSlugs
            .map((slug) => posts.find((post) => post.slug === slug))
            .filter((post) => post !== undefined)
          return (
            <li key={item.url} className="grid gap-5 border-b border-brand-rule py-8 lg:grid-cols-[16rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
              <div>
                <p className="text-sm text-brand-muted">{item.industry}</p>
                <h3 className="mt-1.5 font-serif text-[1.375rem] font-bold leading-snug">{item.name}</h3>
                <p className="text-sm text-brand-muted">{item.englishName}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener"
                  className="text-link mt-3 inline-flex items-center gap-1 text-[15px] break-all"
                >
                  {item.displayUrl}
                  <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                  <span className="sr-only">（另開新視窗）</span>
                </a>
              </div>
              <div>
                <p className="text-[15px] leading-7">{item.summary}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] leading-7 text-brand-muted marker:text-brand-wood">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
              {related.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold">相關觀察</h4>
                  <ul className="mt-2 space-y-2 text-[15px] leading-7">
                    {related.map((post) => (
                      <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`} className="text-link">
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
