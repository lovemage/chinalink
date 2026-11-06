import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: '聯絡我們｜懂陸姐 ChinaLink',
  description: '有任何問題歡迎隨時聯繫懂陸姐，透過 Line、微信或填寫表單與我們聯繫',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHeader title="聯絡我們" description="有任何兩岸商務或生活問題，歡迎透過以下方式聯繫。" />

      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-10 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-14">
        <section>
          <h2 className="font-serif text-[1.375rem] font-bold">聯繫方式</h2>
          <dl className="mt-5 border-t border-brand-text">
            <div className="border-b border-brand-rule py-4">
              <dt className="text-sm text-brand-muted">Line 官方帳號</dt>
              <dd className="mt-1">
                <a href="https://lin.ee/S2VgXpn" target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                  官方 LINE
                </a>
              </dd>
            </div>
            <div className="border-b border-brand-rule py-4">
              <dt className="text-sm text-brand-muted">微信官方客服</dt>
              <dd className="mt-1 font-medium">微信 ID：TwTina777</dd>
            </div>
            <div className="border-b border-brand-rule py-4">
              <dt className="text-sm text-brand-muted">YouTube 頻道</dt>
              <dd className="mt-1">
                <a href="https://www.youtube.com/@TaiwanInChina" target="_blank" rel="noopener noreferrer" className="text-link font-medium">
                  台灣人玩轉大陸App
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="border border-brand-rule bg-brand-raised p-5 sm:p-8">
          <h2 className="mb-6 font-serif text-[1.375rem] font-bold">留言給我們</h2>
          <ContactForm />
        </section>
      </div>
    </>
  )
}
