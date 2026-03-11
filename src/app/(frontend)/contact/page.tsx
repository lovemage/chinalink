import type { Metadata } from 'next'
import Image from 'next/image'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: '聯繫我們 - 懂陸姐 ChinaLink',
  description: '有任何問題歡迎隨時聯繫懂陸姐，透過 Line、微信或填寫表單與我們聯繫',
}

export default function ContactPage() {
  return (
    <>
      <section className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-brand-bg">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-cta/5 blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary"></span>
            Contact Us
            <span className="h-px w-8 bg-brand-primary"></span>
          </div>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl">
            聯繫 <span className="font-playfair italic text-brand-primary">ChinaLink</span> 懂陸姐
          </h1>
          <p className="mt-6 text-lg font-light text-brand-muted max-w-xl mx-auto">
            有任何兩岸商務或生活問題，歡迎隨時透過以下方式聯繫我們。
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24 relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left: Contact Info */}
            <div className="space-y-10">
              <h2 className="font-serif text-3xl font-medium text-brand-text">
                聯繫方式 <span className="font-playfair italic text-brand-primary text-xl ml-2">Connect</span>
              </h2>

              {/* Line */}
              <div className="group flex items-start gap-6 rounded-[2rem] bg-brand-bg/50 border border-brand-primary/5 p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-[105px] w-[105px] shrink-0 transition-transform duration-500 group-hover:scale-110">
                  <Image src="/icons/consulting.png" alt="Line" fill sizes="105px" className="object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-text">Line 官方客服</h3>
                  <p className="mt-2 text-brand-muted">
                    Line ID：
                    <span className="font-medium text-brand-text block mt-1">misstinachen</span>
                  </p>
                </div>
              </div>

              {/* WeChat */}
              <div className="group flex items-start gap-6 rounded-[2rem] bg-brand-bg/50 border border-brand-primary/5 p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-[105px] w-[105px] shrink-0 transition-transform duration-500 group-hover:scale-110">
                  <Image src="/icons/account.png" alt="WeChat" fill sizes="105px" className="object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-text">微信官方客服</h3>
                  <p className="mt-2 text-brand-muted">
                    微信 ID：
                    <span className="font-medium text-brand-text block mt-1">tod324</span>
                  </p>
                </div>
              </div>

              {/* YouTube */}
              <div className="group flex items-start gap-6 rounded-[2rem] bg-brand-bg/50 border border-brand-primary/5 p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-[105px] w-[105px] shrink-0 transition-transform duration-500 group-hover:scale-110">
                  <Image src="/icons/marketing.png" alt="YouTube" fill sizes="105px" className="object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-text">YouTube 頻道</h3>
                  <a
                    href="https://www.youtube.com/@TaiwanInChina"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-medium text-brand-primary transition-colors hover:text-brand-cta"
                  >
                    台灣人玩轉大陸App
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <div className="rounded-[2.5rem] bg-white p-8 sm:p-12 border border-brand-primary/10 shadow-2xl shadow-brand-text/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-brand-primary/5 rounded-bl-[100px] pointer-events-none" />
                <h2 className="mb-8 font-serif text-3xl font-medium text-brand-text relative z-10">
                  留言給我們 <span className="font-playfair italic text-brand-primary text-xl ml-2">Message</span>
                </h2>
                <div className="relative z-10">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
