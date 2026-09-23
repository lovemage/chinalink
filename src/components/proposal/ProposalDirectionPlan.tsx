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
  { id: 'experience', label: '02　內容轉換漏斗' },
  { id: 'implementation', label: '03　我會處理的修改' },
  { id: 'materials', label: '04　請您準備的資料' },
  { id: 'decisions', label: '05　需要確認的項目' },
  { id: 'next-step', label: '06　確認後的下一步' },
]

const directionPoints = [
  '網站以內容、觀點、文章與市場觀察為核心，持續累積可閱讀、可搜尋，也能支撐專業判斷的內容。',
  '每篇內容都要承接下一步行動，讓有實際需求的讀者能透過官方 LINE 進入顧問諮詢。',
  '諮詢後再依需求進行服務報價、產業鏈接觸或供應鏈連接，不把所有讀者導向同一種交易流程。',
  '內容要逐步形成兩岸產業知識脈絡，提升搜尋曝光與 AI 理解、索引及引用的機會。',
]

const editorialFlow = [
  { number: '01', title: '內容與觀點', description: '用文章、市場觀察與產業判斷建立搜尋入口。' },
  { number: '02', title: '持續閱讀', description: '以主題頁、相關文章與供應鏈內容延長閱讀路徑。' },
  { number: '03', title: 'LINE 顧問接觸', description: '在關鍵段落及文章結尾提供清楚的官方 LINE 聯繫入口。' },
  { number: '04', title: '需求與報價', description: '先了解問題、預算及合作條件，再提出適合的服務與報價。' },
  { number: '05', title: '產業鏈連接', description: '依實際需求安排企業、產業帶、工廠或供應鏈的下一步接觸。' },
]

const outcomeGoals = [
  {
    eyebrow: 'CONSULTING CONVERSION',
    title: '讓內容帶來顧問接觸',
    description: '讀者先從文章建立信任，有明確需求時再透過 LINE 聯繫。後續由您進行需求判斷、服務報價及產業鏈連接。',
  },
  {
    eyebrow: 'AI & SEARCH VISIBILITY',
    title: '建立兩岸產業參考價值',
    description: '以清楚的主題架構、作者經驗、資料來源及持續更新，讓搜尋引擎與 AI 更容易理解網站內容，逐步累積引用與被找到的機會。',
  },
]

const implementationGroups = [
  {
    eyebrow: 'CONTENT ENGINE',
    title: '文章與流量內容架構',
    items: [
      '首頁先呈現最新觀點、重點市場觀察與主題專題，讓文章成為主要流量入口。',
      '建立主題頁、文章分類、標籤、相關內容與內部連結，讓讀者能沿著同一個產業問題持續閱讀。',
      '每篇文章保留作者、更新日期、資料來源與延伸閱讀，長期累積「懂陸姐」在兩岸產業議題上的專業辨識度。',
    ],
  },
  {
    eyebrow: 'CONSULTING FUNNEL',
    title: 'LINE 顧問轉換模組',
    items: [
      '沿用現有聯絡模組，改成可重複放入文章關鍵段落及文末的官方 LINE 行動區塊。',
      '依文章主題調整聯繫文案，例如顧問諮詢、評估合作、索取資料或供應鏈接洽。',
      '記錄聯繫入口來自哪篇文章、哪個主題及哪個位置，後續可判斷哪些內容真的帶來有效詢問。',
      '把接觸流程整理為文章閱讀、LINE 諮詢、需求釐清、提出報價及產業鏈連接。',
    ],
  },
  {
    eyebrow: 'ADMIN RESTRUCTURE',
    title: '後台改為內容經營導向',
    items: [
      '調整後台導覽與操作順序，將原本以服務、商品為主的管理方式，改成文章、專題、主題分類與供應鏈推薦優先。',
      '文章編輯新增搜尋摘要、主題關聯、資料來源、常見問題、LINE 行動模組與更新日期等欄位。',
      '原有服務與商品資料先保留，依內容性質轉成顧問服務、供應鏈推薦或文章延伸資料，避免直接刪除既有內容。',
    ],
  },
  {
    eyebrow: 'AI DISCOVERY',
    title: '搜尋與 AI 索引基礎',
    items: [
      '保留有搜尋價值的舊文章與網址，補齊標題、摘要、分類、內部連結、網站地圖及結構化資料。',
      '內容以台海、兩岸產業鏈、產業帶、企業觀察及供應鏈案例形成可持續擴充的主題架構。',
      '定期更新重要文章並清楚標示作者、日期與資料依據，增加搜尋引擎及 AI 理解內容的條件。',
      '以收錄、曝光、文章停留、LINE 點擊及有效諮詢追蹤成果；AI 是否引用由各平台決定，不作保證。',
    ],
  },
  {
    eyebrow: 'SUPPLY DIRECTORY',
    title: '供應鏈推薦與合作延伸',
    items: [
      '建立共用內容架構，支援企業、團隊、產業帶、工廠、檔口、商品與合作專案介紹。',
      '每一頁可組合照片、影片、文字說明、推薦理由與合作方向，不強迫填寫價格、庫存或下單資訊。',
      '依內容個別設定純展示、LINE 詢問、顧問評估、B2B 合作或直接購買，保留未來發展彈性。',
    ],
  },
]

const materialGroups = [
  {
    number: '01',
    title: '內容主題與發布計畫',
    description: '內容量與更新節奏會直接影響搜尋流量及顧問詢問的累積速度。',
    items: ['現有文章的保留與分類清單', '未來三個月的文章題目與發布頻率', '希望長期追蹤的兩岸市場或產業', '可公開的個人觀點、經驗與判斷', '每個主題希望吸引的讀者與常見問題'],
  },
  {
    number: '02',
    title: '顧問服務與報價流程',
    description: '讀者加入 LINE 後，需要有清楚的詢問、判斷與回覆方式。',
    items: ['希望承接的顧問需求類型', '初次詢問需要蒐集的資料', '可公開的服務範圍與不承接項目', '報價前的評估方式與預計回覆時間', '何種條件下會進一步安排產業鏈連接'],
  },
  {
    number: '03',
    title: '專業資料與首批案例',
    description: 'AI 與搜尋曝光需要穩定、具來源且能持續更新的內容基礎。',
    items: ['作者介紹、經歷與專業領域', '可公開的產業資料與資料來源', '企業、產業帶或現場照片與影片', '首批供應鏈推薦及篩選理由', '可公開的合作案例、訪談或常見問題'],
  },
  {
    number: '04',
    title: 'LINE 與成效追蹤設定',
    description: '聯絡入口會沿用目前模組，再依不同文章與行動目的調整。',
    items: ['官方 LINE 連結與顯示名稱', '加入好友後的歡迎訊息', '各類文章適用的聯繫文案', '需要追蹤的點擊與詢問來源', '聯繫資料的保存方式與使用範圍'],
  },
]

const decisions = [
  {
    title: '第一階段要集中經營哪些主題',
    context: '內容要累積到足以形成搜尋入口，需要先選定少數主題持續更新，避免文章彼此沒有關聯。',
    recommendation: '我的建議是先選定三個與台海、兩岸產業鏈直接相關的主題，每個主題先規劃一篇核心文章與數篇延伸內容。',
  },
  {
    title: '文章中的 LINE 入口放在哪裡',
    context: '聯絡模組需要有足夠曝光，也要避免過度打斷閱讀。不同長度與目的的文章可以採用不同配置。',
    recommendation: '我的建議是短文放在文末；長文可放在關鍵章節後方及文末。每個入口都要配合該段內容說明讀者可以詢問什麼。',
  },
  {
    title: '顧問諮詢如何進入報價',
    context: 'LINE 聯繫後需要先判斷需求內容、時程及可行性，才適合提出顧問服務或產業鏈連接的報價。',
    recommendation: '我的建議是先建立一份簡短的需求確認項目，資料足夠後再安排進一步討論與正式報價。',
  },
  {
    title: '舊有服務與商品如何轉換',
    context: '後台會改成文章經營優先，原有服務與商品仍可能具有內容、搜尋或合作價值。',
    recommendation: '我的建議是逐筆盤點並分類為顧問服務、供應鏈推薦、文章延伸資料或保留項目，再決定前台呈現方式。',
  },
  {
    title: 'AI 索引先聚焦哪些知識範圍',
    context: 'AI 能否理解及引用網站，會受到主題一致性、資料品質、技術結構與持續更新影響。',
    recommendation: '我的建議是先聚焦台海與兩岸產業鏈相關的市場觀察、產業帶介紹、企業案例及供應鏈問答，逐步建立清楚的主題關係。',
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
              用內容累積流量<br />把需求帶進顧問服務
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6f6257]">
              我已將新站方向補上完整的內容轉換路徑。網站會持續發布觀點、文章與市場觀察，讓搜尋流量先進入內容，再透過官方 LINE 接觸顧問服務。確認實際需求後，才進一步提供報價、產業鏈接觸或供應鏈連接。
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
                以文章建立搜尋流量與專業信任，讓有需求的讀者進入顧問諮詢，再延伸到報價及兩岸產業鏈合作。
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
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">從閱讀流量到顧問合作的完整路徑</h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">這條路徑需要足夠的文章量、穩定更新及清楚的主題關係。每篇內容都要能回答讀者的實際問題，並在適當位置提供下一步聯繫方式。</p>
            <div className="mt-9 grid border border-[#d7c8b5] md:grid-cols-2 xl:grid-cols-5">
              {editorialFlow.map((step, index) => (
                <article key={step.number} className="relative border-b border-[#d7c8b5] p-6 last:border-b-0 md:border-r md:[&:nth-child(even)]:border-r-0 xl:border-b-0 xl:border-r xl:[&:nth-child(even)]:border-r xl:last:border-r-0 sm:p-7">
                  <p className="font-serif text-3xl font-bold text-[#b88a67]">{step.number}</p>
                  <h3 className="mt-6 font-serif text-2xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#66594e]">{step.description}</p>
                  {index < editorialFlow.length - 1 && <span aria-hidden="true" className="mt-5 block text-xl text-[#9f5d35] xl:absolute xl:right-[-9px] xl:top-1/2 xl:z-10 xl:mt-0 xl:-translate-y-1/2 xl:bg-[#fffcf6] xl:px-1">→</span>}
                </article>
              ))}
            </div>
            <p className="mt-12 text-xs font-bold tracking-[0.18em] text-[#9f5d35]">兩個長期成果</p>
            <div className="mt-5 grid gap-px border border-[#d7c8b5] bg-[#d7c8b5] md:grid-cols-2">
              {outcomeGoals.map((goal) => (
                <article key={goal.title} className="bg-[#28231f] p-6 text-[#fffaf2] sm:p-8">
                  <p className="text-xs font-bold tracking-[0.16em] text-[#dca77f]">{goal.eyebrow}</p>
                  <h3 className="mt-4 font-serif text-2xl font-bold">{goal.title}</h3>
                  <p className="mt-4 leading-7 text-[#e7dacc]">{goal.description}</p>
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
                <p className="mt-3 leading-7 text-[#66594e]">讓訪客從近期市場觀察、專題與文章進站，並沿著相關內容持續閱讀。</p>
              </div>
              <div className="bg-[#ede2d3] p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">內容延伸入口</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">查看供應鏈推薦</h3>
                <p className="mt-3 leading-7 text-[#66594e]">閱讀企業、產業帶、工廠、檔口與商品的整理內容，有實際需求時再透過 LINE 進入顧問諮詢。</p>
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
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">網站架構可以先進行，內容數量、專業資料與顧問接洽流程會決定這條轉換路徑能否持續運作。建議先集中準備以下四組資料。</p>
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
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">正式修改前，還需要確認五件事</h2>
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
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">如果整體方向符合預期，請回覆是否同意下列六項。需要調整的地方，也可以直接逐項註明。</p>
            <ol className="mt-9 border-y border-[#d7c8b5]">
              {[
                '以內容、觀點、文章與市場觀察作為網站核心。',
                '文章透過適當的官方 LINE 入口，把有需求的讀者帶入顧問諮詢。',
                '顧問接觸後先釐清需求，再進行報價、產業鏈接觸或供應鏈連接。',
                '後台改成文章、專題、主題分類與供應鏈推薦優先的內容管理方式。',
                '前台保留「供應鏈推薦」，購買與 B2B 功能依個別案例彈性啟用。',
                '網站持續建立兩岸產業知識內容，提升搜尋曝光及 AI 理解與引用的機會。',
              ].map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-[#d7c8b5] py-5 last:border-b-0">
                  <FileCheck2 className="mt-0.5 size-5 shrink-0 text-[#9f5d35]" aria-hidden="true" />
                  <span className="leading-7"><strong className="mr-2 font-serif text-[#9f5d35]">0{index + 1}</strong>{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10 bg-[#28231f] p-7 text-[#fffaf2] sm:p-10">
              <p className="text-xs font-bold tracking-[0.18em] text-[#dca77f]">確認後即可開始</p>
              <p className="mt-4 max-w-2xl font-serif text-2xl font-bold leading-relaxed">收到確認與第一批素材後，我會先完成內容首頁、文章分類、後台內容欄位與 LINE 顧問模組，再建立供應鏈推薦及成效追蹤方式。</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
