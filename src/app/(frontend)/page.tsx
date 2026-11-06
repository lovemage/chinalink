export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LeadPost, PostRow } from '@/components/blog/PostCard'
import { WireList } from '@/components/blog/WireList'
import { FaqList } from '@/components/site/FaqList'
import { JsonLd } from '@/components/site/JsonLd'
import { ARTICLE_CATEGORY_SLUGS, SITE_NAME, getSiteUrl } from '@/lib/posts/constants'
import { getPostCategoriesAll, getPublishedPostsFiltered } from '@/lib/queries/posts'
import { getPublishedServicesWithDetails } from '@/lib/queries/services'
import { getPublishedSiteFaqs } from '@/lib/queries/site-faqs'

export const metadata: Metadata = {
  title: '懂陸姐 ChinaLink｜看懂大陸市場與供應鏈',
  description: '懂陸姐是 Tina 的個人專欄，寫大陸電商、零售消費、產業供應鏈與新媒體的第一線觀察。',
  alternates: { canonical: '/' },
}

function SectionHeading({ title, href, linkLabel, onField }: { title: string; href: string; linkLabel: string; onField?: boolean }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-6">
      <h2 className="font-serif text-[1.75rem] font-bold leading-tight sm:text-[2.25rem]">{title}</h2>
      <Link
        href={href}
        className={`inline-flex shrink-0 items-center gap-1.5 text-[15px] hover:underline hover:underline-offset-4 ${onField ? '' : 'text-brand-text'}`}
      >
        {linkLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

function servicePrice(service: { pricingMode: string; price: number | null; basePrice: number | null }) {
  if (service.pricingMode === 'fixed' && service.price) return `NT$ ${service.price.toLocaleString()}`
  if (service.pricingMode === 'addons' && service.basePrice) return `NT$ ${service.basePrice.toLocaleString()} 起`
  return '諮詢報價'
}

export default async function HomePage() {
  const [allCategories, opinion, observation, faqs, services] = await Promise.all([
    getPostCategoriesAll(),
    getPublishedPostsFiltered({ section: 'opinion', limit: 5 }),
    getPublishedPostsFiltered({ section: 'observation', limit: 5 }),
    getPublishedSiteFaqs(5),
    getPublishedServicesWithDetails(),
  ])
  const categories = allCategories.filter((item) => (ARTICLE_CATEGORY_SLUGS as readonly string[]).includes(item.slug))
  const [lead, ...rail] = opinion.posts
  const siteUrl = getSiteUrl()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: siteUrl,
          inLanguage: 'zh-Hant-TW',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/blog?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <section className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6 lg:pt-10">
        <div className="grid border border-brand-rule bg-brand-raised lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
            <h1 className="font-serif text-[2.125rem] font-bold leading-[1.3] text-balance sm:text-5xl lg:text-[3.375rem]">
              看懂大陸市場，
              <br />
              從懂陸姐的觀察開始
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-8 text-brand-muted sm:text-[1.0625rem] sm:leading-9">
              懂陸姐是 Tina 的個人專欄。她是在大陸生活多年的台灣人，持續寫下對電商平台、零售消費、產業供應鏈與新媒體的第一線觀察。
            </p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[15px] font-medium">
              <Link href="/blog" className="text-link inline-flex items-center gap-2">
                <ArrowRight className="size-4" aria-hidden="true" />
                讀陸姐觀點
              </Link>
              <Link href="/about" className="text-link inline-flex items-center gap-2">
                <ArrowRight className="size-4" aria-hidden="true" />
                認識懂陸姐
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center bg-brand-tint px-8 py-8 lg:py-10">
            <Image
              src="/Chinalink_logo.png"
              alt="懂陸姐 Tina 的插畫形象，坐在原木質感的 ChinaLink 字樣上"
              width={520}
              height={520}
              priority
              sizes="(max-width: 1024px) 70vw, 460px"
              className="w-full max-w-[19rem] lg:max-w-[28rem]"
            />
          </div>
        </div>

        {categories.length > 0 && (
          <nav aria-label="關注議題" className="grid grid-cols-2 border-x border-b border-brand-rule lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="border-brand-rule p-4 transition-colors odd:border-r hover:bg-brand-tint lg:border-r lg:p-6 lg:last:border-r-0 [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0"
              >
                <span className="block font-serif text-base font-bold leading-snug sm:text-lg">{category.name}</span>
                <span className="mt-1.5 hidden text-sm leading-6 text-brand-muted sm:block">{category.description}</span>
              </Link>
            ))}
          </nav>
        )}
      </section>

      {lead && (
        <section aria-labelledby="home-opinion" className="mx-auto max-w-[1200px] px-4 pt-16 sm:px-6 lg:pt-24">
          <div id="home-opinion">
            <SectionHeading title="陸姐觀點" href="/blog" linkLabel="全部觀點" />
          </div>
          <div className="grid gap-10 border-t border-brand-text pt-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
            <LeadPost post={lead} headingAs="h3" />
            {rail.length > 0 && (
              <div>
                {rail.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {observation.posts.length > 0 && (
        <section aria-labelledby="home-observation" className="mt-16 bg-brand-deep text-brand-raised lg:mt-24">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:py-20">
            <div id="home-observation">
              <SectionHeading title="供應鏈觀察" href="/observations" linkLabel="全部觀察" onField />
            </div>
            <WireList posts={observation.posts} tone="field" />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto grid max-w-[1200px] gap-8 px-4 pt-16 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16 lg:pt-24">
          <div>
            <h2 className="font-serif text-[1.75rem] font-bold leading-tight sm:text-[2.25rem]">問題與交流</h2>
            <p className="mt-4 text-[15px] leading-7 text-brand-muted">大家最常問懂陸姐的問題。</p>
            <Link href="/questions" className="mt-5 inline-flex items-center gap-1.5 text-[15px] hover:underline hover:underline-offset-4">
              全部問答
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <FaqList
            items={faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
              relatedHref: faq.relatedPostSlug && faq.relatedPostStatus === 'published' ? `/blog/${faq.relatedPostSlug}` : null,
              relatedTitle: faq.relatedPostTitle,
            }))}
          />
        </section>
      )}

      {services.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
          <SectionHeading title="顧問服務" href="/services" linkLabel="全部服務" />
          <ul className="grid border-t border-brand-text md:grid-cols-2 md:gap-x-14">
            {services.slice(0, 6).map((service) => (
              <li key={service.id} className="border-b border-brand-rule">
                <Link href={`/services/${service.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                  <span className="font-serif text-[1.0625rem] font-medium leading-7 transition-colors group-hover:text-brand-primary sm:text-lg">
                    {service.title}
                  </span>
                  <span className="dateline shrink-0 text-sm text-brand-muted">{servicePrice(service)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
            <Link href="/contact" className="inline-flex min-h-12 items-center bg-brand-primary px-6 font-medium text-brand-raised transition-colors hover:bg-brand-deep">
              聊聊你的需求
            </Link>
            <Link href="/supply-chain" className="text-link">
              供應鏈推薦
            </Link>
            <Link href="/products" className="text-link">
              商品專區
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
