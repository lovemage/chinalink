import { Lock, CreditCard, Store, Smartphone } from 'lucide-react'

const painPoints = [
  {
    icon: Lock,
    title: '沒有大陸手機號',
    description: '無法註冊抖音、小紅書等平台帳號',
  },
  {
    icon: CreditCard,
    title: '支付寶開不了',
    description: '沒有大陸銀行卡，無法完成線上支付',
  },
  {
    icon: Store,
    title: '想開淘寶店',
    description: '沒有營業執照和大陸身份，開店受限',
  },
  {
    icon: Smartphone,
    title: '抖音小紅書經營',
    description: '不熟悉平台規則，帳號容易被限流',
  },
]

export function PainPoints() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">
          你是否也遇到這些困難？
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
                <point.icon className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
