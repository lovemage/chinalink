# LinkAI 會員 AI 客服設計

## 目標

在前台網站新增 `LinkAI` 懸浮客服入口與站內即時對話視窗，僅允許已登入會員使用。AI 客服只能回答站內商品、服務、購買流程、會員與聯絡方式等相關問題；遇到不相干問題、站外問題、或資料不足時，必須拒答並導流至官方 `LINE` 或 `WhatsApp`。

系統需支援管理員在 admin 後台設定 `OpenRouter API key`、模型名稱與 AI prompt，並為每位會員僅保留最近 `20` 筆對話紀錄。當新紀錄寫入導致超過 `20` 筆時，必須自動刪除較舊紀錄。

## 範圍

- 前台所有頁面顯示 `LinkAI` 懸浮按鈕
- 排除所有結帳頁路徑 `/checkout/*`
- 僅已登入會員可見與可用
- 站內即時對話視窗支援本次 session 對話狀態
- 資料庫保存每位會員最近 `20` 筆訊息
- admin 可設定 AI 相關欄位
- 後端透過 `OpenRouter` 呼叫模型
- 後端強制執行答題範圍限制

不在本次範圍：

- 不建立 admin 對話查詢頁
- 不做真人客服接手流程
- 不做多輪工具呼叫或 RAG
- 不做檔案上傳、圖片辨識、語音對話

## 使用者流程

### 會員

- 會員登入後，在前台非結帳頁右下角看到 `LinkAI` 懸浮按鈕
- 點擊後展開 AI 客服視窗
- 視窗初始化時載入該會員最近 `20` 筆對話，並與本次 session 前端狀態同步
- 會員送出問題後，前端顯示送出中狀態
- 後端驗證登入狀態與 AI 設定完整性後，呼叫 `OpenRouter`
- AI 回覆完成後，前端顯示最新問答
- 若問題超出站內範圍，AI 固定拒答並建議聯繫 `LINE` 或 `WhatsApp`

### 管理員

- 管理員進入 `/admin/settings`
- 在原有基本設定區塊新增 AI 客服設定欄位
- 可設定啟用狀態、`OpenRouter API key`、模型名稱、客服 prompt、`WhatsApp` 導流連結
- 儲存後前台與 API 讀取最新設定

## 資料模型

### 1. 擴充 `site_settings`

在現有 `site_settings` 增加以下欄位：

- `aiAgentEnabled`: `boolean`，是否啟用 AI 客服
- `openrouterApiKey`: `text`，OpenRouter 金鑰
- `openrouterModel`: `text`，例如 `openai/gpt-4.1-mini`
- `aiAgentPrompt`: `text`，管理員可編輯 prompt
- `whatsappUrl`: `text`，官方 WhatsApp 連結

延用既有欄位：

- `lineOfficialUrl`
- `lineOfficialId`

### 2. 新增 `member_ai_chat_messages`

新增會員 AI 對話資料表：

- `id`: `serial` primary key
- `memberId`: `integer`，關聯會員
- `role`: `text`，值為 `user` 或 `assistant`
- `content`: `text`
- `createdAt`: `timestamp`

用途：

- 每則訊息獨立存一筆
- 每次會員成功問答通常新增兩筆：一筆 `user`，一筆 `assistant`
- 讀取歷史時抓該會員最新 `20` 筆，再按時間正序返回

### 保留上限規則

每次寫入新訊息後，立即執行資料裁切：

- 以 `memberId` 篩選該會員所有訊息
- 依 `createdAt desc, id desc` 排序
- 保留前 `20` 筆
- 刪除其餘較舊資料

這個規則必須在 server side 強制執行，不能只依賴前端顯示限制。

## 前端設計

### 懸浮按鈕

新增 `LinkAI` 懸浮按鈕元件，掛載於前台 `(frontend)` layout。

顯示條件：

- 會員已登入
- 非 `/checkout/*` 路由
- `aiAgentEnabled = true`

視覺要求：

- 使用自製 `LinkAI` SVG，不使用第三方聊天 icon
- 以 `Link` 與 `AI` 字樣整合成簡潔標記
- 按鈕有柔和發光感，避免刺眼的 neon 風格
- 風格需符合現有站點色系與質感，不做過度科技感

互動狀態：

- 預設浮動於右下角
- hover 時加強 glow 與陰影
- 開啟聊天室時按鈕狀態切換為 active
- 行動版需避開底部安全區與系統手勢區

### 聊天視窗

聊天視窗包含：

- 標題列：`LinkAI 智能客服`
- 說明文字：僅回答站內商品與服務相關問題
- 對話訊息列表
- 輸入框
- 送出按鈕
- 快速導流連結：`LINE`、`WhatsApp`

行為：

- 初次開啟時顯示簡短歡迎訊息
- 若載入到歷史紀錄，直接顯示該會員最近 `20` 筆
- 若 API 回應拒答內容，照一般 assistant message 顯示
- 發送期間禁止重複提交
- 發送失敗時顯示錯誤訊息，不丟失目前輸入文字

### Session 同步策略

前端使用 `sessionStorage` 保存當前 session 的聊天室開關狀態與最近顯示中的訊息列表。

規則：

- 頁面切換後仍保留本次 session 的開關與對話 UI
- 初次 hydration 後，以 server 讀回的最近 `20` 筆為基準
- 若 `sessionStorage` 中有較新的本次訊息，可合併但仍以不超過 `20` 筆顯示為原則

## API 設計

### `GET /api/ai-chat`

用途：

- 驗證會員登入狀態
- 取得當前會員最近 `20` 筆訊息

回應：

- `200`: 訊息列表、是否啟用、官方聯絡方式
- `401`: 未登入
- `503`: AI 客服未啟用或關鍵設定缺漏

### `POST /api/ai-chat`

用途：

- 驗證會員登入狀態
- 驗證輸入訊息非空
- 讀取站內設定與 prompt
- 組合 system guard + admin prompt + 近期對話
- 呼叫 `OpenRouter`
- 寫入 `user` 與 `assistant` 訊息
- 裁切舊訊息，保留最新 `20` 筆

請求內容：

- `message: string`

回應：

- `200`: assistant message 與最新 `20` 筆訊息
- `400`: 空白訊息或格式錯誤
- `401`: 未登入
- `503`: 未設定 API key、model、或 AI 未啟用
- `502`: OpenRouter 呼叫失敗

## AI 行為限制

後端必須加入不可由 admin prompt 覆蓋的 guard prompt。最終 prompt 由兩層組成：

1. 固定 system guard
2. admin 可編輯 prompt

固定 system guard 需明確要求：

- 只能回答本網站商品、服務、下單流程、付款、會員、聯絡方式、站內文章內容相關問題
- 對於任何無關主題、泛知識題、醫療、法律、投資、政治、程式、翻譯、站外推薦等問題一律拒答
- 拒答時需簡短說明僅提供站內商品與服務協助
- 拒答時應主動建議改聯繫官方 `LINE` 或 `WhatsApp`
- 不可捏造商品、價格、服務內容、庫存、時效或保證
- 若資訊不足，應承認資訊不足並改推薦官方聯絡渠道

## 站內資料上下文

首版不做向量搜尋或外部知識庫，但 API 可提供精簡站內上下文給模型，來源包括：

- 已公開商品標題、摘要、分類
- 已公開服務標題、價格、摘要
- 基本站內聯絡方式與流程類設定

原則：

- 只取必要欄位，避免 prompt 過大
- 只提供公開內容
- 若找不到足夠資料，寧可拒答，不做推測

## Admin UI 設計

在 `SettingsManager` 的基本設定表單新增 `AI 客服設定` 區塊，欄位如下：

- `AI 客服啟用` 開關
- `OpenRouter API Key`
- `OpenRouter Model`
- `AI 客服 Prompt`
- `WhatsApp 官方連結`

表單要求：

- `API Key` 欄位使用密碼輸入型態
- `Prompt` 使用多行輸入框
- 顯示簡短說明：系統仍會強制限制 AI 只能回答站內商品服務相關問題
- 儲存成功後沿用現有提示樣式

## 路由掛載策略

前台 `RootLayout` 掛載全域聊天入口，但需要在 client 元件中判斷當前 pathname：

- 若 pathname 符合 `/checkout` 開頭，直接不渲染
- 其他 `(frontend)` 頁面正常渲染

這樣可以避免 checkout 畫面被客服按鈕干擾。

## 錯誤處理

- 未登入：前端不顯示入口，API 仍回 `401`
- AI 未啟用：前端不顯示入口
- API key 或 model 缺漏：前端顯示暫時無法使用
- OpenRouter 超時或失敗：顯示系統忙碌訊息，保留輸入框內容
- 站內資料不足：assistant 以受限回應方式導向 `LINE` / `WhatsApp`

## 安全性與限制

- 所有 AI route 都必須重新驗證會員身分，不能只靠前端判斷
- 不信任前端傳入的歷史紀錄，歷史對話以資料庫查詢為準
- admin prompt 不能取代 system guard 的限制
- 不回傳 `OpenRouter API key` 到前端
- 前端只取得是否啟用、model 無需曝光、聯絡導流資訊與對話內容

## 測試策略

### 單元 / 整合測試

- 設定查詢與更新可讀寫 AI 欄位
- 未登入無法呼叫 AI chat API
- 結帳頁不顯示懸浮按鈕
- 登入會員在非結帳頁會顯示懸浮按鈕
- `POST /api/ai-chat` 成功寫入兩筆訊息
- 超過 `20` 筆時會刪除較舊訊息
- 拒答訊息會包含 `LINE` 或 `WhatsApp` 導流

### 手動驗證

- admin 設定 API key / prompt 後前台可正常使用
- 非會員與未登入看不到按鈕
- 會員刷新頁面後仍可看到最近 `20` 筆
- 會員連續對話超過 `20` 筆後，舊訊息自動消失
- `/checkout/[orderId]` 與 `/checkout/success` 均不顯示入口
- 手機版打開聊天室不遮擋主要操作區

## 實作切分

1. 擴充 schema、settings query/action、新增 AI chat message table
2. 建立 AI chat queries / actions / API route 與 `OpenRouter` client
3. 建立前端 `LinkAI` SVG、懸浮按鈕、聊天室視窗
4. 掛載前台 layout，排除 checkout
5. 補測試並手動驗證

## 開放決策

本次採用以下明確決策，不再延後：

- 對話紀錄以「單則訊息」為單位計數，總量上限 `20`
- 超過 `20` 筆立即刪除舊資料，不保留額外備份
- 未登入會員不顯示 AI 客服入口
- `OpenRouter API key` 先存於 `site_settings`
- 首版不提供 admin 對話瀏覽功能
