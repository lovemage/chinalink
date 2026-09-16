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
  { id: 'direction', label: '01　整體方向' },
  { id: 'experience', label: '02　網站架構' },
  { id: 'implementation', label: '03　我會處理的修改' },
  { id: 'materials', label: '04　請您準備的資料' },
  { id: 'decisions', label: '05　需要確認的項目' },
  { id: 'next-step', label: '06　確認後的下一步' },
]

const directionPoints = [
  '第一優先服務台灣店家與通路，供給端則連結中國大陸供應商與學員。',
  '網站角色以供應鏈媒合平台與採購顧問為主，協助台灣端找到合適的商品與合作來源。',
  '第一階段收入可來自媒合成交佣金、導購分潤與供應商刊登費；供應商先採免費測試，後續再依成效訂定收費。',
  '一年內以店家與通路詢價、供應商合作申請作為主要成果。',
]

const implementationGroups = [
  {
    eyebrow: 'POSITIONING & HOME',
    title: '首頁與品牌訊息',
    items: [
      '重寫首頁主標、說明文字與行動按鈕，讓訪客一進站就知道這裡提供中國大陸選品與供應鏈媒合。',
      '首頁依序呈現精選內容、篩選標準、店家入口、消費者入口、供應商訪談與市場觀察。',
      '品牌維持「懂陸姐」的辨識度，畫面與文案以平台專業為主，不特別強調個人露出。',
    ],
  },
  {
    eyebrow: 'PRODUCT & SUPPLY',
    title: '商品與供應鏈資料',
    items: [
      '把內容分成一般消費商品、店家批發選品、工廠與產業帶、OEM／ODM 專案。',
      '商品頁增加產地、起訂量、交期、包裝、法規狀態、物流方式、合作方式與資料更新日期。',
      '同一商品可同時提供消費者與通路資訊，並依商品狀態顯示 LINE 詢問、索取資料或加入購物車。',
      '尚未正式進入台灣的品項會清楚標示「市場測試中」。',
    ],
  },
  {
    eyebrow: 'LEADS & OPERATIONS',
    title: '詢問、合作與後台管理',
    items: [
      '建立店家找商品與供應商合作所需的資料結構，第一階段共用同一個聯絡入口。',
      '系統依進入頁面自動標記詢問來源，保存聯絡內容、處理狀態與後續紀錄。',
      '串接 LINE 官方帳號與微信，並追蹤商品瀏覽、文章閱讀及聯絡按鈕點擊。',
      'AI 客服只回答已公開、已確認的內容，不提供未公開價格或代替人工判斷法規。',
    ],
  },
  {
    eyebrow: 'CONTENT & SEO',
    title: '內容與搜尋延續',
    items: [
      '保留仍有搜尋價值的舊文章與網址，停止提供的服務會加上明確說明。',
      '新內容聚焦產業帶、供應商訪談、台灣通路觀察、兩岸消費差異、進口法規物流與市場案例。',
      '全站統一使用台灣繁體中文，並以「中國大陸」及「中國大陸選品」作為主要用語。',
    ],
  },
]

const materialGroups = [
  {
    number: '01',
    title: '首批商品與供應鏈',
    description: '建議先準備 3 件，整體可控制在 1 至 5 件。',
    items: ['商品名稱與分類', '商品圖片與影片', '產地與供應商基本資料', '包裝規格、交期與起訂量', '合作方式與可否直接銷售'],
  },
  {
    number: '02',
    title: '店家判斷所需資料',
    description: '這些資料會直接影響商品頁是否具有合作價值。',
    items: ['批發價格或提供價格的條件', '建議售價與毛利資訊', '樣品申請方式', '物流與售後窗口', '台灣法規或檢驗資料'],
  },
  {
    number: '03',
    title: '品牌與內容素材',
    description: '目前素材尚未備妥，這會是上線前最主要的準備工作。',
    items: ['可公開的供應商訪談', '現場看廠或商品照片', 'LINE 官方帳號與微信連結', '既有文章的保留／停止服務清單', '可用來說明篩選能力的案例'],
  },
  {
    number: '04',
    title: '合作責任資料',
    description: '每件商品都需要有明確答案，避免訪客誤解交易關係。',
    items: ['實際銷售與收款單位', '法規、標示及進口資格負責人', '退換貨與售後負責人', '刊登是否屬於付費合作', '詢問資料可轉交給哪些合作方'],
  },
]

const decisions = [
  {
    title: '購物車如何保留',
    context: '目前希望保留購物車、線上結帳及付款紀錄，但多數商品又以 LINE 詢問與媒合為主。',
    recommendation: '我的建議是保留現有系統，只讓可直接銷售的商品顯示購物車；媒合型商品改為 LINE 詢問。',
  },
  {
    title: '商業資料公開程度',
    context: '店家需要批發價、毛利、交期與包裝資料，但目前也傾向在詢問後才提供商業資訊。',
    recommendation: '我的建議是先公開包裝與交期範圍，價格、毛利及起訂量在確認店家身分後提供。',
  },
  {
    title: '商品責任怎麼分配',
    context: '法規與進口責任可能由供應商、懂陸姐或雙方依商品另行約定，售後處理方式也還未決定。',
    recommendation: '我的建議是不要套用單一全站規則，改成每件商品個別標示銷售方、法規負責方與售後窗口。',
  },
  {
    title: '第一階段不碰哪些品類',
    context: '目前尚未決定高風險品類的排除範圍。',
    recommendation: '我的建議是先從法規負擔較低的生活用品開始，需要特殊檢驗或許可的品項另行審查後再刊登。',
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
              版本日期　2026.09.16
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
              把網站轉成<br />供應鏈媒合入口
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6f6257]">
              我已將這次確認的內容整理成網站定位、修改範圍與素材清單。請您先確認整體方向是否符合接下來想推進的方式；確認後，我會據此拆分正式開發項目與上線順序。
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
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-4xl">這次轉型後，網站要扮演的角色</h2>
            <div className="mt-8 bg-[#28231f] p-6 text-[#fffaf2] sm:p-9">
              <p className="text-xs font-bold tracking-[0.18em] text-[#dca77f]">建議定位</p>
              <p className="mt-5 max-w-3xl font-serif text-2xl font-bold leading-relaxed sm:text-3xl">
                台灣人了解中國大陸商品與可靠供應鏈的窗口，提供選品判斷、供應鏈媒合與採購協助。
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
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">網站架構與訪客路徑</h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">主選單先收斂成四個入口，商品與合作內容再依訪客需求分流。</p>
            <div className="mt-9 border-y border-[#d7c8b5]">
              {['供應鏈情報', '市場觀察', '合作提案', '關於懂陸姐'].map((item, index) => (
                <div key={item} className="grid grid-cols-[52px_1fr] border-b border-[#d7c8b5] py-5 last:border-b-0 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                  <span className="font-serif text-xl font-bold text-[#b88a67]">0{index + 1}</span>
                  <span className="font-serif text-xl font-bold">{item}</span>
                  <span className="col-start-2 mt-1 text-sm text-[#7c6d60] sm:col-start-auto sm:mt-0">主要導覽</span>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="bg-[#ede2d3] p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">首頁主要行動</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">加入 LINE</h3>
                <p className="mt-3 leading-7 text-[#66594e]">提供一般詢問、選品需求與合作接洽，並在後台保留來源標記。</p>
              </div>
              <div className="bg-[#ede2d3] p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">首頁次要行動</p>
                <h3 className="mt-3 font-serif text-2xl font-bold">找供應鏈／批發合作</h3>
                <p className="mt-3 leading-7 text-[#66594e]">讓台灣店家快速進入商品與供應鏈內容，了解合作方式後再提出需求。</p>
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
            <p className="mt-5 max-w-2xl leading-7 text-[#6f6257]">網站架構可以先進行，但商品頁與合作內容需要真實資料才能完成。建議先集中準備以下四組內容。</p>
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
                '以台灣店家與通路作為第一優先客群。',
                '以供應鏈媒合與採購顧問作為網站主要角色。',
                '首批先準備 3 件生活用品或供應鏈內容。',
                '購物車只用於可直接銷售的商品，其他品項改用 LINE 詢問。',
                '同意依每件商品分別確認法規、交易與售後責任。',
              ].map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-[#d7c8b5] py-5 last:border-b-0">
                  <FileCheck2 className="mt-0.5 size-5 shrink-0 text-[#9f5d35]" aria-hidden="true" />
                  <span className="leading-7"><strong className="mr-2 font-serif text-[#9f5d35]">0{index + 1}</strong>{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10 bg-[#28231f] p-7 text-[#fffaf2] sm:p-10">
              <p className="text-xs font-bold tracking-[0.18em] text-[#dca77f]">確認後即可開始</p>
              <p className="mt-4 max-w-2xl font-serif text-2xl font-bold leading-relaxed">收到確認與第一批素材後，我會先完成首頁資訊架構、商品資料欄位及第一版內容版型，再安排後續功能與上線檢查。</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
