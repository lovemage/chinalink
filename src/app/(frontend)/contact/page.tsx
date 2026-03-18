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
            聯繫我們
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
                  <h3 className="font-serif text-xl font-bold text-brand-text">Line 官方帳號</h3>
                  <a href="https://lin.ee/S2VgXpn" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-medium text-brand-primary transition-colors hover:text-brand-cta">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304"/></svg>
                    官方 LINE
                  </a>
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
                    <span className="font-medium text-brand-text block mt-1">TwTina777</span>
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
