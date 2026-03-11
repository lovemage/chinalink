import Image from 'next/image'

const painPoints = [
  {
    iconSrc: '/icons/account.png',
    title: '卡在沒有大陸門號',
    description: '不是你不會，是一開始就少了能用的大陸門號。很多 App 想註冊、想收驗證碼，第一步就先被擋在外面。',
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-brand-bg to-card border-brand-primary/10",
  },
  {
    iconSrc: '/icons/payment.png',
    title: '付款這關一直過不了',
    description: '不是商品不能買，是付款這一步就先卡住。沒有大陸卡、支付寶綁不上，很多事情看得到卻做不了。',
    className: "md:col-span-1 md:row-span-1 bg-card border-border/70",
  },
  {
    iconSrc: '/icons/company.png',
    title: '想開店，資料卻不齊',
    description: '想上架、想營運、想開始賣，結果一碰到執照、身份和開戶需求，就發現每一關都比想像中麻煩。',
    className: "md:col-span-1 md:row-span-1 bg-card border-border/70",
  },
  {
    iconSrc: '/icons/marketing.png',
    title: '平台要做，但規則看不懂',
    description: '抖音、小紅書不是發文就會有流量。規則、節奏、投流方式沒抓到，時間花了，成效卻不一定出得來。',
    className: "md:col-span-2 md:row-span-1 bg-brand-text text-white border-transparent",
  },
]

export function PainPoints() {
  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-bg/50 blur-3xl"></div>
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl md:text-5xl">
            你是不是也常常卡在這些 <span className="font-playfair italic text-brand-primary">痛點與困難？</span>
          </h2>
          <p className="mt-4 text-lg text-brand-muted">
            明明想開始做，卻常常卡在帳號、付款、開店和平台規則。不是不想衝，而是很多門檻一開始就沒人幫你講清楚。
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 min-h-[400px]">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-shadow duration-300 hover:shadow-md ${point.className}`}
            >
              <div className="relative z-10">
                <div className="mb-6 relative h-[80px] w-[80px] transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image src={point.iconSrc} alt="" fill sizes="80px" className="object-contain" />
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
