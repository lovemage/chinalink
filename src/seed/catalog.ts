import type { ServiceIconName } from '@/lib/services/serviceIcons'

export interface SeedServiceCategory {
  name: string
  slug: string
}

export interface SeedService {
  title: string
  slug: string
  categorySlug: string
  iconName: ServiceIconName
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
  { name: '採購與物流', slug: 'procurement-logistics' },
  { name: '跨境電商', slug: 'cross-border-ecommerce' },
]

export const serviceSeedSources: SeedService[] = [
  {
    title: '代購、採購與跨境物流',
    slug: 'procurement-and-cross-border-logistics',
    categorySlug: 'procurement-logistics',
    iconName: 'inventory_2',
    pricingMode: 'custom',
    features: [
      '支援閒魚、微店、抖音商城等平台代購與採購需求',
      '提供代收代付與人民幣貨款代收服務',
      '提供大陸地址驗貨、倉管與集運回台流程',
      '支援虛擬商品（影音課程、素材包）雲端交付',
    ],
    seoDescription: '提供代購、採購、驗貨、倉管與跨境物流整合服務，協助台灣買家降低支付與運輸門檻。',
  },
  {
    title: '跨境電商平台專項服務',
    slug: 'cross-border-ecommerce-platform-services',
    categorySlug: 'cross-border-ecommerce',
    iconName: 'campaign',
    pricingMode: 'custom',
    features: [
      '提供淘寶、拼多多與全球平台（蝦皮、TikTok、樂天、亞馬遜）帳號租賃與維護資源',
      '支援台灣商品進入內地倉後再發往其他國家，優化跨境物流流程與成本',
      '協助 ERP 對接與跨境收款工具（如 PingPong、LianLian）申辦導入',
    ],
    seoDescription: '提供跨境電商平台帳號資源、物流優化與技術對接，協助賣家安全合規拓展全球市場。',
  },
]

export const productCategories: SeedProductCategory[] = [
  { name: '數位通行', slug: 'digital-access' },
  { name: '媒體運營', slug: 'media-operations' },
  { name: '金融商務', slug: 'financial-business' },
  { name: '企業落地', slug: 'enterprise-landing' },
]

export const productTags: SeedProductTag[] = [
  { name: '台灣人適用', slug: 'taiwan-friendly' },
  { name: '可直接下單', slug: 'direct-checkout' },
  { name: '簡訊認證', slug: 'sms-verification' },
  { name: '帳號開通', slug: 'account-activation' },
  { name: '多平台運營', slug: 'multi-platform-operations' },
  { name: '銀行開戶', slug: 'bank-account-opening' },
  { name: '公司設立', slug: 'company-establishment' },
]

export const productSeedSources: SeedProduct[] = [
  {
    title: '大陸數位通行證：App 註冊與簡訊代收',
    slug: 'mainland-digital-pass-app-registration-sms',
    categorySlug: 'digital-access',
    tagSlugs: ['taiwan-friendly', 'direct-checkout', 'sms-verification', 'account-activation'],
    summary:
      '2026 全實名時代下，協助完成大陸 App 註冊與簡訊驗證。涵蓋 AI 工具、影音軟體、智慧家電與高權限社群平台登入需求。',
    features: [
      '適用單次驗證：大眾點評、美團、百度網盤、一般 AI 工具與智慧家電登入',
      '高權限平台支援：微信、抖音、小紅書、支付寶、閒魚',
      '協助降低跨區驗證失敗與帳號風控風險',
    ],
    seoDescription: '提供大陸 App 註冊與簡訊代收服務，協助台灣用戶快速完成內地平台驗證與開通。',
    variants: [
      {
        sku: 'CLK-DIGI-PASS-BASIC',
        name: '基礎版',
        specs: [
          { key: '適用範圍', value: '單次驗證與一般平台' },
          { key: '服務內容', value: 'App 註冊 + 簡訊代收' },
        ],
        price: 380,
        stock: 500,
        isDefault: true,
        isActive: true,
      },
      {
        sku: 'CLK-DIGI-PASS-ADV',
        name: '進階版',
        specs: [
          { key: '適用範圍', value: '高權限平台' },
          { key: '服務內容', value: 'App 註冊 + 簡訊代收' },
        ],
        price: 520,
        stock: 500,
        isActive: true,
      },
    ],
  },
  {
    title: '全媒體矩陣運營：小紅書、抖音、視頻號、公眾號',
    slug: 'omni-media-matrix-operations',
    categorySlug: 'media-operations',
    tagSlugs: ['direct-checkout', 'multi-platform-operations'],
    summary:
      '針對大陸多平台閉環流量生態，提供代運營與高權限帳號資源，解決台灣商家常見限流、權限不足與流量轉換問題。',
    features: [
      '內地團隊代發與精準 SEO 佈局',
      '爆文模版、評論區控評與私域流量引導',
      '提供已完成實名之小紅書小店、抖音藍 V、視頻號、公眾號等帳號資源',
    ],
    seoDescription: '小紅書、抖音、視頻號、公眾號多平台代運營與高權限帳號資源服務。',
    variants: [
      {
        sku: 'CLK-MEDIA-OPS',
        name: '多平台代運營',
        specs: [{ key: '方案價格', value: 'NT$ 2,500 起' }],
        price: 2500,
        stock: 120,
        isDefault: true,
        isActive: true,
      },
      {
        sku: 'CLK-MEDIA-ACCOUNT-LEASE',
        name: '高權限帳號 / 店鋪租借',
        specs: [{ key: '方案價格', value: 'NT$ 3,500 起' }],
        price: 3500,
        stock: 80,
        isActive: true,
      },
    ],
  },
  {
    title: '廣州銀行開戶：金融解鎖與資金合規',
    slug: 'guangzhou-bank-account-opening',
    categorySlug: 'financial-business',
    tagSlugs: ['taiwan-friendly', 'direct-checkout', 'bank-account-opening'],
    summary:
      '協助台灣客戶串接廣州銀行開戶流程，降低無在地證明導致的拒絕風險，並同步規劃支付寶／微信支付綁定與薪資金流安排。',
    features: [
      '專人對接建行、工行等內部渠道',
      '協助處理薪資流向與大額支付綁定',
      '含行程規劃引導（不含機酒）',
    ],
    seoDescription: '提供廣州銀行開戶與資金合規規劃服務，協助台灣客戶完成大陸金融落地。',
    variants: [
      {
        sku: 'CLK-BANK-GZ-START',
        name: '廣州銀行開戶方案',
        specs: [{ key: '方案價格', value: 'NT$ 12,000 起' }],
        price: 12000,
        stock: 30,
        isDefault: true,
        isActive: true,
      },
    ],
  },
  {
    title: '內地公司設立：一站式商務落地',
    slug: 'mainland-company-establishment',
    categorySlug: 'enterprise-landing',
    tagSlugs: ['taiwan-friendly', 'direct-checkout', 'company-establishment'],
    summary:
      '提供只需入境一趟的公司設立整合流程，涵蓋選址、工商登記、稅務報到、公章刻製與代理記帳，降低遠端人臉識別兼容性風險。',
    features: [
      '全流程代辦：合法掛靠地址、工商登記、稅務報到、公章刻製、代理記帳',
      '完整串接工商局至稅務局流程，確保營運合規',
      '依行業與地區提供客製報價與時程建議',
    ],
    seoDescription: '提供內地公司設立一站式代辦服務，協助台灣企業快速合規落地。',
    variants: [
      {
        sku: 'CLK-COMPANY-SETUP-START',
        name: '公司設立方案',
        specs: [{ key: '方案價格', value: 'NT$ 48,000 起' }],
        price: 48000,
        stock: 20,
        isDefault: true,
        isActive: true,
      },
    ],
  },
]
