import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFEDD5] to-brand-bg">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-primary/10" />
      <div className="pointer-events-none absolute -right-16 top-32 h-56 w-56 rounded-full bg-brand-primary/5" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-cta/5" />

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
        <h1 className="text-3xl font-bold leading-tight text-brand-text sm:text-4xl md:text-5xl">
          台灣人在大陸生活經商，
          <br className="hidden sm:block" />
          找懂陸姐就對了
        </h1>

        <p className="mt-6 text-lg text-brand-muted sm:text-xl">
          帳號代辦 &middot; 代購驗貨 &middot; 公司註冊 &middot; 新媒體運營
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-cta px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-cta/90 hover:shadow-xl"
          >
            免費諮詢
          </Link>
          <Link
            href="/services"
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-brand-primary bg-white/60 px-8 text-base font-semibold text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
          >
            看服務項目
          </Link>
        </div>
      </div>
    </section>
  )
}
