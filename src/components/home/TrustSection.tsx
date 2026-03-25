import { ArrowRight } from 'lucide-react'

export function TrustSection() {
  return (
    <section className="bg-brand-text py-24 sm:py-32 relative overflow-hidden text-white">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-primary/12 to-transparent"></div>
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-cta/12 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
          
          <div className="max-w-2xl text-center lg:text-left">
            <p className="mb-4 text-sm font-semibold tracking-[0.28em] text-brand-primary uppercase">
              Let&apos;s Talk
            </p>
            <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              準備把卡住的事，
              <br />
              <span className="text-brand-primary">一件一件處理好</span>了嗎？
            </h2>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/72">
              不管你現在是卡在帳號、付款、開店，還是內容經營方向還沒理清，都可以先來聊聊。
              我們會用你聽得懂的方式，陪你把問題拆開。
            </p>
            <a
              href="https://lin.ee/S2VgXpn"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-brand-cta px-8 text-lg font-bold text-white transition-colors duration-300 hover:bg-brand-cta/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304"/></svg>
              加入官方 LINE 了解
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="w-full max-w-2xl">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="border-t border-white/14 pt-5">
                <p className="text-sm font-semibold tracking-[0.18em] text-white/52 uppercase">Line 官方帳號</p>
                <a href="https://lin.ee/S2VgXpn" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-xl font-semibold text-white transition-colors hover:text-brand-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304"/></svg>
                  官方 LINE
                </a>
                <p className="mt-2 text-sm leading-relaxed text-white/66">適合先聊需求、釐清流程，想知道怎麼開始可以直接加。</p>
              </div>

              <div className="border-t border-white/14 pt-5">
                <p className="text-sm font-semibold tracking-[0.18em] text-white/52 uppercase">微信官方客服</p>
                <p className="mt-3 text-xl font-semibold text-white">TwTina777</p>
                <p className="mt-2 text-sm leading-relaxed text-white/66">如果你平常就在用微信，這邊聯繫會更快，溝通也比較順。</p>
              </div>

              <div className="border-t border-white/14 pt-5 sm:col-span-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.18em] text-white/52 uppercase">YouTube 頻道</p>
                    <p className="mt-3 text-xl font-semibold text-white">台灣人玩轉大陸App</p>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/66">
                      想先自己做功課，也可以先看頻道內容，很多常見問題和踩雷點都有整理。
                    </p>
                  </div>
                  <a
                    href="https://www.youtube.com/@TaiwanInChina"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-brand-primary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-text"
                  >
                    前往看看
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
