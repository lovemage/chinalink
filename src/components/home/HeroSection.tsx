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
            超過千位台商信賴的顧問品牌
          </div>
          
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl md:text-7xl lg:leading-[1.15]">
            在大陸經商 <span className="font-playfair italic text-brand-primary px-2">ChinaLink</span> 懂陸姐是您最好的夥伴
          </h1>

          <p className="mt-8 max-w-lg text-lg font-light leading-relaxed text-brand-muted mx-auto sm:text-xl lg:mx-0">
            無論是 <span className="font-serif italic font-medium">帳號代辦、代購驗貨</span>，或是 <span className="font-serif italic font-medium">公司註冊與新媒體運營</span>。我們提供充滿溫度的專業顧問，為您打破兩岸資訊落差。
          </p>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="https://lin.ee/S2VgXpn"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-cta px-10 text-sm font-semibold tracking-widest text-white shadow-md transition-colors duration-300 hover:bg-brand-cta/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              <span className="relative">加入官方 LINE</span>
            </a>
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
