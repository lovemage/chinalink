import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { sihuiJadeCase } from '@/lib/content/supply-chain'

export const metadata: Metadata = {
  title: '廣東四會翡翠供應鏈｜供應鏈串接案例｜懂陸姐 ChinaLink',
  description: '懂陸姐透過長期在四會經營的香港朋友，認識英姐與芬姐。了解四會翡翠加工產業、在地從業者的經歷，以及台灣買家合作前應逐件確認的事項。',
  alternates: { canonical: sihuiJadeCase.href },
  openGraph: {
    type: 'article',
    title: '廣東四會翡翠供應鏈｜懂陸姐熟門熟路的在地人脈',
    description: sihuiJadeCase.description,
    url: sihuiJadeCase.href,
    locale: 'zh_TW',
    images: [{ url: sihuiJadeCase.cover, width: 1600, height: 1200, alt: sihuiJadeCase.coverAlt }],
  },
}

const sections = [
  { id: 'connection', label: '這條人脈怎麼接起來' },
  { id: 'industry', label: '認識四會產業帶' },
  { id: 'ying', label: '英姐的看料與設計經驗' },
  { id: 'fen', label: '芬姐與文寶齋' },
  { id: 'cooperation', label: '合作前要確認的事' },
]

const chainSteps = ['看料', '設計', '雕刻', '拋光', '檢測', '批發與銷售']

export default function SihuiJadeCasePage() {
  return (
    <article className="bg-brand-bg text-brand-text">
      <header className="mx-auto max-w-7xl px-6 pb-14 pt-32 sm:pb-20 sm:pt-40">
        <nav aria-label="麵包屑" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-brand-text/70">
          <Link href="/">首頁</Link>
          <span aria-hidden="true">/</span>
          <Link href="/supply-chain">供應鏈案例</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">四會翡翠</span>
        </nav>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#3e5948]">供應鏈串接案例 · {sihuiJadeCase.location}</p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl">
              廣東四會<br />翡翠供應鏈
            </h1>
            <p className="mt-5 font-serif text-xl leading-relaxed text-[#3e5948] sm:text-2xl">熟門熟路的在地人脈</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-brand-text/75 sm:text-lg">
              翡翠是高單價、非標準化的商品。從台灣找貨源，除了看商品，也需要了解對方的看料經驗、加工判斷，以及在當地長期累積的信用。
            </p>
            <p className="mt-6 text-sm text-brand-text/70">懂陸姐 · 在地人脈與產業觀察</p>
            <Link href="#connection" className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-[#3e5948] text-sm font-semibold text-[#3e5948]">
              看懂這條供應鏈
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <figure>
            <Image
              src={sihuiJadeCase.cover}
              alt={sihuiJadeCase.coverAlt}
              width={1600}
              height={1200}
              priority
              sizes="(max-width: 1023px) calc(100vw - 48px), (max-width: 1279px) 50vw, 600px"
              className="h-auto w-full"
            />
            <figcaption className="mt-3 text-xs leading-6 text-brand-text/70">芬姐與翡翠作品展示。照片由懂陸姐提供。</figcaption>
          </figure>
        </div>
      </header>

      <nav aria-label="案例章節" className="border-y border-brand-text/15 bg-[#eef1e8]">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-7 gap-y-1 px-6 py-4">
          {sections.map((section) => (
            <Link key={section.id} href={`#${section.id}`} className="inline-flex min-h-11 items-center text-sm font-medium text-[#3e5948] underline-offset-8 hover:underline">
              {section.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <section id="connection" aria-labelledby="connection-heading" className="scroll-mt-28 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#3e5948]">在地連結</p>
            <h2 id="connection-heading" className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">這條人脈<br className="hidden md:block" />怎麼接起來</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-brand-text/80 sm:text-lg">
            <p>我在大陸生活十多年，有香港朋友長期在四會做翡翠加工、經營工廠，也做了十多年。英姐與芬姐，都是透過這些熟人關係認識、實際接觸過的在地從業者。</p>
            <p>這些關係讓我能了解她們從哪裡做起、在當地經營了多久，以及她們和加工端、客商之間的往來。台灣買家可以先認識合作對象，再評估具體貨源與加工需求。</p>
            <div className="bg-[#eef1e8] p-6 sm:p-8">
              <p className="mb-4 text-sm font-semibold text-[#3e5948]">本案例的串接關係</p>
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-3 text-sm font-medium leading-7 text-brand-text">
                {['台灣買家', '懂陸姐', '長期在四會經營的香港朋友', '英姐、芬姐等在地從業者'].map((item, index) => (
                  <li key={item} className="inline-flex items-center gap-3">
                    {index > 0 && <ArrowRight className="size-4 shrink-0 text-[#3e5948]" aria-hidden="true" />}
                    {item}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm leading-7 text-brand-text/70">透過熟悉產業的人，先了解背景，再討論合作。</p>
            </div>
          </div>
        </section>

        <section id="industry" aria-labelledby="industry-heading" className="mt-16 scroll-mt-28 border-t border-brand-text/15 pt-12 sm:mt-24 sm:pt-16">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#3e5948]">產業背景</p>
              <h2 id="industry-heading" className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">認識四會<br className="hidden md:block" />翡翠產業帶</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-brand-text/80 sm:text-lg">
              <p>廣東翡翠產業的重要集散地包括四會、揭陽、平洲與廣州華林，各有不同的加工、交易與客群結構。四會的特色是加工體量大、品類多，產業鏈集中。</p>
              <p>四會本身不產翡翠原石，主要原料長期來自緬甸等上游來源。當地累積的優勢，在於加工技術、看料經驗，以及大量從業者聚集形成的交易網絡。</p>
              <p>改革開放前後到 1990 年代，珠三角珠寶產業成長，廣州、香港與周邊城市的人才、訂單與資金往來增加。四會原有的玉雕工匠與加工基礎，逐步吸引加工、交易及配套資源聚集。</p>
              <p>到了 1990 年代至 2000 年代，天光墟、玉器街與玉器城等專業市場逐漸成熟。香港、台灣及其他地區的客商前來找加工、看貨、做貨，當地也發展出更完整的產業鏈。</p>
              <div className="pt-3">
                <h3 className="text-sm font-semibold text-[#3e5948]">原料進入四會後的加工與交易環節</h3>
                <ol className="mt-4 grid grid-cols-2 border-t border-brand-text/15 sm:grid-cols-3">
                  {chainSteps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 border-b border-brand-text/15 py-4 text-sm">
                      <span className="font-playfair text-lg text-[#3e5948]">{String(index + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section id="ying" aria-labelledby="ying-heading" className="mt-16 scroll-mt-28 border-t border-brand-text/15 pt-12 sm:mt-24 sm:pt-16">
          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <figure className="max-w-md">
              <Image src="/images/supply-chain/sihui-ying.webp" alt="拜訪英姐時，她坐在桌邊的照片" width={1200} height={1600} sizes="(max-width: 1023px) calc(100vw - 48px), 448px" className="h-auto w-full" />
              <figcaption className="mt-3 text-xs leading-6 text-brand-text/70">拜訪英姐時的照片，由懂陸姐提供。</figcaption>
            </figure>
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#3e5948]">在地從業者 · 英姐</p>
              <h2 id="ying-heading" className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">從看料、管貨<br />到自己的店鋪與設計</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-brand-text/80 sm:text-lg">
                <p>英姐是四會本地人。我透過長期在四會做翡翠的香港朋友認識她，也實際拜訪過她。</p>
                <p>早年跨境往來與資訊傳遞沒有今天方便，香港老闆人在香港，原料與工廠在內地，需要有人在當地看料、收貨、管貨並處理現場事情。英姐熟悉四會的市場、人脈與加工端，逐漸得到客商信任，協助選料、收款和拿貨，有些客商也將貨交給她處理。</p>
                <p>後來她經營起多個店鋪，也累積了設計經驗。她會畫圖，能從一塊料的形狀、顏色與紋理思考怎麼利用，尤其擅長重新設計容易被忽略的邊角料。</p>
                <p>我看重的是她長期累積的看料經驗、在地信用與加工判斷。這些經驗，能讓台灣客戶在討論翡翠貨源時，多一個了解材料與工藝的角度。</p>
              </div>
            </div>
          </div>
        </section>

        <section id="fen" aria-labelledby="fen-heading" className="mt-16 scroll-mt-28 border-t border-brand-text/15 pt-12 sm:mt-24 sm:pt-16">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#3e5948]">在地從業者 · 芬姐</p>
              <h2 id="fen-heading" className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">從工廠第一線<br />到文寶齋翡翠博物館</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-brand-text/80 sm:text-lg">
              <p>芬姐同樣是四會本地人。她早期在我認識的香港老闆所經營的工廠體系裡工作，從第一線接觸玉器加工、打磨與生產流程，逐漸熟悉材料、工藝與市場。</p>
              <p>從工廠與加工，到看貨、經營及客戶往來，她一路累積經驗，後來建立了文寶齋翡翠博物館。</p>
              <p>透過作品、材料與工藝展示，外部客戶也能了解四會的加工文化與產業背景。對初次接觸翡翠的買家來說，這是一個認識產業的入口。</p>
              <p>我看重她從工廠第一線走到今天的經歷，以及在當地持續經營的實體場域。她和英姐各自走過不同的路，也都和四會的產業有長期關係。</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="trust-heading" className="mt-16 bg-[#eef1e8] p-6 sm:mt-24 sm:p-12">
          <p className="text-xs font-semibold tracking-widest text-[#3e5948]">懂陸姐的觀察</p>
          <h2 id="trust-heading" className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">為什麼看重長期留在產業裡的人</h2>
          <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-brand-text/80 sm:text-lg">
            <p>近十多年，直播與短影音帶來新的客群，也吸引許多外地團隊進入四會。高單價商品的交易環節增加後，借貨、貨款糾紛與誇大宣傳等問題，都讓合作對象的信用更受重視。</p>
            <p>英姐與芬姐經歷過產業高峰，也走過競爭更激烈的階段。了解她們過去如何做生意、在當地有哪些關係，以及能否持續找到人，是我評估供應鏈的重要依據。</p>
            <p>這個案例希望減少台灣買家與四會產業之間的資訊落差。先知道自己正在和誰合作，再逐步確認商品與交易細節。</p>
          </div>
        </section>

        <section id="cooperation" aria-labelledby="cooperation-heading" className="mt-16 scroll-mt-28 sm:mt-24">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#3e5948]">合作評估</p>
              <h2 id="cooperation-heading" className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">先了解人<br />再逐件確認條件</h2>
            </div>
            <div>
              <p className="text-base leading-8 text-brand-text/80 sm:text-lg">在地人脈能幫助你了解合作對象。本案例介紹的經歷與關係，供合作評估參考，不構成商品品質或交易結果的保證。實際合作仍需由買賣雙方逐件確認以下事項。</p>
              <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                {['商品品質與實際狀況', '價格與報價內容', '證書與檢測資訊', '加工需求與交易條件'].map((item) => (
                  <li key={item} className="border-b border-brand-text/15 py-4 text-base font-medium">{item}</li>
                ))}
              </ul>
              <div className="mt-10">
                <h3 className="font-serif text-xl">想找四會翡翠貨源或加工資源？</h3>
                <p className="mt-3 text-base leading-8 text-brand-text/75">聯繫時可以先說明想找的品類，以及採購或加工需求，讓懂陸姐了解你的方向，再討論是否有合適的在地資源。</p>
                <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center gap-3 bg-[#3e5948] px-6 py-3 text-sm font-semibold text-[#fff7ed] transition-colors hover:bg-[#2f4537]">
                  和懂陸姐聊聊供應鏈需求
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-16 border-t border-brand-text/15 pt-6">
          <Link href="/supply-chain" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#3e5948] underline underline-offset-4">返回供應鏈案例</Link>
        </div>
      </div>
    </article>
  )
}
