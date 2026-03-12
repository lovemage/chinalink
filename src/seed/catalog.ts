export interface SeedServiceCategory {
  name: string
  slug: string
}

export interface SeedService {
  title: string
  slug: string
  categorySlug: string
  pricingMode: 'fixed' | 'addons' | 'custom'
  price?: number
  basePrice?: number
  addons?: Array<{ name: string; price: number; required?: boolean }>
  features: string[]
  seoDescription: string
}

export interface SeedProductCategory {
  name: string
  slug: string
}

export interface SeedProductTag {
  name: string
  slug: string
}

export interface SeedProductVariant {
  sku: string
  name: string
  specs: Array<{ key: string; value: string }>
  price: number
  compareAtPrice?: number
  stock: number
  isDefault?: boolean
  isActive?: boolean
}

export interface SeedProduct {
  title: string
  slug: string
  categorySlug: string
  tagSlugs: string[]
  summary: string
  features: string[]
  seoDescription: string
  variants: SeedProductVariant[]
}

export const serviceCategories: SeedServiceCategory[] = [
  { name: '帳號與身份', slug: 'account-identity' },
  { name: '採購與驗貨', slug: 'procurement-inspection' },
  { name: '公司設立', slug: 'company-setup' },
  { name: '內容與成長', slug: 'content-growth' },
]

export const serviceSeedSources: SeedService[] = [
  {
    title: '大陸平台帳號代辦',
    slug: 'account-agent',
    categorySlug: 'account-identity',
    pricingMode: 'fixed',
    price: 3200,
    features: ['協助釐清平台註冊限制與身份要求', '代辦流程整理與材料清單', '降低支付與驗證卡關風險'],
    seoDescription: '協助台灣用戶完成大陸常用平台帳號註冊與驗證流程。',
  },
  {
    title: '代購與廣州驗貨服務',
    slug: 'procurement',
    categorySlug: 'procurement-inspection',
    pricingMode: 'addons',
    basePrice: 2500,
    addons: [
      { name: '工廠對版確認', price: 1800 },
      { name: '出貨前拍照驗貨', price: 1200, required: true },
      { name: '直播連線驗貨', price: 1500 },
    ],
    features: ['支援淘寶、1688、拼多多等平台採購', '廣州端實拍驗貨與瑕疵回報', '降低跨境採買踩雷與溝通落差'],
    seoDescription: '提供大陸採購、驗貨、出貨前確認的一站式協助。',
  },
  {
    title: '大陸公司註冊顧問',
    slug: 'company-registration',
    categorySlug: 'company-setup',
    pricingMode: 'custom',
    features: ['依產業與地區盤點設立條件', '協助準備設立文件與申請節點', '串接銀行開戶與後續營運需求'],
    seoDescription: '針對台灣人赴陸經營提供公司設立與流程顧問支援。',
  },
  {
    title: '小紅書與新媒體營運顧問',
    slug: 'marketing',
    categorySlug: 'content-growth',
    pricingMode: 'fixed',
    price: 8800,
    features: ['帳號定位與內容策略梳理', '陪跑建立發文節奏', '降低限流與違規風險'],
    seoDescription: '聚焦小紅書與大陸內容平台的顧問與代營運服務。',
  },
]

export const productCategories: SeedProductCategory[] = [
  { name: '入門方案', slug: 'starter-kits' },
  { name: '成長方案', slug: 'growth-kits' },
]

export const productTags: SeedProductTag[] = [
  { name: '台灣人適用', slug: 'taiwan-friendly' },
  { name: '可直接下單', slug: 'direct-checkout' },
  { name: '代購驗貨', slug: 'procurement' },
  { name: '帳號代辦', slug: 'account-setup' },
  { name: '公司註冊', slug: 'company-registration' },
  { name: '內容營運', slug: 'content-ops' },
]

export const productSeedSources: SeedProduct[] = [
  {
    title: '跨境採購啟動包',
    slug: 'cross-border-procurement-kit',
    categorySlug: 'starter-kits',
    tagSlugs: ['taiwan-friendly', 'direct-checkout', 'procurement'],
    summary: '適合第一次做大陸代購、驗貨與出貨安排的客戶，先用標準化方案把採購流程跑順。',
    features: ['標準驗貨流程', '採購清單核對', '出貨前照片回報'],
    seoDescription: '適合跨境採購新手的代購驗貨商品化方案。',
    variants: [
      {
        sku: 'CLK-PROC-STD',
        name: '標準版',
        specs: [
          { key: '服務層級', value: '標準驗貨' },
          { key: '件數', value: '1-10 件' },
        ],
        price: 4800,
        compareAtPrice: 5600,
        stock: 50,
        isDefault: true,
        isActive: true,
      },
      {
        sku: 'CLK-PROC-LIVE',
        name: '直播驗貨版',
        specs: [
          { key: '服務層級', value: '直播驗貨' },
          { key: '件數', value: '1-10 件' },
        ],
        price: 6800,
        compareAtPrice: 7600,
        stock: 30,
        isActive: true,
      },
    ],
  },
  {
    title: '大陸帳號開通快啟包',
    slug: 'account-launch-kit',
    categorySlug: 'starter-kits',
    tagSlugs: ['taiwan-friendly', 'direct-checkout', 'account-setup'],
    summary: '將註冊、實名與常見卡點整理成可下單方案，適合需要快速起步的使用者。',
    features: ['平台開通節點檢查', '材料清單與步驟指引', '一次整理常見風險'],
    seoDescription: '針對大陸平台帳號開通需求設計的標準商品方案。',
    variants: [
      {
        sku: 'CLK-ACC-BASIC',
        name: '基礎平台版',
        specs: [{ key: '平台數量', value: '1 個平台' }],
        price: 3200,
        stock: 80,
        isDefault: true,
        isActive: true,
      },
      {
        sku: 'CLK-ACC-PLUS',
        name: '雙平台版',
        specs: [{ key: '平台數量', value: '2 個平台' }],
        price: 5600,
        stock: 60,
        isActive: true,
      },
    ],
  },
  {
    title: '公司設立前評估包',
    slug: 'company-setup-assessment-kit',
    categorySlug: 'growth-kits',
    tagSlugs: ['taiwan-friendly', 'company-registration'],
    summary: '先釐清公司型態、區域選擇與證照門檻，再決定是否進入正式設立流程。',
    features: ['區域與產業評估', '文件缺口盤點', '設立時程試算'],
    seoDescription: '提供大陸公司設立前的顧問評估商品。',
    variants: [
      {
        sku: 'CLK-COMP-ASSESS',
        name: '顧問評估版',
        specs: [{ key: '會議形式', value: '線上 60 分鐘' }],
        price: 9800,
        stock: 20,
        isDefault: true,
        isActive: true,
      },
      {
        sku: 'CLK-COMP-ASSESS-PRO',
        name: '評估加文件清單版',
        specs: [
          { key: '會議形式', value: '線上 90 分鐘' },
          { key: '交付內容', value: '文件清單' },
        ],
        price: 12800,
        stock: 20,
        isActive: true,
      },
    ],
  },
  {
    title: '小紅書內容陪跑包',
    slug: 'xiaohongshu-growth-kit',
    categorySlug: 'growth-kits',
    tagSlugs: ['direct-checkout', 'content-ops'],
    summary: '把內容定位、選題與發文節奏包成可直接購買的陪跑服務。',
    features: ['帳號健檢', '四週題庫規劃', '內容方向修正建議'],
    seoDescription: '小紅書內容經營與陪跑的商品化方案。',
    variants: [
      {
        sku: 'CLK-XHS-4W',
        name: '4 週陪跑版',
        specs: [{ key: '服務週期', value: '4 週' }],
        price: 15800,
        stock: 15,
        isDefault: true,
        isActive: true,
      },
      {
        sku: 'CLK-XHS-8W',
        name: '8 週密集版',
        specs: [{ key: '服務週期', value: '8 週' }],
        price: 28800,
        stock: 10,
        isActive: true,
      },
    ],
  },
]
