export const sihuiJadeCase = {
  href: '/supply-chain/sihui-jade',
  title: '廣東四會翡翠供應鏈',
  location: '廣東・肇慶・四會',
  description:
    '透過長期在四會經營的香港朋友，認識從看料、加工到實體經營一路累積經驗的英姐與芬姐。從在地人的經歷，了解翡翠貨源背後的合作關係。',
  cover: '/images/supply-chain/sihui-fen.webp',
  coverAlt: '芬姐在翡翠展示空間介紹作品',
} as const

export interface PartnerCase {
  name: string
  englishName: string
  industry: string
  url: string
  displayUrl: string
  summary: string
  highlights: string[]
  /** Articles appear here only once they are published. */
  articleSlugs: string[]
}

export const partnerCases: PartnerCase[] = [
  {
    name: '源光珠寶',
    englishName: 'ORIGIN GLOW',
    industry: '培育鑽石與翡翠',
    url: 'https://originselect.net/',
    displayUrl: 'originselect.net',
    summary: '懂陸姐主理的日常珠寶品牌，專注實驗室培育鑽石與翡翠兩個系列。',
    highlights: [
      '商品資料區分已核實、供應商提供與待確認',
      '以 SKU 對應照片、影片、報告與實物',
      '附珠寶知識文章，談材質、鑑定與供應鏈',
    ],
    articleSlugs: ['pei-yu-zuan-he-nan-dao-tai-wan', 'pei-yu-zuan-die-jia-gui-ge', 'fei-cui-si-di-fen-gong'],
  },
  {
    name: '山霧日常',
    englishName: 'MISTDAY TEA',
    industry: '台灣茶',
    url: 'https://tea.originselect.net/',
    displayUrl: 'tea.originselect.net',
    summary: '目前合作的台灣茶品牌，提供七款 100 克台灣茶，涵蓋阿里山、杉林溪、梨山與大禹嶺等茶區。',
    highlights: [
      '公開部分茶品的農藥殘留檢驗證書資訊',
      '註明檢驗只對應所列樣品與日期',
      '分開說明產區、品種與海拔範圍',
    ],
    articleSlugs: ['tai-wan-cha-su-yuan-ma', 'cha-ye-jian-yan-bao-gao', 'tai-wan-cha-wai-xiao-nong-yao-biao-zhun'],
  },
  {
    name: 'STILLSTONE',
    englishName: '天然水晶',
    industry: '水晶與礦石',
    url: 'https://crystal.originselect.net/',
    displayUrl: 'crystal.originselect.net',
    summary: '懂陸姐主理的水晶選品網站，販售天然石手鍊、水晶擺飾與原石礦物。',
    highlights: [
      '分為手鍊、擺飾與原石礦物三類',
      '水晶筆記記錄礦石知識與產業帶見聞',
      '從中國水晶產業帶選品',
    ],
    articleSlugs: ['dong-hai-shui-jing-gong-ying-lian', 'shui-jing-zhi-bo-jia-ge', 'shui-jing-tian-ran-chu-li-he-cheng'],
  },
]
