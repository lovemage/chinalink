export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqList } from '@/components/site/FaqList'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHeader } from '@/components/site/PageHeader'
import { buildFaqJsonLd } from '@/lib/posts/structured-data'
import { getPublishedSiteFaqs } from '@/lib/queries/site-faqs'
import { getSettings } from '@/lib/queries/settings'

export const metadata: Metadata = {
  title: '問題與交流｜懂陸姐 ChinaLink',
  description: '台灣人對大陸市場、平台與服務的常見問題，懂陸姐整理的回答與延伸文章。',
  alternates: { canonical: '/questions' },
}

export default async function QuestionsPage() {
  const [faqs, settings] = await Promise.all([getPublishedSiteFaqs(), getSettings()])

  return (
    <>
      <PageHeader title="問題與交流" description="大家最常問懂陸姐的問題，整理在這裡。沒有你要的答案，直接來問。" />
      {faqs.length > 0 && <JsonLd data={buildFaqJsonLd(faqs)} />}
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-10 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:py-14">
        <div>
          {faqs.length > 0 ? (
            <FaqList
              firstOpen
              items={faqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
                relatedHref:
                  faq.relatedPostSlug && faq.relatedPostStatus === 'published' ? `/blog/${faq.relatedPostSlug}` : null,
                relatedTitle: faq.relatedPostTitle,
              }))}
            />
          ) : (
            <p className="py-16 text-center font-serif text-xl">問答整理中，歡迎直接來問。</p>
          )}
        </div>
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="bg-brand-tint p-6">
            <h2 className="font-serif text-xl font-bold">還有想問的？</h2>
            <p className="mt-3 text-[15px] leading-7 text-brand-muted">用你習慣的方式留言，懂陸姐會親自回覆。</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              {settings.lineOfficialUrl && (
                <li>
                  <a href={settings.lineOfficialUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                    官方 LINE
                  </a>
                </li>
              )}
              <li>
                <Link href="/contact" className="text-link">
                  填寫聯絡表單
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-link">
                  看顧問服務
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}
