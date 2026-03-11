# Seeds Articles Workflow

> 目的：將 `docs/articles/*.md` 的文章原稿，整理為符合專案 Blog 結構的 seed-ready article 規格，並確保每篇文章都附帶可直接用於生圖的 prompts。

---

## 1. Source of Truth

整理文章時，以下資料來源為唯一依據：

1. 原始文章內容：`docs/articles/*.md`
2. Blog collection 結構：`src/collections/Posts.ts`
3. Block 定義：`src/blocks/*.ts`

目前 `posts` collection 的核心欄位包含：

- `title`
- `slug`
- `category`
- `coverImage`
- `excerpt`
- `author`
- `status`
- `publishedAt`
- `content`（Payload blocks）
- `seo.metaTitle`
- `seo.metaDescription`

目前文章 workflow 的目標不是直接寫入 Payload，而是先把每篇文章整理成可交給 seed script 或人工匯入的標準格式。

---

## 2. Workflow Scope

這份 workflow 要解決兩件事：

1. 編輯流程標準化
將 Markdown 原稿整理成結構一致、SEO 完整、圖片 prompt 齊全的文章素材。

2. Seed article 規格化
將整理後的文章輸出為固定欄位格式，方便後續轉成 `posts` collection 的 seed data。

這份文件不負責：

- 實作 seed script
- 自動上傳圖片到 `media`
- 自動匯入 Payload

這份文件負責：

- 定義每篇文章最終必備欄位
- 定義 Markdown 到 blocks 的映射方式
- 定義 cover image 與 inline image prompt 的整理規則
- 定義逐篇文章整理 checklist

---

## 3. Standard Article Output

每篇 seeds article 至少需要整理成以下欄位：

```yaml
title:
slug:
category:
excerpt:
author: 懂陸姐
status: draft
publishedAt:
seo:
  metaTitle:
  metaDescription:
images:
  coverPrompt:
  coverPromptSize: 1792x1024
  inlinePrompts: []
contentBlocks: []
sourceFile:
notes:
```

欄位說明：

- `title`：文章正式標題，可保留年份與括號資訊。
- `slug`：從標題轉成網址代稱，需對齊 `Posts.ts` 的 slug 規則。
- `category`：指定對應文章分類，若尚未建立分類，先記錄候選值。
- `excerpt`：60 至 120 字摘要，作為列表頁與社群摘要使用。
- `author`：預設為 `懂陸姐`。
- `status`：整理階段先用 `draft`。
- `publishedAt`：若尚未排程可先留空。
- `seo.metaTitle`：建議控制在 28 至 36 個中文字內。
- `seo.metaDescription`：建議控制在 70 至 120 個中文字內。
- `images.coverPrompt`：封面圖 prompt，對應文章主題與搜尋意圖。
- `images.inlinePrompts`：文中圖 prompt 陣列，至少 2 張，建議 2 至 4 張。
- `contentBlocks`：對應 Payload `content` 欄位的 block 輸出規格。
- `sourceFile`：原始 Markdown 檔案路徑。
- `notes`：記錄待補資料，例如分類未定、CTA 未定、圖片尚未生成等。

---

## 4. Article Editing SOP

每篇文章請依照以下順序整理。

### Step 1. 確認原稿是否完整

原稿至少要有：

- 主標題
- 開頭摘要或導言
- 正文章節
- 1 組封面圖 prompt
- 2 組以上文中圖 prompt 或可補寫的插圖需求
- 結尾段落

若文章缺少圖片 prompts，不要直接跳過，需補齊：

- 1 組封面圖 prompt
- 至少 2 組文中圖 prompt

### Step 2. 清理標題與章節階層

將原稿整理成穩定結構：

- `#`：文章主標題
- `##`：主要段落
- `###`：次段落或條列主題

避免混用「一、二、三」與 Markdown 層級造成後續 block 拆分混亂。可以保留中文編號作為標題文字的一部分，但層級要一致。

### Step 3. 抽取文章 metadata

從文章內容整理出：

- `title`
- `slug`
- `excerpt`
- `category`
- `seo.metaTitle`
- `seo.metaDescription`

### Step 4. 抽取與補強圖片 prompts

從原稿中的下列段落擷取：

- `首圖 AI Prompt`
- `文中圖 Prompt`

若 prompt 太短、太抽象或缺乏視覺風格，補足以下元素：

- 主體
- 場景
- 風格
- 用途
- 氛圍或光線

### Step 5. 將內容拆成 Payload blocks

依照 block mapping 規則，把原始 Markdown 拆成 `hero-section`、`rich-text`、`faq`、`cta` 等內容區塊。

### Step 6. 補齊 CTA 與 FAQ

若原稿沒有明確 FAQ 或 CTA，可依文章意圖補一組最小版本：

- FAQ：2 至 4 題
- CTA：1 組

### Step 7. 產出 seed article 檔案或結構稿

整理完成後，輸出為固定 template，供後續 seed data 實作使用。

---

## 5. Markdown to Payload Blocks Mapping

目前專案已存在的 blocks 包含：

- `hero-section`
- `rich-text`
- `image`
- `image-gallery`
- `callout`
- `quote`
- `step-guide`
- `faq`
- `cta`
- `table`
- `embed`
- `divider`

文章整理時，建議優先使用以下映射。

### 5.1 Hero 區塊

對應 block：`hero-section`

用途：

- 呈現文章主題
- 放置開頭核心訊息
- 綁定封面圖

映射規則：

- `heading` = 文章標題
- `subheading` = 導言濃縮版，1 至 2 句
- `backgroundImage` = 後續以 `images.coverPrompt` 生成並上傳的媒體

### 5.2 內文段落

對應 block：`rich-text`

用途：

- 承接大多數章節內容
- 放標題、段落、清單、加粗文字

映射規則：

- 每個主要章節至少一個 `rich-text`
- 不要把整篇文章塞進單一 block
- 建議依主題拆成 4 至 8 個 `rich-text` blocks

### 5.3 文中圖片

對應 block：`image` 或 `image-gallery`

用途：

- 插入由 `inlinePrompts` 生成的說明圖
- 強化重點段落可讀性

映射規則：

- 單張示意圖用 `image`
- 同主題多張比較圖用 `image-gallery`
- 每個圖都需保留對應 prompt 記錄

### 5.4 重點提醒

對應 block：`callout`

用途：

- 放風險提醒
- 放平台限制
- 放注意事項

適用情境：

- 帳號限流風險
- 違規行為警示
- 流程操作中的禁忌事項

### 5.5 問答段落

對應 block：`faq`

用途：

- 把常見疑問集中整理
- 強化搜尋意圖承接

映射規則：

- 原稿已有明確 Q&A 時直接轉換
- 原稿沒有時，從常見搜尋問題補 2 至 4 題

### 5.6 行動呼籲

對應 block：`cta`

用途：

- 承接商業轉換
- 導向服務頁、詢問頁或聯絡表單

最小欄位：

- `heading`
- `description`
- `buttonText`
- `buttonLink`

建議每篇文章都保留 1 個 CTA block。

---

## 6. Image Prompt Rules

每篇文章都必須有圖片規格，不要只保留文字內容。

### 6.1 Cover Image Prompt

最低要求：

- 1 組封面圖 prompt
- 建議尺寸：`1792x1024`
- 視覺主題需能直接對應文章搜尋意圖

建議 prompt 結構：

1. 主角或主體
2. 場景
3. 平台或情境線索
4. 視覺風格
5. 光線或質感
6. 用途描述

範例：

```text
asian smartphone user browsing social media platform similar to xiaohongshu,
warning notification about account rules on screen,
modern digital illustration style,
clean tech blog design,
professional lighting, high detail
```

### 6.2 Inline Image Prompts

最低要求：

- 每篇至少 2 組
- 建議 2 至 4 組

適合配置的位置：

- 問題背景
- 風險說明
- 步驟教學
- 安全操作示意

建議命名：

- `platform-rules-concept`
- `reach-drop-warning`
- `safe-purchase-flow`

### 6.3 Prompt 品質要求

避免以下情況：

- 只有關鍵字，沒有畫面
- 沒有風格描述
- 不知道是封面還是內文插圖
- 畫面與文章主題無直接關聯

至少應該讓生圖者或後續工具一眼知道：

- 要畫什麼
- 給哪一段用
- 視覺要長什麼樣

---

## 7. Seed Article Template

每篇文章整理完成後，應輸出為以下標準格式。

```yaml
title: 台灣人使用小紅書必知規則｜避免帳號限流與封號（2026完整指南）
slug: 台灣人使用小紅書必知規則-避免帳號限流與封號-2026完整指南
category: 小紅書教學
excerpt: 整理台灣使用者在小紅書最常忽略的規則，包含私訊交易、導流風險與避免限流封號的安全使用方式。
author: 懂陸姐
status: draft
publishedAt:
seo:
  metaTitle: 台灣人使用小紅書必知規則｜避免限流與封號
  metaDescription: 台灣使用者想安全使用小紅書，必須先理解平台對私訊交易、導流與違規行為的限制。本文整理常見風險與安全做法。
images:
  coverPrompt: |
    asian smartphone user browsing social media platform similar to xiaohongshu,
    warning notification about account rules on screen,
    modern digital illustration style,
    clean tech blog design,
    professional lighting, high detail
  coverPromptSize: 1792x1024
  inlinePrompts:
    - name: platform-rules-concept
      prompt: |
        social media platform moderation concept,
        mobile phone showing content feed and warning notification,
        clean modern infographic illustration,
        digital platform safety concept
    - name: reach-drop-warning
      prompt: |
        illustration showing social media account reach dropping,
        analytics graph decreasing with warning symbol,
        modern digital marketing infographic style
    - name: safe-purchase-flow
      prompt: |
        smartphone displaying secure ecommerce purchase interface,
        online shopping concept with safety check icons,
        clean modern illustration style
contentBlocks:
  - blockType: hero-section
    heading: 台灣人使用小紅書必知規則｜避免帳號限流與封號（2026完整指南）
    subheading: 幫助台灣使用者理解小紅書的基本規範，避免私訊交易、導流與其他容易觸發限流或封號的行為。
  - blockType: rich-text
    purpose: intro-and-context
  - blockType: rich-text
    purpose: why-rules-matter
  - blockType: callout
    purpose: risk-warning
  - blockType: rich-text
    purpose: common-violations
  - blockType: rich-text
    purpose: safe-usage-methods
  - blockType: faq
    purpose: common-questions
  - blockType: cta
    purpose: conversion
sourceFile: docs/articles/台灣人使用小紅書必知規則｜避免帳號限流與封號.md
notes:
  - category 需確認是否已有「小紅書教學」或「平台規則」分類
  - CTA 需依實際服務頁補上 buttonLink
```

---

## 8. Per-Article Processing Checklist

每整理一篇文章，都要跑完以下清單。

- 確認標題格式完整且可直接作為 `title`
- 產出符合專案規則的 `slug`
- 撰寫 60 至 120 字 `excerpt`
- 指定 `category`
- 補齊 `seo.metaTitle` 與 `seo.metaDescription`
- 抽取 1 組 `coverPrompt`
- 抽取或補寫 2 至 4 組 `inlinePrompts`
- 依內容拆成 `contentBlocks`
- 確認是否需要 `callout`
- 確認是否需要 `faq`
- 補齊 1 組 `cta`
- 記錄 `sourceFile`
- 將未完成事項寫進 `notes`

---

## 9. Recommended Directory Convention

目前建議維持以下分工：

- 原始文章：`docs/articles/`
- 工作流程文件：`docs/workflow/article_workflow.md`
- 設計與實作規劃：`docs/plans/`

若後續需要真正落地 seeds articles，可新增以下其中一種目錄：

- `src/seeds/articles/`
- `src/data/articles/`

實際使用哪個目錄，等 seed script 開始實作時再定。

---

## 10. 實務原則

整理 seeds articles 時，請遵守以下原則：

1. 先結構化，再優化文案
2. 先確保欄位齊全，再處理細節美化
3. 每篇文章都要帶圖片 prompts，不可只有純文字內容
4. 每篇文章都要能映射到 `posts.content` 的 blocks
5. 每篇文章都應保留一個可商業承接的 CTA

這份 workflow 的完成標準不是「文章看起來整理過」，而是「文章已具備 seed-ready 結構，後續可直接轉成 Blog 資料」。