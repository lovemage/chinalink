import { MessageCircle, Play } from 'lucide-react'

export function TrustSection() {
  return (
    <section className="bg-[#FFF1E6] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-2xl font-bold text-brand-text sm:text-3xl">聯繫懂陸姐</h2>
        <p className="mt-3 text-brand-muted">有任何問題歡迎透過以下方式聯繫我們</p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {/* Line */}
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#06C755]/10">
              <MessageCircle className="h-8 w-8 text-[#06C755]" />
            </div>
            <h3 className="mt-4 font-semibold text-brand-text">Line</h3>
            <div className="mt-3 flex h-28 w-28 items-center justify-center rounded-xl bg-white shadow-sm">
              <span className="text-xs text-brand-muted">QR Code</span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              Line ID:{' '}
              <span className="font-medium text-brand-text">misstinachen</span>
            </p>
          </div>

          {/* WeChat */}
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#07C160]/10">
              <MessageCircle className="h-8 w-8 text-[#07C160]" />
            </div>
            <h3 className="mt-4 font-semibold text-brand-text">微信</h3>
            <div className="mt-3 flex h-28 w-28 items-center justify-center rounded-xl bg-white shadow-sm">
              <span className="text-xs text-brand-muted">QR Code</span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              微信 ID:{' '}
              <span className="font-medium text-brand-text">tod324</span>
            </p>
          </div>

          {/* YouTube */}
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF0000]/10">
              <Play className="h-8 w-8 text-[#FF0000]" />
            </div>
            <h3 className="mt-4 font-semibold text-brand-text">YouTube</h3>
            <div className="mt-3 flex flex-col items-center gap-2">
              <a
                href="https://www.youtube.com/@TaiwanInChina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-brand-text shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Play className="h-4 w-4 text-[#FF0000]" />
                台灣人玩轉大陸App
              </a>
            </div>
            <p className="mt-2 text-sm text-brand-muted">訂閱我們的頻道</p>
          </div>
        </div>
      </div>
    </section>
  )
}
