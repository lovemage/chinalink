export type ProposalQuestion = {
  id: string
  prompt: string
  options: string[]
}

export type ProposalSection = {
  id: string
  eyebrow: string
  title: string
  summary: string
  recommendations: string[]
  questions: ProposalQuestion[]
}

const undecided = '尚未決定，希望聽取建議'

export const proposalSections: ProposalSection[] = [
  {
    id: 'positioning',
    eyebrow: '01 · 品牌定位',
    title: '懂陸姐網站未來面貌',
    summary: '新網站需要清楚交代服務對象、篩選價值與收入來源，訪客才能理解這個平台與一般商城或廣告平台的差別。',
    recommendations: [
      '品牌定位可採「台灣市場的大陸商品與供應鏈發現平台」。',
      '品牌角色以懂台灣市場的選品人與連接者為主，避免讓人誤認為網站承擔所有銷售與售後。',
      '首頁主標可測試「發現值得進入台灣的大陸好物與供應鏈」。',
      '第一階段先定義一項主要收入來源與一項主要成功指標。',
    ],
    questions: [
      { id: 'priority-audience', prompt: '第一階段最希望優先服務哪些人？', options: ['台灣一般消費者', '台灣實體店與通路', '大陸供應商與學員', '三者同等重要', undecided] },
      { id: 'revenue-model', prompt: '網站第一階段預計從哪些方式獲得收入？', options: ['供應商刊登費', '市場顧問費', '媒合成交佣金', '導購分潤', '商品代理或自營銷售', '第一階段先累積流量，不急著收費', undecided] },
      { id: 'selection-meaning', prompt: '「懂陸姐精選」準備採用哪些審核標準？', options: ['本人實際使用', '樣品測試', '供應商資料審查', '實地看廠或訪談', '台灣市場需求判斷', '只代表內容編輯選擇', undecided] },
      { id: 'platform-role', prompt: '希望網站整體最接近哪幾種角色？', options: ['選品媒體', '商品展示櫥窗', '採購顧問', '供應鏈媒合平台', '未來的電商商城', undecided] },
      { id: 'one-year-goal', prompt: '一年後最希望網站帶來哪些成果？', options: ['自然搜尋流量', '一般消費者名單', '店家與通路詢價', '供應商合作申請', '實際媒合成交', '自營商品訂單', undecided] },
      { id: 'legacy-services', prompt: '哪些舊服務仍要保留？', options: ['完全不保留', '只保留市場顧問', '只保留供應鏈媒合', '只保留內容與平台營運顧問', '個案評估後承作', undecided] },
    ],
  },
  {
    id: 'site-structure',
    eyebrow: '02 · 網站架構',
    title: '三類訪客的網站入口',
    summary: '主選單與首頁需要從舊服務導向，改成好物、供應鏈、內容與合作四條清楚路徑。',
    recommendations: [
      '主選單建議改為「精選好物、供應鏈情報、市場觀察、合作提案、關於懂陸姐」。',
      '首頁設置「我是消費者、我是店家、我是供應商」三個入口。',
      '第一階段先隱藏會員登入、購物車、結帳與付款紀錄。',
      '網站主要行動按鈕分成看商品、找供應鏈、提交商品三種。',
    ],
    questions: [
      { id: 'main-navigation', prompt: '主選單希望保留哪些項目？', options: ['精選好物', '供應鏈情報', '市場觀察', '合作提案', '關於懂陸姐', '舊服務項目', '聯絡我們'] },
      { id: 'audience-entry', prompt: '首頁是否要設置三種身分入口？', options: ['消費者入口', '店家與通路入口', '供應商入口', '不需要身分分流', undecided] },
      { id: 'commerce-features', prompt: '第一階段哪些現有功能要繼續顯示？', options: ['會員登入', '購物車', '線上結帳', '付款紀錄', '以上全部先隱藏', undecided] },
      { id: 'primary-contact', prompt: '網站最主要的轉換工具要用哪些？', options: ['LINE 官方帳號', '微信', 'WhatsApp', '電子郵件', '網站詢問表單', '依使用者身分分流', undecided] },
    ],
  },
  {
    id: 'homepage',
    eyebrow: '03 · 首頁內容',
    title: '首頁資訊架構',
    summary: '目前首頁仍以門號、付款、開店與平台代營運痛點為主，整段內容需要換成選品與供應鏈價值。',
    recommendations: [
      '首頁依序呈現新定位、本期精選、選品標準、產業帶內容、身分分流、最新觀察與合作說明。',
      '本期精選先放少量、具備完整選品理由的商品，不追求商品數量。',
      '增加「為什麼適合台灣」與「懂陸姐怎麼篩選」的說明。',
      '以真實商品、產地、供應商與使用情境圖片取代抽象裝飾圖。',
    ],
    questions: [
      { id: 'hero-headline', prompt: '首頁主標希望偏向哪些表達？', options: ['發現值得進入台灣的大陸好物與供應鏈', '台灣人看大陸商品與供應鏈的窗口', '懂台灣市場的兩岸選品平台', '希望另外提案', undecided] },
      { id: 'hero-actions', prompt: '首頁首屏要放哪些主要按鈕？', options: ['看精選好物', '找供應鏈／批發合作', '商品進入台灣市場', '直接加入 LINE', '觀看品牌介紹', undecided] },
      { id: 'homepage-proof', prompt: '首頁可以公開哪些信任材料？', options: ['業主經歷', '供應商訪談', '商品測試過程', '台灣店家案例', '成交或詢價數據', '合作品牌標誌', '目前沒有可公開材料'] },
      { id: 'featured-count', prompt: '首頁第一批精選內容預計放多少？', options: ['3 件以內', '4 至 6 件', '7 至 12 件', '依現有資料決定', undecided] },
    ],
  },
  {
    id: 'products',
    eyebrow: '04 · 商品與供應鏈',
    title: '商品與供應鏈展示方式',
    summary: '第一階段的商品頁應說明推薦理由、適合通路與合作方式，不再預設每件商品都有價格、庫存與購物車。',
    recommendations: [
      '內容可分為精選商品、通路選品、供應鏈專案三種類型。',
      '每件內容個別設定「外部購買、LINE 詢問、索取批發資料、申請樣品」等行動。',
      '商品頁補上產地、MOQ、適合店型、法規狀態、物流方式、售後責任方與更新日期。',
      '後台的 SKU、價格與規格改為選填，新增合作方式、供應商及審核狀態。',
    ],
    questions: [
      { id: 'first-categories', prompt: '第一批希望聚焦哪些商品類別？', options: ['生活用品', '五金工具', '居家收納', '食品飲料', '美妝保養', '服飾配件', '3C／電器', '文創禮品', '其他品類', undecided] },
      { id: 'excluded-categories', prompt: '哪些高風險品類明確不碰？', options: ['食品', '化妝品', '醫療器材', '電器', '兒童用品', '高價商品', '仿冒或授權不明商品', '尚未決定'] },
      { id: 'listing-types', prompt: '網站要上架哪些內容類型？', options: ['一般消費商品', '店家批發選品', '工廠／產業帶', 'OEM／ODM 專案', '品牌代理機會', '台灣市場測試商品'] },
      { id: 'product-cta', prompt: '商品頁可使用哪些合作方式？', options: ['前往合作商家購買', 'LINE 詢問', '索取批發資料', '申請樣品', '預約合作洽談', '加入等待名單'] },
      { id: 'public-commercial-info', prompt: '哪些商業資料可以公開？', options: ['零售參考價', '批發價格區間', 'MOQ／起訂量', '交期', '供應商名稱', '產地與工廠', '詢問後才提供', undecided] },
      { id: 'same-product-audiences', prompt: '同一商品是否同時面向消費者與通路？', options: ['可以，同頁呈現兩種資訊', '分成消費版與通路版', '只選定一種主要客群', undecided] },
      { id: 'external-destination', prompt: '外部購買主要會導向哪裡？', options: ['台灣合作店家', '供應商網站', '第三方電商平台', 'LINE 洽詢', '依商品個別設定', undecided] },
      { id: 'market-test', prompt: '尚未正式進口台灣的商品是否可以展示？', options: ['可以，清楚標示市場測試中', '只供登入後的通路查看', '不可以，完成法規確認後才展示', undecided] },
      { id: 'refresh-cycle', prompt: '商品資料多久重新確認一次？', options: ['每月', '每季', '每半年', '供應商有異動時', '依品類風險決定', undecided] },
    ],
  },
  {
    id: 'retailers',
    eyebrow: '05 · 台灣店家與通路',
    title: '台灣店家與通路合作資訊',
    summary: 'B2B 訪客在意的是毛利、起訂量、交期、包裝與責任分工，網站需要提供足夠資料支援初步判斷。',
    recommendations: [
      '建立店家專用入口與供應鏈資料卡。',
      '提供「我在找商品」反向需求表單，收集店型、預算、品類與採購量。',
      '將店家詢價與一般消費者詢問分流，方便後續追蹤媒合成果。',
      '有實際成果後，以導入流程與數據製作案例內容。',
    ],
    questions: [
      { id: 'retailer-types', prompt: '最想吸引哪些台灣合作通路？', options: ['菜市場攤商', '夜市攤商', '五金百貨', '生活用品店', '團購主', '電商賣家', '連鎖零售', '批發商', undecided] },
      { id: 'retailer-data', prompt: '店家最需要先看到哪些資料？', options: ['批發價格', '建議售價與毛利', 'MOQ', '交期', '包裝規格', '物流方式', '台灣法規狀態', '樣品申請方式'] },
      { id: 'lead-routing', prompt: '店家送出詢價後，由誰接續處理？', options: ['懂陸姐統一接洽', '直接轉給供應商', '雙方共同接洽', '依合作方案決定', undecided] },
      { id: 'reverse-request', prompt: '是否需要「我在找商品」需求表單？', options: ['需要，公開使用', '需要，只提供合作店家', '第一階段暫時不做', undecided] },
      { id: 'retailer-services', prompt: '未來可提供哪些店家服務？', options: ['協助選品', '申請樣品', '小量試銷', '台灣市場測試', '通路媒合', '進口與法規顧問', undecided] },
    ],
  },
  {
    id: 'suppliers',
    eyebrow: '06 · 大陸供應商',
    title: '大陸供應商合作條件',
    summary: '供應商需要知道誰能申請、要準備什麼、平台如何審核，以及合作內容是否收費。',
    recommendations: [
      '新增獨立的供應商合作提案頁與申請表。',
      '上架前確認公司、品牌、檢驗、產能、授權及出口經驗等資料。',
      '合作條款保留拒絕刊登、要求修正及下架的權利。',
      '簡體中文可放在供應商專用頁，不必讓整個台灣前台雙語化。',
    ],
    questions: [
      { id: 'supplier-eligibility', prompt: '哪些供應商可以申請？', options: ['只限現有學員', '學員優先，其他供應商也可申請', '所有供應商皆可申請', '採邀請制', undecided] },
      { id: 'supplier-documents', prompt: '供應商需要提交哪些資料？', options: ['公司營業資料', '商標或品牌授權', '產品檢驗資料', '產能與交期', '報價與 MOQ', '出口經驗', '商品圖片與影片', '台灣合作規劃'] },
      { id: 'supplier-disclosure', prompt: '前台是否公開供應商或工廠名稱？', options: ['全部公開', '經同意後公開', '只公開品牌、不公開工廠', '詢價後才提供', undecided] },
      { id: 'content-owner', prompt: '商品圖片與文案由誰準備？', options: ['供應商提供原始資料', '懂陸姐重新採訪與撰寫', '雙方共同完成', '提供付費內容製作服務', undecided] },
      { id: 'taiwan-services', prompt: '可向供應商提供哪些台灣市場服務？', options: ['台灣化文案', '價格建議', '包裝與標示建議', '市場測試', '通路媒合', '內容曝光', '品牌在台營運顧問'] },
      { id: 'supplier-language', prompt: '供應商合作頁使用哪些語言？', options: ['繁體中文', '簡體中文', '繁簡切換', '第一階段先用簡體中文', undecided] },
      { id: 'supplier-pricing', prompt: '供應商合作收費如何呈現？', options: ['公開方案與價格', '公開服務內容，價格洽談', '全部預約洽談', '第一階段免費測試', undecided] },
    ],
  },
  {
    id: 'content-seo',
    eyebrow: '07 · 內容與 SEO',
    title: '內容規劃與 SEO 延續',
    summary: '舊文章與網址仍可能帶來搜尋價值，需要先盤點，再依新定位更新、轉址或下架。',
    recommendations: [
      '文章分類改為大陸好物觀察、產業帶與工廠、台灣通路趨勢、兩岸消費差異、商品法規與物流。',
      '保留有流量的舊文章網址，更新文案與行動按鈕。',
      '停止承作的高風險服務頁要清楚標示，避免繼續收到錯誤詢問。',
      '只有內容高度相近時才做 301，不把所有舊頁面一律轉到首頁。',
    ],
    questions: [
      { id: 'content-topics', prompt: '未來會穩定產出哪些內容？', options: ['商品開箱與評測', '產業帶介紹', '供應商訪談', '台灣通路觀察', '兩岸消費差異', '進口法規與物流', '市場案例'] },
      { id: 'content-capacity', prompt: '每月大約能穩定產出多少內容？', options: ['1 至 2 篇', '3 至 4 篇', '5 至 8 篇', '8 篇以上', '以影片為主、文章較少', undecided] },
      { id: 'legacy-content-action', prompt: '停止承作的舊服務內容準備如何處理？', options: ['保留文章並標示停止服務', '改寫成風險與知識內容', '有替代內容的頁面做轉址', '完全無價值的頁面下架', '希望先做 SEO 數據盤點'] },
      { id: 'content-media', prompt: '內容會使用哪些媒體形式？', options: ['長篇文章', '短影音', 'YouTube', '圖文懶人包', '電子報', '供應商直播或訪談', undecided] },
    ],
  },
  {
    id: 'brand-copy',
    eyebrow: '08 · 品牌與文案',
    title: '品牌形象與文案風格',
    summary: '懂陸姐具有鮮明人物辨識度，新網站可以保留親近感，同時補足台灣市場判斷與供應鏈專業。',
    recommendations: [
      '關於頁改寫成業主如何篩選商品、理解台灣市場與連接兩岸合作。',
      '網站統一台灣繁中用語，供應商專頁再視需要提供簡中版本。',
      '清楚定義「精選、推薦、評測、合作」四種標示。',
      '視覺採市場情報誌加選品型錄風格，減少制式圓角卡片與裝飾性漸層。',
    ],
    questions: [
      { id: 'good-products-term', prompt: '「大陸好物」是否適合作為長期主要用語？', options: ['適合，容易理解', '適合消費者頁，不適合 B2B 頁', '改用「大陸選品」', '改用「商品與供應鏈」', '希望另提名稱', undecided] },
      { id: 'brand-balance', prompt: '品牌呈現希望偏向哪一側？', options: ['懂陸姐個人選品', 'ChinaLink 專業平台', '個人品牌與平台並重', '依頁面受眾調整', undecided] },
      { id: 'founder-visibility', prompt: '業主本人要在網站出現到什麼程度？', options: ['首頁主要人物', '關於頁與專欄出現', '影片內容為主', '只保留品牌名稱，不強調本人', undecided] },
      { id: 'brand-evidence', prompt: '可用哪些材料說明業主的判斷能力？', options: ['兩岸生活與工作經歷', '輔導大陸老闆的經驗', '台灣市場研究', '實際選品或試銷紀錄', '合作店家案例', '供應商與學員見證', '需要整理後再決定'] },
      { id: 'main-memory', prompt: '最希望訪客離開首頁後記住什麼？', options: ['這裡能發現新商品', '這裡能找到可靠供應鏈', '懂陸姐會替台灣市場篩選', '大陸品牌可在這裡進入台灣', '希望另寫一句話', undecided] },
      { id: 'platform-statement', prompt: '是否願意明確寫出「第一階段不提供統一結帳與售後」？', options: ['願意，首頁就說明', '願意，放在商品與合作說明', '只放在服務條款', '不希望特別強調', undecided] },
      { id: 'china-wording', prompt: '網站如何稱呼中國大陸？', options: ['統一使用「大陸」', '統一使用「中國大陸」', '依內容與受眾調整', undecided] },
    ],
  },
  {
    id: 'trust-legal',
    eyebrow: '09 · 信任與責任',
    title: '商品責任與合作邊界',
    summary: '展示、導購、媒合與直接銷售的責任不同，網站需要讓訪客在採取行動前看懂交易與售後對象。',
    recommendations: [
      '每件商品標示懂陸姐直接銷售、合作商家銷售、展示導流或供應鏈媒合。',
      '補上廣告合作揭露、詢價資料轉交同意、售後責任及商品資訊免責說明。',
      '「精選」需說明審核範圍，避免被理解為對安全、合法與品質的全面保證。',
      '法規敏感品類在刊登前建立額外審查與文件要求。',
    ],
    questions: [
      { id: 'sales-responsibility', prompt: '網站可能出現哪些交易責任型態？', options: ['懂陸姐直接銷售', '台灣合作商家銷售', '大陸供應商銷售', '網站只展示與導流', '網站只提供媒合'] },
      { id: 'compliance-owner', prompt: '誰負責確認台灣法規、標示與進口資格？', options: ['懂陸姐', '供應商', '台灣合作商家／進口商', '外部專業顧問', '依商品另行約定', undecided] },
      { id: 'after-sales-owner', prompt: '樣品、退貨、售後及消費爭議由誰處理？', options: ['懂陸姐', '實際銷售商家', '供應商', '依商品頁個別標示', undecided] },
      { id: 'paid-listing', prompt: '是否接受供應商付費刊登？', options: ['接受並清楚揭露', '只收顧問或內容製作費', '初期不接受付費刊登', '個案決定', undecided] },
      { id: 'business-models', prompt: '未來可能發展哪些合作型態？', options: ['獨家代理', '區域代理', '團購合作', '通路經銷', '導購分潤', '單純媒合', undecided] },
    ],
  },
  {
    id: 'operations',
    eyebrow: '10 · 營運與成效',
    title: '營運流程與成效評估',
    summary: '第一階段應先追蹤內容與媒合成效，等成交模式穩定後，再決定哪些品類值得加入金流、庫存與訂單功能。',
    recommendations: [
      '追蹤商品瀏覽、外部連結、LINE 詢問、批發詢價、樣品與成交。',
      '不同客群進入不同表單或聯絡標籤，避免所有詢問混在一起。',
      'AI 客服只回答公開且已確認的內容，不自行提供法規判斷或未公開價格。',
      '用三至六個月的流量與成交資料評估第二階段商城。',
    ],
    questions: [
      { id: 'contact-segmentation', prompt: '不同客群是否需要分流？', options: ['使用不同表單', '使用不同 LINE 標籤', '由客服收到後人工分類', '第一階段先共用單一入口', undecided] },
      { id: 'response-owner', prompt: '誰負責回覆網站詢問？', options: ['業主本人', '台灣端客服', '大陸端團隊', '依客群分配', '尚未有人負責'] },
      { id: 'response-time', prompt: '對外承諾的回覆時間？', options: ['當日', '一個工作天內', '兩個工作天內', '不公開承諾時間', undecided] },
      { id: 'tracking-events', prompt: '第一階段要追蹤哪些結果？', options: ['商品瀏覽', '文章閱讀', '外部購買點擊', 'LINE／微信點擊', '批發詢價', '樣品申請', '供應商投稿', '實際成交'] },
      { id: 'lead-records', prompt: '是否需要保存與管理媒合紀錄？', options: ['保存所有詢問與處理狀態', '只保存 B2B 詢價', '先用試算表管理', '只寄信通知，不建立後台', undecided] },
      { id: 'ai-scope', prompt: 'AI 客服可以回答哪些內容？', options: ['公開商品資料', '公開合作流程', '一般文章內容', '公開價格', '供應商聯絡資料', '法規與進口問題', '只引導真人客服', undecided] },
      { id: 'store-trigger', prompt: '什麼情況下值得進入完整商城階段？', options: ['固定品類已有穩定流量', '每月詢價達到目標', '已有穩定台灣供貨與售後', '自營商品開始增加', '合作商家願意共同履約', '三至六個月後再評估', undecided] },
    ],
  },
]

export const proposalQuestionCount = proposalSections.reduce(
  (total, section) => total + section.questions.length,
  0,
)
