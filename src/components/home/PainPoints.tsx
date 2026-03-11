import Image from 'next/image'

const painPoints = [
  {
    iconSrc: '/icons/account.png',
    title: '沒有大陸手機號',
    description: '無法註冊抖音、小紅書等平台帳號，導致許多服務受限',
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-brand-bg to-white border-brand-primary/10",
  },
  {
    iconSrc: '/icons/payment.png',
    title: '支付寶開不了',
    description: '沒有大陸銀行卡，無法完成線上支付',
    className: "md:col-span-1 md:row-span-1 bg-white border-brand-muted/10",
  },
  {
    iconSrc: '/icons/company.png',
    title: '想開淘寶店',
    description: '沒有營業執照和大陸身份，開店受限',
    className: "md:col-span-1 md:row-span-1 bg-white border-brand-muted/10",
  },
  {
    iconSrc: '/icons/marketing.png',
    title: '抖音小紅書經營',
    description: '不熟悉平台規則，帳號容易被限流',
    className: "md:col-span-2 md:row-span-1 bg-brand-text text-white border-transparent",
  },
]

export function PainPoints() {
  return (
    <section className="bg-white py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-bg/50 blur-3xl"></div>
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl md:text-5xl">
            你是否也遇到這些 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-cta">痛點與困難？</span>
          </h2>
          <p className="mt-4 text-lg text-brand-muted">
            兩岸資訊落差與政策限制，讓許多台商在初期遇到重重阻礙。
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 min-h-[400px]">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${point.className}`}
            >
              <div className="relative z-10">
                <div className="mb-6 relative h-[80px] w-[80px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Image src={point.iconSrc} alt={point.title} fill sizes="80px" className="object-contain" />
                </div>
                <h3 className={`text-xl font-bold ${point.className.includes('bg-brand-text') ? 'text-white' : 'text-brand-text'}`}>
                  {point.title}
                </h3>
                <p className={`mt-3 leading-relaxed ${point.className.includes('bg-brand-text') ? 'text-white/80' : 'text-brand-muted'}`}>
                  {point.description}
                </p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-transparent to-black/5 opacity-50 blur-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
