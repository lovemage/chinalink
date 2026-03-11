# 懂陸姐 — chinalink.com.tw 網站設計文件

> 知識型網站 + 顧問服務 + 線上收款

---

## 一、專案概要

| 項目 | 內容 |
|------|------|
| 網站名稱 | 懂陸姐 |
| 網域 | chinalink.com.tw |
| 定位 | 台灣人在大陸生活經商的知識型網站 + 顧問服務平台 |
| 框架 | Next.js 16 + Payload CMS v3（內嵌模式） |
| 資料庫 | PostgreSQL（Railway 內建） |
| 部署 | Railway（單一 service + DB） |
| 金流 | ECPay（信用卡 + ATM 轉帳 + 超商代碼） |
| 登入 | LINE Login + Google OAuth（via NextAuth.js） |
| Email | Resend + React Email |

---

## 二、技術架構

```
┌─────────────────────────────────────────────┐
│                  Railway                     │
│                                              │
│  ┌──────────────────────────────────┐        │
│  │  Next.js 16 + Payload CMS (單一)  │        │
│  │                                   │        │
│  │  ┌───────────┐  ┌──────────────┐ │        │
│  │  │ 前台頁面   │  │ /admin 後台   │ │        │
│  │  │ SSR/SSG   │  │ Payload UI   │ │        │
│  │  └─────┬─────┘  └──────┬───────┘ │        │
│  │        │                │         │        │
│  │  ┌─────┴────────────────┴───────┐ │        │
│  │  │      Payload Local API       │ │        │
│  │  └──────────────┬───────────────┘ │        │
│  └─────────────────┼─────────────────┘        │
│                    │                          │
│  ┌─────────────────┴─────────────────┐        │
│  │         PostgreSQL (DB)            │        │
│  └────────────────────────────────────┘        │
└─────────────────────────────────────────────┘
         │          │          │          │
    ┌────┴───┐ ┌────┴───┐ ┌───┴────┐ ┌───┴───┐
    │ ECPay  │ │  LINE  │ │ Google │ │Resend │
    │ 金流   │ │ OAuth  │ │ OAuth  │ │ Email │
    └────────┘ └────────┘ └────────┘ └───────┘
```

### 技術選擇

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | 最新版本 |
| CMS | Payload v3 | 內嵌 Next.js，單一專案 |
| DB | PostgreSQL | Payload 推薦，Railway 一鍵建立 |
| ORM | Drizzle（Payload 內建） | Payload v3 預設 |
| 樣式 | Tailwind CSS + shadcn/ui | 快速開發，容易客製暖色系風格 |
| 登入 | NextAuth.js (Auth.js) | 統一處理 LINE + Google OAuth |
| 金流 | ECPay REST API | 信用卡 + ATM + 超商代碼 |
| Email | Resend + React Email | 模板化 Email 發送 |
| 圖片 | Payload Media + Railway Volume | 持久化儲存 |

---

## 三、網站頁面結構

```
chinalink.com.tw
│
├── /                        首頁
├── /services                服務項目列表
│   └── /services/[slug]     單一服務詳情 + 購買/諮詢
├── /blog                    文章列表（分類篩選）
│   └── /blog/[slug]         單篇文章
├── /about                   關於懂陸姐
├── /contact                 聯繫我們
│
├── /checkout/[orderId]      結帳頁（ECPay 付款）
├── /checkout/callback       ECPay 付款結果回調
├── /checkout/success        付款成功頁
│
└── /admin                   Payload CMS 後台
    ├── 文章管理
    ├── 服務/商品管理
    ├── 訂單管理
    ├── 會員管理
    ├── 諮詢需求管理
    └── Email 模板管理
```

---

## 四、資料模型（Payload Collections）

### users — 管理員

```
users（Payload 內建）
├── email
├── password
└── role: admin
```

### customers — 會員

```
customers
├── name                 姓名
├── email                Email（唯一）
├── phone                電話（選填）
├── avatar               大頭照
├── authProvider          line / google
├── providerId           第三方平台 ID
├── createdAt
└── lastLoginAt
```

### posts — Blog 文章

```
posts
├── title                標題
├── slug                 網址代稱（自動產生）
├── category             分類（relation → categories）
├── coverImage           封面圖（upload）
├── excerpt              文章摘要
├── author               作者名稱
├── status               draft / published
├── publishedAt          發佈日期
├── seo                  meta title + description
│
└── content: Blocks[]    模組化內容區塊
    ├── hero-section     引言區：大標題 + 副標題 + 背景圖
    ├── rich-text        段落（標題、粗體、列表、連結）
    ├── image            單張圖片 + 圖說 + 對齊
    ├── image-gallery    多張圖片輪播/網格
    ├── callout          提示框（info / warning / tip）
    ├── quote            引用區塊：引文 + 來源
    ├── step-guide       步驟教學：編號 + 說明 + 截圖
    ├── faq              常見問題：摺疊式 Q&A
    ├── cta              行動呼籲：標題 + 按鈕 + 連結
    ├── table            比較表格
    ├── embed            嵌入 YouTube / 外部內容
    └── divider          分隔線
```

### categories — 文章分類

```
categories
├── name                 分類名稱
└── slug
```

### services — 服務/商品

```
services
├── title                服務名稱
├── slug
├── serviceCategory      分類（relation → serviceCategories）
├── coverImage           封面圖
├── description          服務說明（Blocks 模組化，同 Blog）
├── status               draft / published
├── seo
├── features[]           服務特點列表
├── visibility           public / private / unlisted
│                         unlisted = 專屬連結才看得到
│
├── pricingMode          定價模式：fixed / addons / custom
│
│  ── fixed 模式 ──
├── price                固定價格
│
│  ── addons 模式 ──
├── basePrice            基礎價格
├── addons[]             加購選項
│   ├── name             選項名稱
│   ├── price            加購價格
│   └── required         是否必選
│
│  ── custom 模式 ──
└── isCustomQuote: true  前台顯示「聯繫報價」而非結帳按鈕
```

### serviceCategories — 服務分類

```
serviceCategories
├── name
└── slug
```

### orders — 訂單

```
orders
├── orderNumber          自動產生
├── customer             關聯會員（relation → customers）
├── service              關聯服務（relation → services）
├── selectedAddons[]     所選加購項目（addons 模式）
│   ├── name
│   └── price
├── amount               總金額（自動計算）
├── paymentMethod        credit_card / atm / cvs
├── paymentStatus        pending / paid / failed / expired
├── ecpayTradeNo         ECPay 交易編號
├── note                 Admin 備註
└── createdAt
```

### inquiries — 諮詢需求

```
inquiries
├── customer             關聯會員（relation → customers）
├── service              關聯服務（選填）
├── name                 姓名
├── contactMethod        聯繫方式（Line ID / 微信）
├── message              需求說明
├── attachments[]        附件（upload）
├── status               new / contacted / quoted / closed
└── createdAt
```

### emailTemplates — Email 模板

```
emailTemplates
├── name                 模板名稱（admin 辨識用）
├── slug                 代稱（程式呼叫用）
├── subject              信件主旨（支援 {{變數}}）
├── type                 system / marketing
├── status               draft / active
├── availableVariables[] 該模板可用變數表（顯示於編輯側欄）
│   ├── key              變數名（如 customerName）
│   └── description      說明（如「會員姓名」）
├── content: Blocks[]    模板內容（模組化區塊）
│   ├── heading          標題
│   ├── text             段落（支援 {{變數}}）
│   ├── button           CTA 按鈕（文字 + 連結）
│   ├── image            圖片
│   ├── order-summary    訂單摘要（自動帶入）
│   ├── divider          分隔線
│   └── footer           頁尾資訊
└── updatedAt
```

### media — 媒體檔案

```
media（Payload 內建）
├── file
├── alt
└── sizes（自動產生縮圖）
```

---

## 五、三種商品模式與購買流程

### 模式 A：固定價格

```
會員 → /services/[slug] → 點「立即購買」
     → POST /api/checkout（建立 order, status: pending）
     → 跳轉 ECPay 付款頁
     → ECPay 回調 → 更新 paymentStatus → 成功頁
```

### 模式 B：基礎價 + 加購

```
會員 → /services/[slug] → 勾選加購項目 → 自動計算總價
     → 點「立即購買」→ 結帳流程同上
```

### 模式 C：客製報價（Admin 開單）

```
方式一：會員主動諮詢
  會員 → /services/[slug]（custom 模式）→ 填需求表單 → 提交
  → Admin 後台看到 inquiries → 聯繫會員 → 確認需求

方式二：Admin 快速開單
  Admin → 新增 service → pricingMode: fixed → visibility: unlisted
  → 填入客戶專屬的品名、價格、說明
  → 儲存 → 取得專屬連結
  → 透過 Line/微信發給會員
  → 會員開連結 → 登入 → 付款
  → 系統自動寄送「專屬報價通知」Email
```

---

## 六、OAuth 登入

```
NextAuth.js 設定：
  Provider 1: LINE Login
  Provider 2: Google OAuth

登入流程：
  首次 → OAuth 授權 → 取得用戶資料 → 建立 customers 記錄
       → 發送「歡迎信」Email → 發 JWT → 登入完成
  再次 → OAuth 授權 → 比對 providerId → 更新 lastLoginAt
       → 發 JWT → 登入完成

購買限制：
  未登入 → 點「立即購買」→ 跳登入頁 → 登入後導回結帳
  已登入 → 直接進結帳（自動帶入姓名/Email）
```

---

## 七、ECPay 串接

```
建立訂單：
  POST /api/checkout
  → 建立 order（paymentStatus: pending）
  → 產生 ECPay 表單參數（MerchantTradeNo, 金額, 付款方式清單）
  → 前端自動 POST 到 ECPay 付款頁

付款結果：
  ECPay Server → POST /api/ecpay/notify（Server to Server）
  → 驗證 CheckMacValue
  → 更新 order.paymentStatus
  → 觸發「付款成功/失敗」Email
  → 回傳 1|OK

  ECPay → Redirect /checkout/success?orderId=xxx
  → 前端顯示付款結果

支援付款方式：
  - 信用卡（一次付清）
  - ATM 虛擬帳號
  - 超商代碼
```

---

## 八、Resend Email 系統

### 觸發時機

| 觸發事件 | 模板 slug | 說明 |
|---------|-----------|------|
| 會員註冊 | welcome | 歡迎加入懂陸姐 |
| 訂單建立 | order-created | 訂單確認 / 付款提醒 |
| 付款成功 | order-paid | 付款成功 + 電子收據 |
| 付款失敗/過期 | order-failed | 付款未完成提醒 |
| 諮詢提交 | inquiry-received | 已收到您的需求 |
| Admin 開專屬商品 | custom-quote | 專屬報價通知（含付款連結） |
| Admin 手動 | 選擇模板或自訂 | 手動發送 |

### 可用變數

```
通用變數：
  {{customerName}}     會員姓名
  {{customerEmail}}    會員 Email
  {{siteName}}         懂陸姐
  {{siteUrl}}          chinalink.com.tw

訂單變數：
  {{orderNumber}}      訂單編號
  {{serviceName}}      服務名稱
  {{amount}}           金額
  {{paymentMethod}}    付款方式
  {{checkoutUrl}}      結帳連結

諮詢變數：
  {{inquiryMessage}}   需求內容
```

### Admin 模板編輯

- 後台編輯模板時，側邊欄顯示該模板的可用變數表
- 點擊變數可直接插入到游標位置
- 支援即時預覽（填入測試資料預覽效果）
- system 模板可編輯內容但不可刪除
- marketing 模板可自由新增/刪除

### 技術實作

```
Payload Hook（afterChange）
  → 查詢 emailTemplates（by slug）
  → 替換 {{變數}} 為實際值
  → 組合 React Email 元件（統一外框 + Logo + 頁尾）
  → 呼叫 Resend API 發送
```

---

## 九、前台設計風格

### 配色

```
主色：    #F4845F（暖橘）
背景：    #FFF7ED（奶白）
CTA：     #E11D48（玫瑰紅）
文字：    #1C1917（深棕黑）
次要文字：#78716C（暖灰）
```

### 風格

- 圓角 12-16px
- 字體 Noto Sans TC
- 柔和陰影
- 親切溫暖，強調「姐」的親和力

### 首頁

```
Navbar → Hero → 痛點區 → 服務總覽 → 最新文章 → 信任區 → Footer
```

### 服務列表頁

```
分類 Tab 篩選 → 服務卡片網格（封面圖 + 名稱 + 簡述 + 價格）
```

### 服務詳情頁

```
封面圖 → 名稱 + 價格/加購選項/報價按鈕 → 服務說明 → 特點列表 → 相關服務
```

### Blog 列表頁

```
分類篩選 → 文章卡片（封面圖 + 標題 + 摘要 + 日期）
```

### Blog 文章頁

```
模組化 Blocks 渲染（引言 → 段落 → 圖片 → 步驟 → FAQ → CTA）
```

---

## 十、專案結構

```
chinalink/
├── src/
│   ├── app/                     Next.js App Router
│   │   ├── (frontend)/          前台頁面
│   │   │   ├── page.tsx         首頁
│   │   │   ├── services/
│   │   │   ├── blog/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── checkout/
│   │   ├── (auth)/              登入相關
│   │   │   └── login/
│   │   ├── api/
│   │   │   ├── auth/            NextAuth.js
│   │   │   ├── checkout/        建立訂單
│   │   │   └── ecpay/           ECPay 回調
│   │   └── (payload)/           Payload Admin UI
│   │       └── admin/
│   │
│   ├── payload/
│   │   ├── payload.config.ts    Payload 設定
│   │   └── collections/
│   │       ├── Users.ts
│   │       ├── Customers.ts
│   │       ├── Posts.ts
│   │       ├── Categories.ts
│   │       ├── Services.ts
│   │       ├── ServiceCategories.ts
│   │       ├── Orders.ts
│   │       ├── Inquiries.ts
│   │       ├── EmailTemplates.ts
│   │       └── Media.ts
│   │
│   ├── blocks/                  Payload Block 定義
│   │   ├── HeroSection.ts
│   │   ├── RichText.ts
│   │   ├── Image.ts
│   │   ├── ImageGallery.ts
│   │   ├── Callout.ts
│   │   ├── Quote.ts
│   │   ├── StepGuide.ts
│   │   ├── FAQ.ts
│   │   ├── CTA.ts
│   │   ├── Table.ts
│   │   ├── Embed.ts
│   │   └── Divider.ts
│   │
│   ├── components/              前台 UI 元件
│   │   ├── layout/
│   │   ├── blocks/              Block 前台渲染元件
│   │   ├── services/
│   │   └── ui/                  shadcn/ui
│   │
│   ├── lib/
│   │   ├── ecpay/               ECPay 串接
│   │   ├── resend/              Resend Email 發送
│   │   └── auth/                NextAuth 設定
│   │
│   └── emails/                  React Email 模板元件
│       ├── Layout.tsx           統一外框（Logo + 頁尾）
│       └── components/          Email Block 渲染元件
│
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── Dockerfile                   Railway 部署用
```

---

## 十一、外部服務申請清單

| 服務 | 用途 | 申請事項 |
|------|------|---------|
| ECPay | 金流 | 商店代號 + HashKey + HashIV |
| LINE Login | 會員登入 | LINE Developers Channel |
| Google OAuth | 會員登入 | Google Cloud Console Client ID |
| Resend | Email 發送 | API Key + 驗證寄件網域 |
| Railway | 部署 | 帳號 + PostgreSQL addon |
