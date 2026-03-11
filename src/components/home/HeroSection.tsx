import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-bg pt-24 pb-32">
      {/* Background abstract organic shapes */}
      <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-brand-primary/10 blur-3xl opacity-50 mix-blend-multiply transition-transform duration-1000 hover:scale-105" />
      <div className="absolute -right-32 bottom-0 h-[600px] w-[600px] rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-brand-cta/5 blur-3xl opacity-50 mix-blend-multiply transition-transform duration-1000 hover:scale-105" />
      
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:justify-between relative z-10">
        
        {/* Text Content */}
        <div className="relative z-10 flex max-w-2xl flex-col justify-center text-center lg:w-1/2 lg:text-left lg:pr-10">
          <div className="mb-8 inline-flex self-center rounded-full border border-brand-primary/20 bg-white/40 px-5 py-2 text-xs font-semibold tracking-widest text-brand-primary backdrop-blur-md uppercase lg:self-start">
            Exclusive Cross-Strait Consultant
          </div>
          
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl md:text-7xl lg:leading-[1.15]">
            在大陸經商 <span className="font-playfair italic text-brand-primary px-2">ChinaLink</span> 懂陸姐是您最好的夥伴
          </h1>

          <p className="mt-8 text-lg font-light leading-relaxed text-brand-text/80 sm:text-xl max-w-lg mx-auto lg:mx-0">
            無論是 <span className="font-serif italic font-medium">帳號代辦、代購驗貨</span>，或是 <span className="font-serif italic font-medium">公司註冊與新媒體運營</span>。我們提供充滿溫度的專業顧問，為您打破兩岸資訊落差。
          </p>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/contact"
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-primary px-10 text-sm font-semibold tracking-widest text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:bg-brand-primary/90 hover:shadow-2xl hover:shadow-brand-primary/20"
            >
              <span className="relative">免費預約諮詢</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex h-14 items-center justify-center rounded-full border border-brand-primary/30 bg-transparent px-10 text-sm font-semibold tracking-widest text-brand-primary transition-all duration-500 hover:-translate-y-1 hover:border-brand-primary hover:bg-brand-primary/5"
            >
              探索服務項目
            </Link>
          </div>
        </div>

        {/* Hero Image / Graphic */}
        <div className="relative w-full max-w-lg lg:w-1/2 lg:max-w-none mt-8 lg:mt-0">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-[200px] rounded-b-[40px] border border-white/40 bg-[#F9F8F4] shadow-2xl shadow-brand-text/5 transition-transform duration-700 hover:rotate-1">
            <Image
              src="/hero-illustration.png"
              alt="懂陸姐兩岸商務顧問"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
          
          {/* Floating Organic badge */}
          <div className="absolute bottom-10 -left-6 lg:left-0 rounded-[2rem] rounded-bl-none border border-brand-primary/10 bg-white/90 p-6 shadow-2xl shadow-brand-text/5 backdrop-blur-md transition-transform duration-700 hover:-translate-y-2">
            <div className="flex items-center gap-5">
              <div className="relative h-12 w-12 shrink-0">
                <Image src="/icons/consulting.webp" alt="成功案例" fill sizes="48px" className="object-contain" />
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
