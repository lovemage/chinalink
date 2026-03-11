import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-bg pt-24 pb-32">
      {/* Background abstract organic shapes */}
      <div className="absolute -left-20 top-20 h-[420px] w-[420px] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-brand-primary/8 blur-3xl opacity-45" />
      <div className="absolute -right-24 bottom-0 h-[460px] w-[460px] rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-brand-cta/5 blur-3xl opacity-35" />
      
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:justify-between relative z-10">
        
        {/* Text Content */}
        <div className="relative z-10 flex max-w-2xl flex-col justify-center text-center lg:w-1/2 lg:text-left lg:pr-10">
          <div className="mb-8 inline-flex self-center rounded-full border border-brand-primary/20 bg-card/70 px-5 py-2 text-xs font-semibold tracking-widest text-brand-primary uppercase lg:self-start">
            Exclusive Cross-Strait Consultant
          </div>
          
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl md:text-7xl lg:leading-[1.15]">
            在大陸經商 <span className="font-playfair italic text-brand-primary px-2">ChinaLink</span> 懂陸姐是您最好的夥伴
          </h1>

          <p className="mt-8 max-w-lg text-lg font-light leading-relaxed text-brand-muted mx-auto sm:text-xl lg:mx-0">
            無論是 <span className="font-serif italic font-medium">帳號代辦、代購驗貨</span>，或是 <span className="font-serif italic font-medium">公司註冊與新媒體運營</span>。我們提供充滿溫度的專業顧問，為您打破兩岸資訊落差。
          </p>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/contact"
              className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-brand-primary px-10 text-sm font-semibold tracking-widest text-brand-text shadow-md transition-colors duration-300 hover:bg-brand-primary/90 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg sm:w-auto"
            >
              <span className="relative">免費預約諮詢</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-brand-primary/30 bg-transparent px-10 text-sm font-semibold tracking-widest text-brand-primary transition-colors duration-300 hover:border-brand-primary hover:bg-brand-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg sm:w-auto"
            >
              探索服務項目
            </Link>
          </div>
        </div>

        {/* Hero Image / Graphic */}
        <div className="relative w-full max-w-lg lg:w-1/2 lg:max-w-none mt-8 lg:mt-0">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-[200px] rounded-b-[40px] border border-border/70 bg-card shadow-xl shadow-brand-text/5">
            <Image
              src="/hero_image.webp"
              alt="懂陸姐兩岸商務顧問"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover opacity-90"
              priority
            />
          </div>
          
          {/* Floating Organic badge */}
          <div className="mt-6 rounded-[2rem] rounded-bl-none border border-brand-primary/10 bg-card p-6 shadow-xl shadow-brand-text/5 sm:mt-0 sm:absolute sm:bottom-10 sm:-left-6 lg:left-0">
              <div className="flex items-center gap-5">
                <div className="relative h-[80px] w-[80px] shrink-0">
                <Image src="/icons/consulting.png" alt="" fill sizes="80px" className="object-contain" />
                </div>
              <div>
                <p className="font-serif text-lg font-medium text-brand-text">100% 成功案例</p>
                <p className="text-sm font-light text-brand-muted">協助超過千位台商</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}
