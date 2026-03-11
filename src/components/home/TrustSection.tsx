import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function TrustSection() {
  return (
    <section className="bg-brand-text py-24 sm:py-32 relative overflow-hidden text-white">
      {/* Background elements */}
      <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-brand-primary/20 to-transparent pointer-events-none"></div>
      <div className="absolute -left-40 -bottom-40 h-96 w-96 rounded-full bg-brand-cta/20 blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start justify-between">
          
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              準備好開啟您的<br />
              <span className="text-brand-primary">兩岸商務之旅</span>了嗎？
            </h2>
            <p className="text-lg text-white/70 mb-10">
              有任何問題歡迎透過以下方式聯繫我們，專業團隊隨時為您解答。
            </p>
            <a
              href="/contact"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-brand-primary px-8 text-lg font-bold text-white transition-all hover:bg-brand-primary/90 hover:scale-105"
            >
              立即預約諮詢
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
            {/* Line */}
            <div className="flex items-center gap-6 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all hover:bg-white/10">
              <div className="relative h-16 w-16 shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Image src="/icons/consulting.webp" alt="Line" fill sizes="64px" className="object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Line 官方客服</h3>
                <p className="text-sm text-white/60 mb-2">一對一專屬諮詢</p>
                <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1 text-sm font-medium">
                  ID: misstinachen
                </div>
              </div>
            </div>

            {/* WeChat */}
            <div className="flex items-center gap-6 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all hover:bg-white/10">
              <div className="relative h-16 w-16 shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Image src="/icons/account.webp" alt="WeChat" fill sizes="64px" className="object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">微信官方客服</h3>
                <p className="text-sm text-white/60 mb-2">快速溝通零距離</p>
                <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1 text-sm font-medium">
                  ID: tod324
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div className="sm:col-span-2 flex items-center gap-6 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all hover:bg-white/10">
              <div className="relative h-16 w-16 shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Image src="/icons/marketing.webp" alt="YouTube" fill sizes="64px" className="object-contain" />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">YouTube 頻道</h3>
                  <p className="text-sm text-white/60">台灣人玩轉大陸App</p>
                </div>
                <a
                  href="https://www.youtube.com/@TaiwanInChina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#FF0000] hover:text-white"
                >
                  立即訂閱
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
