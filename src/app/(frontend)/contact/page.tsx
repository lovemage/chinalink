import type { Metadata } from 'next'
import { MessageCircle, Play } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: '聯繫我們 - 懂陸姐 ChinaLink',
  description: '有任何問題歡迎隨時聯繫懂陸姐，透過 Line、微信或填寫表單與我們聯繫',
}

export default function ContactPage() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-text sm:text-4xl">聯繫我們</h1>
          <p className="mt-3 text-brand-muted">有任何問題歡迎隨時聯繫</p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-brand-text">聯繫方式</h2>

            {/* Line */}
            <div className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#06C755]/10">
                <MessageCircle className="h-6 w-6 text-[#06C755]" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-text">Line</h3>
                <p className="mt-1 text-sm text-brand-muted">
                  Line ID：
                  <span className="font-medium text-brand-text">misstinachen</span>
                </p>
              </div>
            </div>

            {/* WeChat */}
            <div className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07C160]/10">
                <MessageCircle className="h-6 w-6 text-[#07C160]" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-text">微信</h3>
                <p className="mt-1 text-sm text-brand-muted">
                  微信 ID：
                  <span className="font-medium text-brand-text">tod324</span>
                </p>
              </div>
            </div>

            {/* YouTube */}
            <div className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF0000]/10">
                <Play className="h-6 w-6 text-[#FF0000]" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-text">YouTube</h3>
                <a
                  href="https://www.youtube.com/@TaiwanInChina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-medium text-brand-primary hover:underline"
                >
                  台灣人玩轉大陸App
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-brand-text">留言給我們</h2>
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
