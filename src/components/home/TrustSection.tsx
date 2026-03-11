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
              href="/contact"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-brand-primary px-8 text-lg font-bold text-brand-text transition-colors duration-300 hover:bg-brand-primary/90 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-text"
            >
              先聊聊目前卡在哪
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="w-full max-w-2xl">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="border-t border-white/14 pt-5">
                <p className="text-sm font-semibold tracking-[0.18em] text-white/52 uppercase">Line 官方客服</p>
                <p className="mt-3 text-xl font-semibold text-white">misstinachen</p>
                <p className="mt-2 text-sm leading-relaxed text-white/66">適合先聊需求、釐清流程，想知道怎麼開始可以直接加。</p>
              </div>

              <div className="border-t border-white/14 pt-5">
                <p className="text-sm font-semibold tracking-[0.18em] text-white/52 uppercase">微信官方客服</p>
                <p className="mt-3 text-xl font-semibold text-white">tod324</p>
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
