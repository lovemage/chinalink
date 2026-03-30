# ChinaLink 後台系統遷移設計

## 目標

將 ChinaLink 的管理後台從 Payload CMS 遷移為自建 Admin Dashboard，架構風格參照 Yuxiang 專案，但保留現有的 PostgreSQL（Railway）資料庫和 Cloudinary 圖片儲存。

## 決策摘要

| 項目 | 現行（Payload CMS） | 遷移後 |
|------|---------------------|--------|
| 後台框架 | Payload CMS 內建 | 自建 Admin（Next.js App Router） |
| 資料庫 | PostgreSQL（Railway）via Payload | PostgreSQL（Railway）via Drizzle ORM |
| 圖片儲存 | Cloudinary via Payload | Cloudinary（自建上傳元件） |
| 富文本編輯 | Payload Lexical | Tiptap |
| Admin 認證 | Payload Auth | 帳號密碼 + bcrypt + JWT cookie |
| 會員認證 | Payload Auth | 暫不處理（先完成 Admin） |

## Admin 模組

1. **儀表板** `/admin` — 概覽（訂單數、會員數、近期動態）
2. **服務管理** `/admin/services` — CRUD、封面圖上傳（Cloudinary）、Tiptap 富文本描述、三種定價模式（固定/加購/自訂）、功能特點列表
3. **商品管理** `/admin/products` — CRUD、多圖上傳、規格變體（SKU/價格/庫存）、分類篩選
4. **文章管理** `/admin/posts` — CRUD、封面圖、Tiptap 內容編輯、發布/草稿狀態、SEO 欄位
5. **訂單管理** `/admin/orders` — 列表搜尋、狀態更新、訂單明細檢視
6. **會員管理** `/admin/members` — 列表搜尋、會員詳情、狀態管理
7. **分類管理** `/admin/categories` — 商品與服務分類的 CRUD、排序
8. **站台設定** `/admin/settings` — LINE URL、品牌資訊、社群連結、諮詢紀錄檢視

## 資料層架構

```
src/
  lib/
    db/
      schema.ts          # Drizzle schema
      index.ts           # DB 連線（PostgreSQL via Railway）
      migrate.ts         # Migration 工具
    actions/             # Server Actions（寫入操作）
    queries/             # Server 查詢函式（讀取操作）
    auth-admin.ts        # Admin JWT 認證
  app/
    admin/
      layout.tsx         # Admin layout（Sidebar + Header）
      page.tsx           # 儀表板
      login/
      services/
      products/
      posts/
      orders/
      members/
      categories/
      settings/
  components/
    admin/
      AdminSidebar.tsx
      AdminTabBar.tsx     # 移動端底部導航
      AdminHeader.tsx
      ImageUploader.tsx   # Cloudinary 上傳元件
      TiptapEditor.tsx    # 富文本編輯器
      DataTable.tsx       # 通用表格元件
```

## 認證系統

- Admin 登入頁面 `/admin/login`
- bcryptjs 雜湊密碼驗證
- JWT（HMAC SHA-256）簽發 24h token
- httpOnly cookie `admin_token`
- Middleware 攔截 `/admin/*`（login 除外），無 token 導向登入頁

## 資料庫遷移策略

使用 Drizzle ORM 建立新的 schema，對應 ChinaLink 的業務資料結構。現有 Payload 所建的表可保留或清除，前端頁面全面改接 Drizzle 查詢。

核心資料表：
- `admins` — 管理員帳號
- `services` — 服務項目
- `products` — 商品
- `product_images` — 商品圖片
- `product_variations` — 商品規格
- `categories` — 分類（可階層）
- `posts` — 文章
- `orders` / `order_items` — 訂單
- `members` — 會員
- `site_settings` — 站台設定（key-value）
- `inquiries` — 諮詢紀錄

## 前端頁面改接

移除所有 `import { getPayload } from 'payload'` 呼叫，改用 `src/lib/queries/` 中的 Drizzle 查詢函式。前端頁面的 UI 不變，只替換資料來源。

## 參考

- Yuxiang 專案：`/home/aistorm/projects/Yuxiang`
- Yuxiang Admin 架構：自建 Next.js App Router + D1 + R2 + JWT
- ChinaLink 現行 Payload 設定：`src/payload.config.ts`
