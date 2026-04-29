import Link from 'next/link'
import Image from 'next/image'
import { HeroConsultButton } from './HeroConsultButton'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-bg pt-24 pb-32">
      {/* Background abstract organic shapes */}
      <div className="absolute -left-20 top-20 h-[420px] w-[420px] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-brand-primary/8 blur-3xl opacity-45" />
      <div className="absolute -right-24 bottom-0 h-[460px] w-[460px] rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-brand-cta/5 blur-3xl opacity-35" />
      
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:justify-between relative z-10">
        
        {/* Text Content */}
        <div className="relative z-10 flex max-w-2xl flex-col justify-center text-center lg:w-1/2 lg:text-left lg:pr-10">
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl md:text-7xl lg:leading-[1.15] line-clamp-3">
            在大陸經商 <span className="font-playfair italic text-brand-primary px-2">ChinaLink</span> 懂陸姐是您最好的夥伴
          </h1>

          <p className="mt-8 max-w-lg text-lg font-light leading-relaxed text-brand-muted mx-auto sm:text-xl lg:mx-0 line-clamp-2">
            無論是 <span className="font-serif italic font-medium">帳號代辦、代購驗貨</span>，或是 <span className="font-serif italic font-medium">公司註冊與新媒體運營</span>。我們提供充滿溫度的專業顧問，為您打破兩岸資訊落差。
          </p>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start">
            <HeroConsultButton
              className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-cta px-10 text-sm font-semibold tracking-widest text-white shadow-md transition-colors duration-300 hover:bg-brand-cta/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="relative">免費諮詢</span>
            </HeroConsultButton>
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
          
        </div>
        
      </div>
    </section>
  )
}
