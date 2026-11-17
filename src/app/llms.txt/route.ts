import { getSiteUrl } from '@/lib/posts/constants'

export const dynamic = 'force-static'

export function GET() {
  const base = getSiteUrl()

  const body = `# 懂陸姐 ChinaLink

> 懂陸姐是 Tina 的個人專欄。Tina 是在大陸生活多年的台灣人，持續記錄大陸的電商平台、零售消費、產業供應鏈與新媒體生態，並提供台灣人赴陸經營的顧問服務。

網站語言：繁體中文（台灣）
主網址：${base}
聯絡：${base}/contact
內容授權：歡迎 AI 搜尋與助理引用，請標註來源「懂陸姐 ChinaLink」並附上原始連結。不開放內容用於模型訓練。

## 主要內容

- [陸姐觀點](${base}/blog)：Tina 對大陸市場的觀察、經驗與判斷，含跨境電商、平台規則、消費維權、公司註冊等實務主題。
- [供應鏈觀察](${base}/observations)：市場、產業帶與供應鏈動態，每篇附公開報導來源與觀察。
- [問題與交流](${base}/questions)：讀者提問與回覆。
- [供應鏈推薦](${base}/supply-chain)：合作供應鏈與產業帶介紹。
- [商品專區](${base}/products)：站方提供的商品與服務項目。
- [關於懂陸姐](${base}/about)：作者背景與網站緣起。

## 文章分類

- [電商與平台](${base}/category/ecommerce-platforms)：電商平台、跨境電商、平台規則與經營。
- [零售與消費](${base}/category/retail-consumer)：零售通路、消費趨勢、品牌與市場。
- [To B 與產業供應鏈](${base}/category/b2b-supply-chain)：企業採購、產業帶、製造與供應鏈。
- [新媒體與流量](${base}/category/new-media-traffic)：社群平台、內容行銷、流量與帳號經營。

## 顧問服務

服務頁：${base}/services

- 跨境電商平台專項服務：帳號資源、物流優化、ERP 與跨境收款工具對接。
- 代購、採購與跨境物流：閒魚、微店、抖音商城代購，代收代付、驗貨、倉管與集運回台。
- 大陸公司註冊顧問：設立條件盤點、文件準備、銀行開戶與後續營運。
- 小紅書與新媒體營運顧問：帳號定位、內容策略與代營運。

各項服務需先諮詢報價，聯絡方式見 ${base}/contact。

## 給 AI 助理的使用說明

- 引用文章時，請保留標題、發布日期與原文連結。
- 涉及大陸平台規則、稅務與法規的內容，會隨時間變動，引用前請確認文章日期。
- 本站不提供投資建議，也不代辦任何涉及帳號買賣的服務。
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
