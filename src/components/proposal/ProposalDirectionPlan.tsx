import {
  ArrowDown,
  Check,
  CircleAlert,
  ClipboardCheck,
  FileCheck2,
  PackageCheck,
} from 'lucide-react'
import { ProposalLogoutButton } from './ProposalLogoutButton'

const chapters = [
  { id: 'direction', label: '01　新站方向' },
  { id: 'experience', label: '02　內容架構' },
  { id: 'implementation', label: '03　我會處理的修改' },
  { id: 'materials', label: '04　請您準備的資料' },
  { id: 'decisions', label: '05　需要確認的項目' },
  { id: 'next-step', label: '06　確認後的下一步' },
]

const directionPoints = [
  '網站以內容、觀點、文章與市場觀察為核心，先建立長期可閱讀、可搜尋的內容基礎。',
  '產業帶與供應鏈內容由文章自然延伸，讓讀者先理解背景、特色與判斷依據，再接觸合作資訊。',
  '「供應鏈推薦」是一個由您篩選與整理的推薦目錄，可以介紹企業、團隊、產業帶、工廠、檔口或具體商品。',
  '商品與合作功能依實際需求逐步發展，第一階段保留彈性，不預設每個頁面都能下單或一定要走相同流程。',
]

const editorialFlow = [
  { number: '01', title: '內容與觀點', description: '文章、市場觀察、產業判斷與長期主題。' },
  { number: '02', title: '產業帶與供應鏈', description: '從內容延伸到企業、團隊、工廠與合作來源。' },
  { number: '03', title: '商品與合作', description: '依實際條件決定展示、詢問、B2B 或直接購買。' },
]

const implementationGroups = [
  {
    eyebrow: 'EDITORIAL & HOME',
    title: '內容首頁與品牌訊息',
    items: [
      '重寫首頁主標與說明文字，先讓訪客看見最新觀點、文章與市場觀察。',
      '首頁以主題內容帶出產業帶與供應鏈推薦，聯絡合作放在閱讀之後，避免一進站就像商城或媒合平台。',
      '保留「懂陸姐」的品牌辨識度，讓每篇推薦都能看出篩選理由、資料來源與適合的合作方向。',
    ],
  },
  {
    eyebrow: 'SUPPLY DIRECTORY',
    title: '供應鏈推薦目錄',
    items: [
      '建立共用內容架構，同時支援企業、團隊、產業帶、工廠、檔口、商品與專案介紹。',
      '每一頁可自由組合企業介紹、照片、影片、文字說明、推薦理由與合作方向，不強迫填寫商品價格或庫存。',
      '依內容個別設定「純展示、LINE 詢問、索取合作資料、B2B 合作、直接購買」等狀態。',
      '推薦內容由您整理後發布，前台清楚標示資料更新日期與目前可提供的合作方式。',
    ],
  },
  {
    eyebrow: 'FLEXIBLE COMMERCE',
    title: '保留未來商務彈性',
    items: [
      '第一階段不使用「商城」作為主要名稱，也不把結帳、庫存與訂單當成每筆內容的必要條件。',
      '系統保留商品、價格與購買功能的擴充位置，未來可針對適合直接販售的供應鏈個別啟用。',
      '適合 B2B 的內容可改用合作詢問；仍在觀察的內容只做展示，不會把後續流程綁死。',
    ],
  },
  {
    eyebrow: 'CONTACT & INSIGHT',
    title: '聯絡、追蹤與搜尋延續',
    items: [
      '台灣端若有實際需求，先透過 LINE 或其他聯絡方式詢問，再由您判斷是否協助連結。',
      '後台記錄詢問來自哪篇文章或哪筆供應鏈推薦，方便了解哪些內容真的帶來合作。',
      '保留有搜尋價值的舊文章與網址，未來內容持續聚焦市場觀察、產業帶、企業訪談與供應鏈案例。',
    ],
  },
]

const materialGroups = [
  {
    number: '01',
    title: '內容主題與既有文章',
    description: '先確認新站要持續累積的觀點與市場觀察主題。',
    items: ['現有文章的保留與分類清單', '未來三個月預計撰寫的主題', '希望長期追蹤的市場或產業', '可公開的個人觀點與判斷', '停止服務但仍需保留的舊內容'],
  },
  {
    number: '02',
    title: '首批供應鏈推薦',
    description: '建議先準備 3 筆不同類型的內容，測試新架構是否足夠彈性。',
    items: ['一個產業帶或區域介紹', '一家企業、團隊、工廠或檔口', '一項具體商品或合作專案', '每筆內容的推薦理由', '目前適合的合作方向與公開範圍'],
  },
  {
    number: '03',
    title: '圖片、影片與說明素材',
    description: '供應鏈推薦需要真實素材，才能呈現您整理與判斷的過程。',
    items: ['企業、產業帶或現場照片', '商品照片與介紹影片', '企業或團隊基本資料', '訪談內容與可公開引述', '素材授權與可公開範圍'],
  },
  {
    number: '04',
    title: '聯絡與合作設定',
    description: '每筆內容只需提供目前已確定的合作方式，未確定的欄位可以留白。',
    items: ['LINE 與其他聯絡方式', '是否接受一般詢問', '是否開放 B2B 合作', '是否已有可直接購買的商品', '哪些資訊需詢問後才能提供'],
  },
]

const decisions = [
  {
    title: '首頁最先呈現哪些內容',
    context: '新站會以觀點與市場觀察為核心，需要決定首頁第一屏及前半段優先呈現的主題。',
    recommendation: '我的建議是先放最新觀點、重點市場觀察與精選專題，供應鏈推薦放在內容之後承接閱讀興趣。',
  },
  {
    title: '首批推薦內容的組合',
    context: '供應鏈推薦可以介紹企業、團隊、產業帶、工廠、檔口或商品，第一批內容會決定訪客如何理解這個區域。',
    recommendation: '我的建議是先各準備一筆產業帶、企業或團隊、具體商品內容，確認版型能涵蓋不同情況。',
  },
  {
    title: '前台使用什麼分類名稱',
    context: '「商城」容易讓訪客預期每一頁都有價格、庫存與直接購買功能，與目前規劃不符。',
    recommendation: '我的建議是統一使用「供應鏈推薦」，頁面內再以企業、產業帶、工廠、檔口、商品或合作專案分類。',
  },
  {
    title: '何時啟用購買功能',
    context: '部分供應鏈未來可能適合直接購買，部分只適合 B2B 合作，目前不需要先決定完整商城規模。',
    recommendation: '我的建議是先完成內容展示與 LINE 詢問；遇到供貨、價格、付款及售後都已確認的品項，再逐筆開啟購買功能。',
  },
]

export function ProposalDirectionPlan() {
  return (
    <main className="min-h-screen bg-[#f4ecdf] text-[#28231f]">
      <header className="border-b border-[#d7c8b5] bg-[#28231f] text-[#fffaf2]">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-[#dca77f]">CHINALINK · DIRECTION BRIEF</p>
              <p className="mt-1 font-serif text-xl font-bold">網站轉型方向確認書</p>
            </div>
            <ProposalLogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-[#d7c8b5] bg-[#ede2d3] px-5 py-7 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="max-w-sm">
            <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">PROJECT STATUS</p>
            <p className="mt-2 font-serif text-3xl font-bold">方向確認階段</p>
            <p className="mt-3 text-sm leading-6 text-[#75675b]">請先確認定位、工作範圍與需準備資料。方向確認後，我會依此安排開發順序。</p>
          </div>
          <div className="mt-6 border-y border-[#d7c8b5] py-5">
            <div className="flex items-center gap-3 text-sm font-bold text-[#70472f]">
              <ClipboardCheck className="size-5" aria-hidden="true" />
              版本日期　2026.09.23
            </div>
          </div>
          <nav aria-label="行動版頁面章節" className="mt-5 grid grid-cols-2 border border-[#d7c8b5] lg:hidden">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="border-b border-r border-[#d7c8b5] px-3 py-3 text-sm font-medium text-[#66594e]"
              >
                {chapter.label}
              </a>
            ))}
          </nav>
          <nav aria-label="頁面章節" className="mt-7 hidden border-t border-[#d7c8b5] pt-5 lg:block">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="block border-b border-[#d7c8b5] py-3 text-sm font-medium text-[#66594e] transition-colors hover:bg-[#e4d5c3] hover:px-2 hover:text-[#70472f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f5d35]"
              >
                {chapter.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 bg-[#fffcf6] px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
          <section className="max-w-4xl border-b border-[#d7c8b5] pb-14 sm:pb-20">
            <p className="text-xs font-bold tracking-[0.22em] text-[#9f5d35]">網站重新定位 · 執行前確認</p>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.8rem,6vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.04em]">
              先建立觀點<br />再延伸供應鏈
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6f6257]">
              我已依照最新需求重新整理新站方向。網站會先累積內容、觀點、文章與市場觀察，再由這些內容延伸到產業帶、供應鏈推薦及可能的商品合作。第一階段不把網站定義成商城，也不預設所有推薦內容都要直接交易。
            </p>
            <a
              href="#direction"
              className="mt-10 inline-flex min-h-12 items-center gap-3 bg-[#9f5d35] px-6 font-bold text-[#fffaf2] transition-colors hover:bg-[#82482a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f5d35] focus-visible:ring-offset-2"
            >
              查看確認內容
              <ArrowDown className="size-5" aria-hidden="true" />
            </a>
          </section>

          <section id="direction" className="scroll-mt-8 border-b border-[#d7c8b5] py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">01 · DIRECTION</p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-4xl">新站的核心方向</h2>
            <div className="mt-8 bg-[#28231f] p-6 text-[#fffaf2] sm:p-9">
              <p className="text-xs font-bold tracking-[0.18em] text-[#dca77f]">建議定位</p>
              <p className="mt-5 max-w-3xl font-serif text-2xl font-bold leading-relaxed sm:text-3xl">
                以內容與市場觀察建立判斷，再從文章延伸到中國大陸產業帶、供應鏈與合作機會。
              </p>
            </div>
            <ul className="mt-8 grid gap-px border border-[#d7c8b5] bg-[#d7c8b5] sm:grid-cols-2">
              {directionPoints.map((point, index) => (
                <li key={point} className="bg-[#fffcf6] p-5 sm:p-7">
                  <span className="font-serif text-2xl font-bold text-[#b88a67]">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-3 leading-7 text-[#5f534a]">{point}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="experience" className="scroll-mt-8 border-b border-[#d7c8b5] py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">02 · EXPERIENCE</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">內容如何一路延伸到合作</h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">訪客先透過文章理解市場與產業，再進入供應鏈推薦。商品與合作是內容累積後的延伸，不會搶走首頁的主角位置。</p>
            <div className="mt-9 grid border border-[#d7c8b5] md:grid-cols-3">
              {editorialFlow.map((step, index) => (
                <article key={step.number} className="relative border-b border-[#d7c8b5] p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-8">
                  <p className="font-serif text-3xl font-bold text-[#b88a67]">{step.number}</p>
                  <h3 className="mt-6 font-serif text-2xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#66594e]">{step.description}</p>
                  {index < editorialFlow.length - 1 && <span aria-hidden="true" className="mt-5 block text-xl text-[#9f5d35] md:absolute md:right-[-9px] md:top-1/2 md:z-10 md:mt-0 md:-translate-y-1/2 md:bg-[#fffcf6] md:px-1">→</span>}
                </article>
              ))}
            </div>
            <p className="mt-12 text-xs font-bold tracking-[0.18em] text-[#9f5d35]">建議主選單</p>
            <div className="mt-9 border-y border-[#d7c8b5]">
              {['市場觀察', '觀點文章', '產業帶', '供應鏈推薦', '關於懂陸姐'].map((item, index) => (
                <div key={item} className="grid grid-cols-[52px_1fr] border-b border-[#d7c8b5] py-5 last:border-b-0 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                  <span className="font-serif text-xl font-bold text-[#b88a67]">0{index + 1}</span>
                  <span className="font-serif text-xl font-bold">{item}</span>
                  <span className="col-start-2 mt-1 text-sm text-[#7c6d60] sm:col-start-auto sm:mt-0">{item === '供應鏈推薦' ? '推薦目錄' : '內容入口'}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="bg-[#ede2d3] p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">首頁主要入口</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">閱讀最新觀點</h3>
                <p className="mt-3 leading-7 text-[#66594e]">讓訪客先從近期市場觀察、專題與文章開始認識網站。</p>
              </div>
              <div className="bg-[#ede2d3] p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">內容延伸入口</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">查看供應鏈推薦</h3>
                <p className="mt-3 leading-7 text-[#66594e]">閱讀企業、產業帶、工廠、檔口與商品的整理內容，有需求時再透過 LINE 詢問。</p>
              </div>
            </div>
          </section>

          <section id="implementation" className="scroll-mt-8 border-b border-[#d7c8b5] py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">03 · IMPLEMENTATION</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">我這邊會處理的修改</h2>
            <div className="mt-10 space-y-12">
              {implementationGroups.map((group) => (
                <article key={group.title} className="grid gap-5 border-t border-[#bda98f] pt-7 md:grid-cols-[230px_1fr] md:gap-10">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-[#9f5d35]">{group.eyebrow}</p>
                    <h3 className="mt-3 font-serif text-2xl font-bold">{group.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-7 text-[#5f534a]">
                        <Check className="mt-1.5 size-4 shrink-0 text-[#9f5d35]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="materials" className="scroll-mt-8 border-b border-[#d7c8b5] py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">04 · MATERIALS</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">需要請您準備的資料</h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">網站架構可以先進行，真正決定新站內容厚度的仍是觀點文章與第一批供應鏈推薦。建議先集中準備以下四組資料。</p>
            <div className="mt-10 grid gap-px border border-[#d7c8b5] bg-[#d7c8b5] lg:grid-cols-2">
              {materialGroups.map((group) => (
                <article key={group.number} className="bg-[#f8f1e7] p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif text-4xl font-bold text-[#b88a67]">{group.number}</span>
                    <PackageCheck className="size-6 text-[#9f5d35]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-bold">{group.title}</h3>
                  <p className="mt-3 leading-7 text-[#6f6257]">{group.description}</p>
                  <ul className="mt-5 space-y-2 border-t border-[#d7c8b5] pt-5 text-sm leading-6 text-[#5f534a]">
                    {group.items.map((item) => <li key={item}>・{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="decisions" className="scroll-mt-8 border-b border-[#d7c8b5] py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">05 · DECISIONS</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">正式修改前，還需要確認四件事</h2>
            <div className="mt-10 space-y-5">
              {decisions.map((decision, index) => (
                <article key={decision.title} className="border border-[#d7c8b5] bg-[#fffcf6] p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center bg-[#28231f] font-serif font-bold text-[#fffaf2]">{index + 1}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold">{decision.title}</h3>
                      <p className="mt-3 leading-7 text-[#6f6257]">{decision.context}</p>
                    </div>
                  </div>
                  <div className="mt-6 bg-[#ede2d3] p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-[#70472f]"><CircleAlert className="size-4" aria-hidden="true" />我的建議</p>
                    <p className="mt-2 leading-7 text-[#5f534a]">{decision.recommendation}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="next-step" className="scroll-mt-8 py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">06 · NEXT STEP</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">請確認這個方向是否正確</h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">如果整體方向符合預期，請回覆是否同意下列五項。需要調整的地方，也可以直接逐項註明。</p>
            <ol className="mt-9 border-y border-[#d7c8b5]">
              {[
                '以內容、觀點、文章與市場觀察作為網站核心。',
                '內容自然延伸到產業帶與供應鏈推薦，再依實際需求發展合作。',
                '前台使用「供應鏈推薦」，不以「商城」作為第一階段定位。',
                '推薦目錄可同時收錄企業、團隊、產業帶、工廠、檔口、商品與合作專案。',
                '第一階段以內容展示及 LINE 詢問為主，購買與 B2B 功能保留彈性。',
              ].map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-[#d7c8b5] py-5 last:border-b-0">
                  <FileCheck2 className="mt-0.5 size-5 shrink-0 text-[#9f5d35]" aria-hidden="true" />
                  <span className="leading-7"><strong className="mr-2 font-serif text-[#9f5d35]">0{index + 1}</strong>{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10 bg-[#28231f] p-7 text-[#fffaf2] sm:p-10">
              <p className="text-xs font-bold tracking-[0.18em] text-[#dca77f]">確認後即可開始</p>
              <p className="mt-4 max-w-2xl font-serif text-2xl font-bold leading-relaxed">收到確認與第一批素材後，我會先完成內容首頁、文章分類與供應鏈推薦的共用版型，再依實際案例補上詢問及合作功能。</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
