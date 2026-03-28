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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
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
