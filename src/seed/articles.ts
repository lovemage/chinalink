export type ArticleSeedSource = {
  sourceFile: string
  category: {
    name: string
    slug: string
  }
  excerpt: string
  seo: {
    metaTitle: string
    metaDescription: string
  }
  faq: Array<{
    question: string
    answer: string
  }>
  cta: {
    heading: string
    description?: string
    buttonText: string
    buttonLink: string
  }
  notes?: string[]
}

export const articleSeedSources: ArticleSeedSource[] = [
  {
    sourceFile: 'docs/articles/台灣人使用小紅書必知規則｜避免帳號限流與封號.md',
    category: {
      name: '小紅書教學',
      slug: 'xiaohongshu-guides',
    },
    excerpt:
      '整理台灣使用者在小紅書最常忽略的基本規則，說明私訊交易、導流與違規操作為何會導致限流或封號，並提供更安全、更穩定的使用方式與避雷重點。',
    seo: {
      metaTitle: '台灣人使用小紅書必知規則｜避免限流與封號',
      metaDescription:
        '台灣使用者想安全使用小紅書，必須先理解平台對私訊交易、導流與違規行為的限制。本文整理常見風險與安全做法。',
    },
    faq: [
      {
        question: '台灣人只是瀏覽小紅書，也會被限流嗎？',
        answer: '即使只是日常使用，如果在私訊或留言中涉及交易、導流或其他違規訊息，仍可能被平台判定為異常行為。',
      },
      {
        question: '在小紅書私訊中詢問價格會有風險嗎？',
        answer: '有風險。平台對私訊交易、議價與外部導流相當敏感，相關內容容易觸發風控與曝光限制。',
      },
      {
        question: '比較安全的小紅書購買方式是什麼？',
        answer: '優先使用官方購物連結、商家頁面與平台內的正式交易方式，避免把交易移到私訊或外部通訊軟體。',
      },
    ],
    cta: {
      heading: '想安全經營小紅書帳號與內容？',
      description: '如果你需要更完整的平台規則與合規導流建議，可以直接聯繫懂陸姐。',
      buttonText: '聯繫懂陸姐',
      buttonLink: '/contact',
    },
    notes: ['coverImage 後續以 coverPrompt 生成後再補上 media'],
  },
  {
    sourceFile: 'docs/articles/台灣人如何在小紅書開店｜快速開始經營小紅書電商（2026指南）.md',
    category: {
      name: '小紅書電商',
      slug: 'xiaohongshu-ecommerce',
    },
    excerpt:
      '整理台灣商家進入小紅書電商前需要理解的條件、常見門檻、測試市場方法與跨境物流模式，幫助你先用低風險方式評估市場機會。',
    seo: {
      metaTitle: '台灣人如何在小紅書開店｜條件與物流指南',
      metaDescription:
        '想在小紅書開店的台灣商家，需先了解手機號碼、銀行帳戶、實名與物流模式等條件，再用低風險方式測試市場。',
    },
    faq: [
      {
        question: '台灣商家可以直接申請小紅書店鋪嗎？',
        answer: '理論上可以，但通常需要中國大陸手機號碼、銀行帳戶、實名認證與公司或營業資料，門檻相對高。',
      },
      {
        question: '還沒準備好完整公司架構，可以先做什麼？',
        answer: '可以先經營內容帳號、測試產品需求與市場反應，等需求明確後再投入完整電商系統。',
      },
      {
        question: '小紅書電商初期適合哪種物流策略？',
        answer: '初期常見做法是用台灣出貨或預售模式測試需求，等銷量穩定後再評估中國倉或跨境倉方案。',
      },
    ],
    cta: {
      heading: '想評估你的小紅書電商切入方式？',
      description: '可先從市場測試、內容策略與物流評估開始，避免一開始投入過高成本。',
      buttonText: '詢問開店規劃',
      buttonLink: '/contact',
    },
  },
  {
    sourceFile: 'docs/articles/台灣人無法購買或租用抖音實名帳號？替代平台指南：小紅書、B站、知乎與微信視頻號.md',
    category: {
      name: '抖音教學',
      slug: 'douyin-guides',
    },
    excerpt:
      '說明為什麼台灣使用者沒有合法方式購買或租用抖音實名帳號，並整理小紅書、B站、知乎與微信視頻號等可行的新媒體替代平台。',
    seo: {
      metaTitle: '台灣人能買抖音實名帳號嗎？替代平台整理',
      metaDescription:
        '台灣使用者沒有合法穩定方式購買或租用抖音實名帳號。本文解析風險來源，並整理可經營的小紅書、B站、知乎與視頻號。',
    },
    faq: [
      {
        question: '台灣人可以合法購買或租用抖音帳號嗎？',
        answer: '目前沒有合法且穩定的方式。抖音帳號涉及實名制度、裝置與 IP 風控，帳號交易本身風險很高。',
      },
      {
        question: '為什麼買來的抖音帳號很容易出問題？',
        answer: '平台會檢查設備、地理位置與登入環境，一旦異常就可能要求重新驗證，甚至因無法完成人臉或身份驗證而無法使用。',
      },
      {
        question: '如果不能經營抖音，台灣創作者還有哪些選擇？',
        answer: '可以依內容型態改做小紅書、B站、知乎或微信視頻號，透過多平台布局同樣能累積品牌影響力。',
      },
    ],
    cta: {
      heading: '想規劃中國新媒體平台布局？',
      description: '先選對平台，再談內容與流量策略，會比冒險買帳號更穩定。',
      buttonText: '諮詢平台策略',
      buttonLink: '/contact',
    },
  },
  {
    sourceFile: 'docs/articles/台灣人註冊抖音帳號完整指南（2026）：條件、流程與注意事項.md',
    category: {
      name: '抖音教學',
      slug: 'douyin-guides',
    },
    excerpt:
      '完整整理台灣人註冊抖音帳號所需的條件、手機號碼與實名認證流程，並說明帳號使用風險與內容發布前應注意的平台規範。',
    seo: {
      metaTitle: '台灣人註冊抖音帳號完整指南｜條件與流程',
      metaDescription:
        '想經營抖音的台灣創作者，需先理解中國手機號碼、台胞證實名認證與平台規範。本文整理註冊條件、流程與注意事項。',
    },
    faq: [
      {
        question: '台灣手機號碼可以直接註冊抖音嗎？',
        answer: '通常不行。抖音註冊多半需要中國大陸手機號碼，再搭配後續的實名驗證流程。',
      },
      {
        question: '台灣人做抖音實名認證常用什麼方式？',
        answer: '常見做法是使用台胞證資訊與人臉識別完成驗證，但實際可行性仍需依平台當下規則而定。',
      },
      {
        question: '註冊完成後最需要注意什麼？',
        answer: '抖音對內容規範、帳號行為與商業操作管理較嚴格，發布內容前應先確認是否踩到平台紅線。',
      },
    ],
    cta: {
      heading: '想評估抖音註冊與內容規劃？',
      description: '先把註冊條件、平台限制與內容測試策略釐清，再投入經營成本。',
      buttonText: '詢問抖音規劃',
      buttonLink: '/contact',
    },
    notes: ['本文開頭含 SEO 說明前言，parser 應以第一個主標題作為真正 title'],
  },
  {
    sourceFile: 'docs/articles/如何經營小紅書與抖音｜掌握平台差異快速提升流量.md',
    category: {
      name: '平台比較',
      slug: 'platform-strategy',
    },
    excerpt:
      '比較小紅書與抖音在流量來源、內容形式與經營邏輯上的差異，幫助台灣創作者依目標選對平台並建立更有效的內容策略。',
    seo: {
      metaTitle: '如何經營小紅書與抖音｜平台差異完整解析',
      metaDescription:
        '小紅書重搜尋與內容沉澱，抖音重演算法與短影音節奏。本文整理兩大平台差異與台灣創作者的經營方向。',
    },
    faq: [
      {
        question: '小紅書和抖音最大的差別是什麼？',
        answer: '小紅書偏向內容搜尋與口碑決策，抖音則更依賴短影音節奏與推薦演算法，兩者流量邏輯完全不同。',
      },
      {
        question: '品牌應該先做小紅書還是抖音？',
        answer: '取決於目標。若重視品牌認知與搜尋沉澱，可先做小紅書；若重視短影音觸及與爆量曝光，可優先研究抖音。',
      },
      {
        question: '可以同時經營兩個平台嗎？',
        answer: '可以，但內容不應直接複製。應先依平台受眾與流量邏輯拆分主題、形式與轉換目標。',
      },
    ],
    cta: {
      heading: '想規劃適合你的平台內容策略？',
      description: '先搞清楚平台定位，再安排內容與導流方式，能少走很多彎路。',
      buttonText: '取得平台建議',
      buttonLink: '/contact',
    },
  },
  {
    sourceFile: 'docs/articles/如何經營小紅書｜專業號與投流操作完整指南（2026）.md',
    category: {
      name: '小紅書教學',
      slug: 'xiaohongshu-guides',
    },
    excerpt:
      '從平台導流限制、專業號制度到投流邏輯，整理台灣創作者與品牌經營小紅書時最需要理解的合規與流量操作重點。',
    seo: {
      metaTitle: '如何經營小紅書｜專業號與投流完整指南',
      metaDescription:
        '想長期經營小紅書，必須先理解導流限制、專業號功能與投流角色。本文整理合規經營與流量提升的基本策略。',
    },
    faq: [
      {
        question: '為什麼小紅書導流限制特別嚴格？',
        answer: '平台希望交易與互動盡量留在站內，因此對私訊交易、外部聯絡方式與不當導流行為有較高敏感度。',
      },
      {
        question: '專業號對品牌經營有什麼幫助？',
        answer: '專業號通常能解鎖更完整的品牌功能、數據能力與商業工具，是品牌或商家進一步經營的重要基礎。',
      },
      {
        question: '投流適合每個帳號都做嗎？',
        answer: '不一定。投流應建立在內容定位、帳號狀態與轉換目標清楚之後，否則容易放大低品質內容的問題。',
      },
    ],
    cta: {
      heading: '想評估小紅書專業號與投流配置？',
      description: '先釐清帳號定位、合規導流方式與預算分配，再決定是否進一步投流。',
      buttonText: '詢問小紅書策略',
      buttonLink: '/contact',
    },
  },
  {
    sourceFile: 'docs/articles/小紅書帳號種類與台灣使用者經營指南｜專業號與投流操作.md',
    category: {
      name: '小紅書教學',
      slug: 'xiaohongshu-guides',
    },
    excerpt:
      '整理小紅書普通帳號、個人號與專業號的差異，並說明各帳號限制、合規導流方式與台灣使用者的實際經營策略。',
    seo: {
      metaTitle: '小紅書帳號種類與台灣使用者經營指南',
      metaDescription:
        '想了解小紅書普通帳號、個人號與專業號差異？本文整理帳號功能、限制、合規導流方式與台灣使用者的經營建議。',
    },
    faq: [
      {
        question: '小紅書有哪些主要帳號類型？',
        answer: '常見可分為普通帳號、個人號與專業號，不同類型在功能、身份認證與商業操作彈性上都有差異。',
      },
      {
        question: '台灣使用者最需要注意哪類限制？',
        answer: '除了帳號功能差異外，更需要理解平台對導流與交易訊息的限制，避免因誤操作導致內容曝光受影響。',
      },
      {
        question: '什麼情況適合升級為專業號？',
        answer: '當你的經營目標已從單純分享轉向品牌建設、數據分析或商業轉換時，通常就該評估升級專業號。',
      },
    ],
    cta: {
      heading: '想釐清你適合哪一種小紅書帳號？',
      description: '不同帳號適合不同經營階段，先選對定位再規劃內容與轉換。',
      buttonText: '取得帳號建議',
      buttonLink: '/contact',
    },
  },
  {
    sourceFile: 'docs/articles/小紅書經營教學｜帳號升級與投流策略讓流量轉化更穩定（2026完整指南）.md',
    category: {
      name: '小紅書教學',
      slug: 'xiaohongshu-guides',
    },
    excerpt:
      '說明小紅書導流限制、帳號升級制度與投流策略之間的關係，幫助台灣品牌與創作者建立更穩定的流量與轉化基礎。',
    seo: {
      metaTitle: '小紅書經營教學｜帳號升級與投流策略',
      metaDescription:
        '想讓小紅書流量與轉化更穩定，必須先理解導流限制、帳號升級制度與投流策略的配合方式。本文整理關鍵做法。',
    },
    faq: [
      {
        question: '為什麼有流量卻不容易轉化？',
        answer: '常見原因是帳號仍停留在基礎經營階段，導流限制又讓私訊與留言轉換受阻，需要更完整的帳號與投流策略。',
      },
      {
        question: '帳號升級和投流有什麼關聯？',
        answer: '帳號升級能提供更完整的品牌與數據能力，而投流則是在內容與定位穩定後放大觸及與轉換的工具。',
      },
      {
        question: '台灣創作者應該先做哪一步？',
        answer: '通常先把內容定位、合規導流方式與帳號基礎做好，再評估是否升級與配置投流預算。',
      },
    ],
    cta: {
      heading: '想建立更穩定的小紅書流量與轉化？',
      description: '把帳號升級、內容策略與投流節奏整合起來，會比單點操作更有效。',
      buttonText: '詢問經營規劃',
      buttonLink: '/contact',
    },
  },
]