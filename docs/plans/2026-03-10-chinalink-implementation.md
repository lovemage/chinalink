# 懂陸姐 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立「懂陸姐」知識型網站 + 顧問服務平台，含 Blog、服務商品（三種定價模式）、ECPay 金流、LINE/Google 登入、Resend Email 模板系統。

**Architecture:** Next.js 16 + Payload CMS v3 內嵌模式，單一專案部署到 Railway。PostgreSQL 作為資料庫。前台 SSR/SSG，後台使用 Payload Admin UI。

**Tech Stack:** Next.js 16, Payload CMS v3, PostgreSQL, Drizzle ORM, Tailwind CSS, shadcn/ui, NextAuth.js, ECPay, Resend, React Email

**Design Doc:** `docs/plans/2026-03-10-chinalink-design.md`

---

## Phase 1：專案初始化與基礎設定

### Task 1: 初始化 Payload + Next.js 專案

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/payload/payload.config.ts`
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- Create: `src/app/(payload)/layout.tsx`
- Create: `.env`
- Create: `.env.example`
- Create: `.gitignore`

**Step 1: 使用 Payload 官方 CLI 建立專案**

```bash
cd /home/aistorm/projects/chinalink
npx create-payload-app@latest . --db postgres --no-deps
```

選擇 `blank` template。如果 CLI 不支援 `--no-deps`，手動執行後再調整。

**Step 2: 安裝依賴**

```bash
npm install
```

**Step 3: 設定環境變數**

`.env` 內容：

```env
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/chinalink
PAYLOAD_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=懂陸姐
```

`.env.example` 同上但值為空。

**Step 4: 確認 Payload Admin 可啟動**

```bash
npm run dev
```

瀏覽 `http://localhost:3000/admin` 確認出現 Payload 後台建立管理員畫面。

**Step 5: 初始化 git 並 commit**

```bash
git init
git add .
git commit -m "feat: init payload cms + next.js project"
```

---

### Task 2: 設定 Tailwind CSS + shadcn/ui + 主題色

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/(frontend)/globals.css`（或 Payload 產生的全域 CSS）
- Create: `src/components/ui/button.tsx`（shadcn init 產生）

**Step 1: 安裝 shadcn/ui**

```bash
npx shadcn@latest init
```

選擇：
- Style: Default
- Base color: Neutral
- CSS variables: Yes

**Step 2: 設定懂陸姐主題色**

修改 `tailwind.config.ts`，在 `extend.colors` 加入：

```ts
colors: {
  brand: {
    primary: '#F4845F',    // 暖橘
    bg: '#FFF7ED',         // 奶白
    cta: '#E11D48',        // 玫瑰紅
    text: '#1C1917',       // 深棕黑
    muted: '#78716C',      // 暖灰
  },
},
fontFamily: {
  sans: ['"Noto Sans TC"', 'sans-serif'],
},
borderRadius: {
  card: '16px',
},
```

**Step 3: 安裝常用 shadcn 元件**

```bash
npx shadcn@latest add button card input textarea select badge tabs separator dialog sheet dropdown-menu avatar
```

**Step 4: 確認樣式正常載入**

```bash
npm run dev
```

瀏覽首頁確認 Tailwind 樣式生效。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: setup tailwind css + shadcn/ui with brand theme"
```

---

### Task 3: 建立前台 Layout（Navbar + Footer）

**Files:**
- Create: `src/app/(frontend)/layout.tsx`
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/MobileNav.tsx`

**Step 1: 建立前台 layout**

`src/app/(frontend)/layout.tsx`:

```tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

**Step 2: 建立 Navbar**

`src/components/layout/Navbar.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MobileNav } from './MobileNav'

const navItems = [
  { label: '服務項目', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: '關於懂陸姐', href: '/about' },
  { label: '聯繫我們', href: '/contact' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-primary/10">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-primary">
          懂陸姐
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brand-text hover:text-brand-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button className="bg-brand-cta hover:bg-brand-cta/90 text-white rounded-card">
            登入
          </Button>
        </div>
        <MobileNav items={navItems} />
      </nav>
    </header>
  )
}
```

**Step 3: 建立 MobileNav**

`src/components/layout/MobileNav.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

type Props = {
  items: { label: string; href: string }[]
}

export function MobileNav({ items }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg text-brand-text hover:text-brand-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button className="bg-brand-cta text-white rounded-card mt-4">
            登入
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 4: 建立 Footer**

`src/components/layout/Footer.tsx`:

```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-brand-text text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-brand-primary mb-4">懂陸姐</h3>
          <p className="text-sm text-gray-300">
            台灣人在大陸生活經商的最佳夥伴
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">快速連結</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <Link href="/services" className="hover:text-brand-primary">服務項目</Link>
            <Link href="/blog" className="hover:text-brand-primary">Blog</Link>
            <Link href="/about" className="hover:text-brand-primary">關於懂陸姐</Link>
            <Link href="/contact" className="hover:text-brand-primary">聯繫我們</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">聯繫方式</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <p>Line ID：misstinachen</p>
            <p>微信 ID：tod324</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} 懂陸姐 chinalink.com.tw
      </div>
    </footer>
  )
}
```

**Step 5: 建立首頁 placeholder**

`src/app/(frontend)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-brand-text mb-4">懂陸姐</h1>
      <p className="text-brand-muted text-lg">台灣人在大陸生活經商，找懂陸姐就對了</p>
    </div>
  )
}
```

**Step 6: 安裝 lucide-react icon 套件**

```bash
npm install lucide-react
```

**Step 7: 驗證前台 Layout**

```bash
npm run dev
```

瀏覽 `http://localhost:3000` 確認 Navbar + Footer + 首頁文字正常顯示。

**Step 8: Commit**

```bash
git add .
git commit -m "feat: add frontend layout with navbar, mobile nav, footer"
```

---

## Phase 2：Payload Collections（資料模型）

### Task 4: Media + Users Collection

**Files:**
- Create: `src/payload/collections/Media.ts`
- Modify: `src/payload/collections/Users.ts`（Payload 已產生，修改即可）
- Modify: `src/payload/payload.config.ts`

**Step 1: 建立 Media Collection**

`src/payload/collections/Media.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 768, height: 512 },
      { name: 'hero', width: 1920, height: 1080 },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: '替代文字',
    },
  ],
}
```

**Step 2: 修改 Users Collection**

修改 `src/payload/collections/Users.ts`，確保有 role 欄位：

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [{ label: '管理員', value: 'admin' }],
      required: true,
    },
  ],
}
```

**Step 3: 註冊到 payload.config.ts**

確認 `payload.config.ts` 中 `collections` 包含 `Users` 和 `Media`。

**Step 4: 驗證**

```bash
npm run dev
```

瀏覽 `/admin` → 確認左側選單出現 Media。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add media collection with image sizes"
```

---

### Task 5: Categories + Posts Collection（Blog 資料模型）

**Files:**
- Create: `src/payload/collections/Categories.ts`
- Create: `src/payload/collections/Posts.ts`
- Create: `src/payload/blocks/index.ts`
- Create: `src/payload/blocks/HeroSection.ts`
- Create: `src/payload/blocks/RichTextBlock.ts`
- Create: `src/payload/blocks/ImageBlock.ts`
- Create: `src/payload/blocks/ImageGallery.ts`
- Create: `src/payload/blocks/Callout.ts`
- Create: `src/payload/blocks/Quote.ts`
- Create: `src/payload/blocks/StepGuide.ts`
- Create: `src/payload/blocks/FAQ.ts`
- Create: `src/payload/blocks/CTABlock.ts`
- Create: `src/payload/blocks/TableBlock.ts`
- Create: `src/payload/blocks/Embed.ts`
- Create: `src/payload/blocks/Divider.ts`
- Modify: `src/payload/payload.config.ts`

**Step 1: 建立所有 Block 定義**

`src/payload/blocks/HeroSection.ts`:

```ts
import type { Block } from 'payload'

export const HeroSection: Block = {
  slug: 'hero-section',
  labels: { singular: '引言區', plural: '引言區' },
  fields: [
    { name: 'heading', type: 'text', required: true, label: '大標題' },
    { name: 'subheading', type: 'text', label: '副標題' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: '背景圖' },
  ],
}
```

`src/payload/blocks/RichTextBlock.ts`:

```ts
import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: '段落', plural: '段落' },
  fields: [
    { name: 'content', type: 'richText', required: true, label: '內容' },
  ],
}
```

`src/payload/blocks/ImageBlock.ts`:

```ts
import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: '圖片', plural: '圖片' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: '圖片' },
    { name: 'caption', type: 'text', label: '圖說' },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: '靠左', value: 'left' },
        { label: '置中', value: 'center' },
        { label: '靠右', value: 'right' },
        { label: '滿版', value: 'full' },
      ],
      label: '對齊',
    },
  ],
}
```

`src/payload/blocks/ImageGallery.ts`:

```ts
import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'image-gallery',
  labels: { singular: '圖片集', plural: '圖片集' },
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      label: '圖片',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', label: '圖說' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: '網格', value: 'grid' },
        { label: '輪播', value: 'carousel' },
      ],
      label: '排列方式',
    },
  ],
}
```

`src/payload/blocks/Callout.ts`:

```ts
import type { Block } from 'payload'

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: '提示框', plural: '提示框' },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: '資訊', value: 'info' },
        { label: '警告', value: 'warning' },
        { label: '小技巧', value: 'tip' },
      ],
      label: '類型',
    },
    { name: 'content', type: 'richText', required: true, label: '內容' },
  ],
}
```

`src/payload/blocks/Quote.ts`:

```ts
import type { Block } from 'payload'

export const Quote: Block = {
  slug: 'quote',
  labels: { singular: '引用', plural: '引用' },
  fields: [
    { name: 'quoteText', type: 'textarea', required: true, label: '引文' },
    { name: 'source', type: 'text', label: '來源' },
  ],
}
```

`src/payload/blocks/StepGuide.ts`:

```ts
import type { Block } from 'payload'

export const StepGuide: Block = {
  slug: 'step-guide',
  labels: { singular: '步驟教學', plural: '步驟教學' },
  fields: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      label: '步驟',
      fields: [
        { name: 'title', type: 'text', required: true, label: '步驟標題' },
        { name: 'description', type: 'richText', required: true, label: '說明' },
        { name: 'screenshot', type: 'upload', relationTo: 'media', label: '截圖' },
      ],
    },
  ],
}
```

`src/payload/blocks/FAQ.ts`:

```ts
import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  labels: { singular: '常見問題', plural: '常見問題' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      label: '問答',
      fields: [
        { name: 'question', type: 'text', required: true, label: '問題' },
        { name: 'answer', type: 'richText', required: true, label: '回答' },
      ],
    },
  ],
}
```

`src/payload/blocks/CTABlock.ts`:

```ts
import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: '行動呼籲', plural: '行動呼籲' },
  fields: [
    { name: 'heading', type: 'text', required: true, label: '標題' },
    { name: 'description', type: 'text', label: '說明' },
    { name: 'buttonText', type: 'text', required: true, label: '按鈕文字' },
    { name: 'buttonLink', type: 'text', required: true, label: '按鈕連結' },
  ],
}
```

`src/payload/blocks/TableBlock.ts`:

```ts
import type { Block } from 'payload'

export const TableBlock: Block = {
  slug: 'table',
  labels: { singular: '表格', plural: '表格' },
  fields: [
    {
      name: 'headers',
      type: 'array',
      required: true,
      label: '欄位標題',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      label: '資料列',
      fields: [
        {
          name: 'cells',
          type: 'array',
          required: true,
          label: '儲存格',
          fields: [{ name: 'value', type: 'text', required: true }],
        },
      ],
    },
  ],
}
```

`src/payload/blocks/Embed.ts`:

```ts
import type { Block } from 'payload'

export const Embed: Block = {
  slug: 'embed',
  labels: { singular: '嵌入', plural: '嵌入' },
  fields: [
    { name: 'url', type: 'text', required: true, label: '嵌入網址（YouTube 等）' },
    { name: 'caption', type: 'text', label: '說明' },
  ],
}
```

`src/payload/blocks/Divider.ts`:

```ts
import type { Block } from 'payload'

export const Divider: Block = {
  slug: 'divider',
  labels: { singular: '分隔線', plural: '分隔線' },
  fields: [],
}
```

`src/payload/blocks/index.ts`:

```ts
export { HeroSection } from './HeroSection'
export { RichTextBlock } from './RichTextBlock'
export { ImageBlock } from './ImageBlock'
export { ImageGallery } from './ImageGallery'
export { Callout } from './Callout'
export { Quote } from './Quote'
export { StepGuide } from './StepGuide'
export { FAQ } from './FAQ'
export { CTABlock } from './CTABlock'
export { TableBlock } from './TableBlock'
export { Embed } from './Embed'
export { Divider } from './Divider'
```

**Step 2: 建立 Categories Collection**

`src/payload/collections/Categories.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '分類名稱' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      label: '網址代稱',
    },
  ],
}
```

**Step 3: 建立 Posts Collection**

`src/payload/collections/Posts.ts`:

```ts
import type { CollectionConfig } from 'payload'
import {
  HeroSection, RichTextBlock, ImageBlock, ImageGallery,
  Callout, Quote, StepGuide, FAQ, CTABlock, TableBlock, Embed, Divider,
} from '../blocks'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: '標題' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      label: '網址代稱',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: '分類',
      admin: { position: 'sidebar' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: '封面圖',
    },
    { name: 'excerpt', type: 'textarea', label: '文章摘要' },
    { name: 'author', type: 'text', label: '作者', defaultValue: '懂陸姐' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已發佈', value: 'published' },
      ],
      admin: { position: 'sidebar' },
      label: '狀態',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      label: '發佈日期',
    },
    {
      name: 'content',
      type: 'blocks',
      required: true,
      label: '文章內容',
      blocks: [
        HeroSection, RichTextBlock, ImageBlock, ImageGallery,
        Callout, Quote, StepGuide, FAQ, CTABlock, TableBlock, Embed, Divider,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
      ],
    },
  ],
}
```

**Step 4: 註冊到 payload.config.ts**

在 `collections` 陣列加入 `Categories` 和 `Posts`。

**Step 5: 驗證**

```bash
npm run dev
```

瀏覽 `/admin` → 新增一個 Category → 新增一篇 Post，測試 Block 編輯器可正常使用。

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add blog system with categories, posts, and 12 content blocks"
```

---

### Task 6: ServiceCategories + Services Collection

**Files:**
- Create: `src/payload/collections/ServiceCategories.ts`
- Create: `src/payload/collections/Services.ts`
- Modify: `src/payload/payload.config.ts`

**Step 1: 建立 ServiceCategories**

`src/payload/collections/ServiceCategories.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '分類名稱' },
    { name: 'slug', type: 'text', required: true, unique: true, label: '網址代稱' },
  ],
}
```

**Step 2: 建立 Services Collection**

`src/payload/collections/Services.ts`:

```ts
import type { CollectionConfig } from 'payload'
import {
  HeroSection, RichTextBlock, ImageBlock, ImageGallery,
  Callout, Quote, StepGuide, FAQ, CTABlock, TableBlock, Embed, Divider,
} from '../blocks'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'serviceCategory', 'pricingMode', 'status', 'visibility'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, label: '服務名稱' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: '網址代稱',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'serviceCategory',
      type: 'relationship',
      relationTo: 'service-categories',
      label: '服務分類',
      admin: { position: 'sidebar' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: '封面圖' },
    {
      name: 'description',
      type: 'blocks',
      label: '服務說明',
      blocks: [
        HeroSection, RichTextBlock, ImageBlock, ImageGallery,
        Callout, Quote, StepGuide, FAQ, CTABlock, TableBlock, Embed, Divider,
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已發佈', value: 'published' },
      ],
      admin: { position: 'sidebar' },
      label: '狀態',
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: '公開', value: 'public' },
        { label: '私人', value: 'private' },
        { label: '僅連結可見', value: 'unlisted' },
      ],
      admin: { position: 'sidebar' },
      label: '可見性',
    },
    {
      name: 'pricingMode',
      type: 'select',
      required: true,
      defaultValue: 'fixed',
      options: [
        { label: '固定價格', value: 'fixed' },
        { label: '基礎價 + 加購', value: 'addons' },
        { label: '諮詢報價', value: 'custom' },
      ],
      label: '定價模式',
    },
    {
      name: 'price',
      type: 'number',
      label: '固定價格（NTD）',
      admin: {
        condition: (data) => data?.pricingMode === 'fixed',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      label: '基礎價格（NTD）',
      admin: {
        condition: (data) => data?.pricingMode === 'addons',
      },
    },
    {
      name: 'addons',
      type: 'array',
      label: '加購選項',
      admin: {
        condition: (data) => data?.pricingMode === 'addons',
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: '選項名稱' },
        { name: 'price', type: 'number', required: true, label: '價格（NTD）' },
        { name: 'required', type: 'checkbox', defaultValue: false, label: '必選' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '服務特點',
      fields: [
        { name: 'text', type: 'text', required: true, label: '特點說明' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
      ],
    },
  ],
}
```

**Step 3: 註冊到 payload.config.ts**

**Step 4: 驗證**

```bash
npm run dev
```

在 `/admin` 測試建立服務：分別測試 fixed / addons / custom 三種模式，確認條件顯示欄位正常。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add services collection with 3 pricing modes"
```

---

### Task 7: Customers + Orders + Inquiries Collection

**Files:**
- Create: `src/payload/collections/Customers.ts`
- Create: `src/payload/collections/Orders.ts`
- Create: `src/payload/collections/Inquiries.ts`
- Modify: `src/payload/payload.config.ts`

**Step 1: 建立 Customers**

`src/payload/collections/Customers.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'authProvider', 'lastLoginAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '姓名' },
    { name: 'email', type: 'email', required: true, unique: true, label: 'Email' },
    { name: 'phone', type: 'text', label: '電話' },
    { name: 'avatar', type: 'text', label: '大頭照 URL' },
    {
      name: 'authProvider',
      type: 'select',
      required: true,
      options: [
        { label: 'LINE', value: 'line' },
        { label: 'Google', value: 'google' },
      ],
      label: '登入方式',
    },
    { name: 'providerId', type: 'text', required: true, label: '第三方 ID', admin: { readOnly: true } },
    { name: 'lastLoginAt', type: 'date', label: '最後登入' },
  ],
  timestamps: true,
}
```

**Step 2: 建立 Orders**

`src/payload/collections/Orders.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'service', 'amount', 'paymentStatus', 'createdAt'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: '訂單編號',
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
              const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
              return `DL${dateStr}${rand}`
            }
            return value
          },
        ],
      },
    },
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, label: '會員' },
    { name: 'service', type: 'relationship', relationTo: 'services', required: true, label: '服務' },
    {
      name: 'selectedAddons',
      type: 'array',
      label: '所選加購項目',
      fields: [
        { name: 'name', type: 'text', required: true, label: '項目名稱' },
        { name: 'price', type: 'number', required: true, label: '價格' },
      ],
    },
    { name: 'amount', type: 'number', required: true, label: '總金額（NTD）' },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: '信用卡', value: 'credit_card' },
        { label: 'ATM 轉帳', value: 'atm' },
        { label: '超商代碼', value: 'cvs' },
      ],
      label: '付款方式',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: '待付款', value: 'pending' },
        { label: '已付款', value: 'paid' },
        { label: '付款失敗', value: 'failed' },
        { label: '已過期', value: 'expired' },
      ],
      label: '付款狀態',
    },
    { name: 'ecpayTradeNo', type: 'text', label: 'ECPay 交易編號', admin: { readOnly: true } },
    { name: 'note', type: 'textarea', label: 'Admin 備註' },
  ],
  timestamps: true,
}
```

**Step 3: 建立 Inquiries**

`src/payload/collections/Inquiries.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'customer', 'service', 'status', 'createdAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', label: '會員' },
    { name: 'service', type: 'relationship', relationTo: 'services', label: '相關服務' },
    { name: 'name', type: 'text', required: true, label: '姓名' },
    { name: 'contactMethod', type: 'text', required: true, label: '聯繫方式（Line ID / 微信）' },
    { name: 'message', type: 'textarea', required: true, label: '需求說明' },
    {
      name: 'attachments',
      type: 'array',
      label: '附件',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '新需求', value: 'new' },
        { label: '已聯繫', value: 'contacted' },
        { label: '已報價', value: 'quoted' },
        { label: '已結案', value: 'closed' },
      ],
      label: '狀態',
    },
  ],
  timestamps: true,
}
```

**Step 4: 註冊到 payload.config.ts**

**Step 5: 驗證**

```bash
npm run dev
```

在 `/admin` 確認 Customers、Orders、Inquiries 出現在選單中，各欄位正常。

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add customers, orders, inquiries collections"
```

---

### Task 8: EmailTemplates Collection

**Files:**
- Create: `src/payload/collections/EmailTemplates.ts`
- Create: `src/payload/blocks/email/EmailHeading.ts`
- Create: `src/payload/blocks/email/EmailText.ts`
- Create: `src/payload/blocks/email/EmailButton.ts`
- Create: `src/payload/blocks/email/EmailImage.ts`
- Create: `src/payload/blocks/email/EmailOrderSummary.ts`
- Create: `src/payload/blocks/email/EmailDivider.ts`
- Create: `src/payload/blocks/email/EmailFooter.ts`
- Create: `src/payload/blocks/email/index.ts`
- Modify: `src/payload/payload.config.ts`

**Step 1: 建立 Email Block 定義**

`src/payload/blocks/email/EmailHeading.ts`:

```ts
import type { Block } from 'payload'

export const EmailHeading: Block = {
  slug: 'email-heading',
  labels: { singular: '標題', plural: '標題' },
  fields: [
    { name: 'text', type: 'text', required: true, label: '標題文字（支援 {{變數}}）' },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
      ],
    },
  ],
}
```

`src/payload/blocks/email/EmailText.ts`:

```ts
import type { Block } from 'payload'

export const EmailText: Block = {
  slug: 'email-text',
  labels: { singular: '段落', plural: '段落' },
  fields: [
    { name: 'text', type: 'textarea', required: true, label: '內容（支援 {{變數}}）' },
  ],
}
```

`src/payload/blocks/email/EmailButton.ts`:

```ts
import type { Block } from 'payload'

export const EmailButton: Block = {
  slug: 'email-button',
  labels: { singular: 'CTA 按鈕', plural: 'CTA 按鈕' },
  fields: [
    { name: 'text', type: 'text', required: true, label: '按鈕文字' },
    { name: 'url', type: 'text', required: true, label: '連結（支援 {{變數}}）' },
  ],
}
```

`src/payload/blocks/email/EmailImage.ts`:

```ts
import type { Block } from 'payload'

export const EmailImage: Block = {
  slug: 'email-image',
  labels: { singular: '圖片', plural: '圖片' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text', label: '替代文字' },
  ],
}
```

`src/payload/blocks/email/EmailOrderSummary.ts`:

```ts
import type { Block } from 'payload'

export const EmailOrderSummary: Block = {
  slug: 'email-order-summary',
  labels: { singular: '訂單摘要', plural: '訂單摘要' },
  fields: [
    {
      name: 'note',
      type: 'text',
      label: '說明',
      defaultValue: '此區塊會自動帶入訂單資料（編號、服務名稱、金額、付款方式）',
      admin: { readOnly: true },
    },
  ],
}
```

`src/payload/blocks/email/EmailDivider.ts`:

```ts
import type { Block } from 'payload'

export const EmailDivider: Block = {
  slug: 'email-divider',
  labels: { singular: '分隔線', plural: '分隔線' },
  fields: [],
}
```

`src/payload/blocks/email/EmailFooter.ts`:

```ts
import type { Block } from 'payload'

export const EmailFooter: Block = {
  slug: 'email-footer',
  labels: { singular: '頁尾', plural: '頁尾' },
  fields: [
    { name: 'text', type: 'textarea', label: '頁尾文字（支援 {{變數}}）' },
  ],
}
```

`src/payload/blocks/email/index.ts`:

```ts
export { EmailHeading } from './EmailHeading'
export { EmailText } from './EmailText'
export { EmailButton } from './EmailButton'
export { EmailImage } from './EmailImage'
export { EmailOrderSummary } from './EmailOrderSummary'
export { EmailDivider } from './EmailDivider'
export { EmailFooter } from './EmailFooter'
```

**Step 2: 建立 EmailTemplates Collection**

`src/payload/collections/EmailTemplates.ts`:

```ts
import type { CollectionConfig } from 'payload'
import {
  EmailHeading, EmailText, EmailButton, EmailImage,
  EmailOrderSummary, EmailDivider, EmailFooter,
} from '../blocks/email'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '模板名稱' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: '代稱（程式呼叫用）',
      admin: { description: '如 welcome, order-paid, custom-quote' },
    },
    { name: 'subject', type: 'text', required: true, label: '信件主旨（支援 {{變數}}）' },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'system',
      options: [
        { label: '系統模板', value: 'system' },
        { label: '行銷模板', value: 'marketing' },
      ],
      label: '類型',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '啟用', value: 'active' },
      ],
      label: '狀態',
      admin: { position: 'sidebar' },
    },
    {
      name: 'availableVariables',
      type: 'array',
      label: '可用變數表',
      admin: {
        position: 'sidebar',
        description: '此模板可使用的變數。點擊變數名稱可複製。',
        readOnly: false,
      },
      fields: [
        { name: 'key', type: 'text', required: true, label: '變數名（如 customerName）' },
        { name: 'description', type: 'text', required: true, label: '說明（如「會員姓名」）' },
      ],
    },
    {
      name: 'content',
      type: 'blocks',
      required: true,
      label: '模板內容',
      blocks: [
        EmailHeading, EmailText, EmailButton, EmailImage,
        EmailOrderSummary, EmailDivider, EmailFooter,
      ],
    },
  ],
  timestamps: true,
}
```

**Step 3: 註冊到 payload.config.ts**

**Step 4: 驗證**

```bash
npm run dev
```

在 `/admin` → Email 模板 → 新增模板，測試 Block 編輯器和側欄變數表正常。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add email templates collection with variable table and blocks"
```

---

## Phase 3：會員登入系統（NextAuth.js）

### Task 9: NextAuth.js + LINE + Google OAuth

**Files:**
- Create: `src/lib/auth/auth.config.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/(frontend)/(auth)/login/page.tsx`
- Create: `src/components/auth/LoginButtons.tsx`
- Create: `src/components/auth/AuthProvider.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `.env`

**Step 1: 安裝依賴**

```bash
npm install next-auth@beta @auth/core
```

**Step 2: 設定環境變數**

在 `.env` 加入：

```env
AUTH_SECRET=generate-a-random-secret-here

# LINE Login
AUTH_LINE_ID=your-line-channel-id
AUTH_LINE_SECRET=your-line-channel-secret

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

**Step 3: 建立 auth config**

`src/lib/auth/auth.config.ts`:

```ts
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import LINE from 'next-auth/providers/line'
import { getPayload } from 'payload'
import config from '@payload-config'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({ clientId: process.env.AUTH_GOOGLE_ID!, clientSecret: process.env.AUTH_GOOGLE_SECRET! }),
    LINE({ clientId: process.env.AUTH_LINE_ID!, clientSecret: process.env.AUTH_LINE_SECRET! }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false

      const payload = await getPayload({ config })

      const existing = await payload.find({
        collection: 'customers',
        where: { providerId: { equals: account.providerAccountId } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'customers',
          data: {
            name: user.name || '未命名',
            email: user.email,
            avatar: user.image || '',
            authProvider: account.provider as 'line' | 'google',
            providerId: account.providerAccountId,
            lastLoginAt: new Date().toISOString(),
          },
        })
      } else {
        await payload.update({
          collection: 'customers',
          id: existing.docs[0].id,
          data: { lastLoginAt: new Date().toISOString() },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (token.customerId) {
        session.user.customerId = token.customerId as string
      }
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        const payload = await getPayload({ config })
        const customer = await payload.find({
          collection: 'customers',
          where: { providerId: { equals: account.providerAccountId } },
          limit: 1,
        })
        if (customer.docs.length > 0) {
          token.customerId = customer.docs[0].id
        }
      }
      return token
    },
  },
}
```

**Step 4: 建立 API route**

`src/app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
```

**Step 5: 建立 AuthProvider**

`src/components/auth/AuthProvider.tsx`:

```tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

**Step 6: 修改前台 layout 加入 AuthProvider**

在 `src/app/(frontend)/layout.tsx` 用 `<AuthProvider>` 包住 children。

**Step 7: 建立登入頁**

`src/app/(frontend)/(auth)/login/page.tsx`:

```tsx
import { LoginButtons } from '@/components/auth/LoginButtons'

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-card p-8 shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-brand-text mb-2">登入懂陸姐</h1>
        <p className="text-brand-muted mb-8">使用以下方式快速登入</p>
        <LoginButtons />
      </div>
    </div>
  )
}
```

**Step 8: 建立 LoginButtons**

`src/components/auth/LoginButtons.tsx`:

```tsx
'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function LoginButtons() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => signIn('line', { callbackUrl: '/' })}
        className="bg-[#06C755] hover:bg-[#06C755]/90 text-white rounded-card h-12"
      >
        LINE 登入
      </Button>
      <Button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        variant="outline"
        className="rounded-card h-12"
      >
        Google 登入
      </Button>
    </div>
  )
}
```

**Step 9: 修改 Navbar 顯示登入狀態**

修改 `Navbar.tsx`，用 `useSession()` 判斷登入狀態，已登入顯示大頭照 + 下拉選單，未登入顯示「登入」按鈕。

**Step 10: 驗證**

```bash
npm run dev
```

瀏覽 `/login` 確認登入頁面顯示兩個按鈕。（實際 OAuth 需要設定 LINE/Google 的回調 URL 後才能測試完整流程）

**Step 11: Commit**

```bash
git add .
git commit -m "feat: add nextauth with LINE and Google OAuth login"
```

---

## Phase 4：前台頁面

### Task 10: 首頁

**Files:**
- Modify: `src/app/(frontend)/page.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/PainPoints.tsx`
- Create: `src/components/home/ServiceOverview.tsx`
- Create: `src/components/home/LatestPosts.tsx`
- Create: `src/components/home/TrustSection.tsx`

**Step 1: 建立各區塊元件**

每個元件按設計文件的首頁區塊實作：
- `HeroSection`: 大標題 + 副標 + 兩個 CTA 按鈕
- `PainPoints`: 4 張痛點卡片（沒大陸手機號、支付寶開不了、想開淘寶店、抖音註冊不了）
- `ServiceOverview`: 4 張服務卡片，連結到 `/services`
- `LatestPosts`: 從 Payload 查詢最新 3 篇 published 文章
- `TrustSection`: Line/微信 QR Code + YouTube 頻道連結

**Step 2: 組合首頁**

```tsx
import { HeroSection } from '@/components/home/HeroSection'
import { PainPoints } from '@/components/home/PainPoints'
import { ServiceOverview } from '@/components/home/ServiceOverview'
import { LatestPosts } from '@/components/home/LatestPosts'
import { TrustSection } from '@/components/home/TrustSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ServiceOverview />
      <LatestPosts />
      <TrustSection />
    </>
  )
}
```

**Step 3: 驗證**

```bash
npm run dev
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add homepage with hero, pain points, services, posts, trust sections"
```

---

### Task 11: 服務列表頁 + 服務詳情頁

**Files:**
- Create: `src/app/(frontend)/services/page.tsx`
- Create: `src/app/(frontend)/services/[slug]/page.tsx`
- Create: `src/components/services/ServiceCard.tsx`
- Create: `src/components/services/ServiceFilters.tsx`
- Create: `src/components/services/PricingSection.tsx`
- Create: `src/components/services/InquiryForm.tsx`
- Create: `src/components/blocks/BlockRenderer.tsx`

**Step 1: 建立 BlockRenderer**

通用的 Block 渲染元件，根據 block type 動態渲染對應前台元件。Posts 和 Services 共用。

`src/components/blocks/BlockRenderer.tsx`:

```tsx
import { HeroSectionBlock } from './HeroSectionBlock'
import { RichTextBlock } from './RichTextBlock'
import { ImageBlockComponent } from './ImageBlockComponent'
import { CalloutBlock } from './CalloutBlock'
import { QuoteBlock } from './QuoteBlock'
import { StepGuideBlock } from './StepGuideBlock'
import { FAQBlock } from './FAQBlock'
import { CTABlockComponent } from './CTABlockComponent'
import { TableBlockComponent } from './TableBlockComponent'
import { EmbedBlock } from './EmbedBlock'
import { ImageGalleryBlock } from './ImageGalleryBlock'

const blockComponents: Record<string, React.ComponentType<any>> = {
  'hero-section': HeroSectionBlock,
  'rich-text': RichTextBlock,
  'image': ImageBlockComponent,
  'image-gallery': ImageGalleryBlock,
  'callout': CalloutBlock,
  'quote': QuoteBlock,
  'step-guide': StepGuideBlock,
  'faq': FAQBlock,
  'cta': CTABlockComponent,
  'table': TableBlockComponent,
  'embed': EmbedBlock,
  'divider': () => <hr className="my-8 border-brand-primary/20" />,
}

type Props = { blocks: any[] }

export function BlockRenderer({ blocks }: Props) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id || i} {...block} />
      })}
    </div>
  )
}
```

**Step 2: 建立每個 Block 的前台渲染元件**

在 `src/components/blocks/` 建立每個 block 的前台元件（HeroSectionBlock.tsx、RichTextBlock.tsx 等）。每個元件接收對應 block 的 props 並用 Tailwind 樣式渲染。

**Step 3: 建立服務列表頁**

`src/app/(frontend)/services/page.tsx`:

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { ServiceCard } from '@/components/services/ServiceCard'
import { ServiceFilters } from '@/components/services/ServiceFilters'

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const payload = await getPayload({ config })

  const categories = await payload.find({ collection: 'service-categories', limit: 100 })

  const where: any = { status: { equals: 'published' }, visibility: { equals: 'public' } }
  if (category) {
    const cat = categories.docs.find((c) => c.slug === category)
    if (cat) where.serviceCategory = { equals: cat.id }
  }

  const services = await payload.find({ collection: 'services', where, limit: 100 })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-text mb-8">服務項目</h1>
      <ServiceFilters categories={categories.docs} current={category} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {services.docs.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}
```

**Step 4: 建立服務詳情頁**

`src/app/(frontend)/services/[slug]/page.tsx`:

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PricingSection } from '@/components/services/PricingSection'
import { InquiryForm } from '@/components/services/InquiryForm'

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const service = result.docs[0]
  if (!service) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {service.coverImage && (
        <img
          src={(service.coverImage as any).url}
          alt={service.title}
          className="w-full h-64 object-cover rounded-card mb-8"
        />
      )}
      <h1 className="text-3xl font-bold text-brand-text mb-4">{service.title}</h1>

      <PricingSection service={service} />

      {service.description && <BlockRenderer blocks={service.description} />}

      {service.features && service.features.length > 0 && (
        <div className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">服務特點</h2>
          <ul className="space-y-1">
            {service.features.map((f: any, i: number) => (
              <li key={i} className="flex items-center gap-2 text-brand-text">
                <span className="text-brand-primary">✓</span> {f.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.pricingMode === 'custom' && <InquiryForm serviceId={service.id} />}
    </div>
  )
}
```

**Step 5: 建立 PricingSection（根據 pricingMode 顯示不同 UI）**

`src/components/services/PricingSection.tsx`：

- `fixed`: 顯示價格 + 「立即購買」按鈕
- `addons`: 顯示基礎價 + 加購勾選 + 計算總價 + 「立即購買」
- `custom`: 顯示「此服務需先諮詢報價」

**Step 6: 建立 InquiryForm（客製報價表單）**

`src/components/services/InquiryForm.tsx`：
- 姓名、聯繫方式、需求說明、附件上傳
- POST 到 `/api/inquiries`

**Step 7: 建立 API route for inquiries**

`src/app/api/inquiries/route.ts`

**Step 8: 驗證**

在後台新增服務分類 + 幾個服務（三種模式各一），前台瀏覽 `/services` 和 `/services/[slug]`。

**Step 9: Commit**

```bash
git add .
git commit -m "feat: add services pages with block renderer, pricing modes, inquiry form"
```

---

### Task 12: Blog 列表頁 + 文章頁

**Files:**
- Create: `src/app/(frontend)/blog/page.tsx`
- Create: `src/app/(frontend)/blog/[slug]/page.tsx`
- Create: `src/components/blog/PostCard.tsx`
- Create: `src/components/blog/CategoryFilter.tsx`

**Step 1: 建立 Blog 列表頁**

`src/app/(frontend)/blog/page.tsx`:

從 Payload 查詢 published posts，支援 category 篩選。使用 PostCard 元件顯示文章卡片。

**Step 2: 建立 Blog 文章頁**

`src/app/(frontend)/blog/[slug]/page.tsx`:

查詢單篇文章，使用 `BlockRenderer` 渲染 content blocks。底部加「相關文章」推薦（同分類）。

**Step 3: SEO metadata**

每個頁面 export `generateMetadata` function，從 post.seo 產生 meta title / description。

**Step 4: 驗證**

在後台新增文章（使用各種 blocks），前台瀏覽 `/blog` 和 `/blog/[slug]`。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add blog list and article pages with block rendering"
```

---

### Task 13: 關於我們 + 聯繫我們頁面

**Files:**
- Create: `src/app/(frontend)/about/page.tsx`
- Create: `src/app/(frontend)/contact/page.tsx`
- Create: `src/components/contact/ContactForm.tsx`

**Step 1: 建立關於我們頁面**

靜態頁面，介紹懂陸姐背景、服務理念。

**Step 2: 建立聯繫我們頁面**

顯示 Line QR Code + 微信 QR Code + YouTube 連結 + 聯繫表單。

**Step 3: 聯繫表單 API**

表單提交到 `/api/contact`，建立 inquiry 記錄（不關聯 service）。

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add about and contact pages"
```

---

## Phase 5：ECPay 金流串接

### Task 14: ECPay 結帳流程

**Files:**
- Create: `src/lib/ecpay/ecpay.ts`
- Create: `src/lib/ecpay/types.ts`
- Create: `src/app/api/checkout/route.ts`
- Create: `src/app/api/ecpay/notify/route.ts`
- Create: `src/app/(frontend)/checkout/[orderId]/page.tsx`
- Create: `src/app/(frontend)/checkout/success/page.tsx`
- Modify: `.env`

**Step 1: 安裝依賴**

```bash
npm install crypto-js
npm install -D @types/crypto-js
```

**Step 2: 設定環境變數**

在 `.env` 加入：

```env
ECPAY_MERCHANT_ID=your-merchant-id
ECPAY_HASH_KEY=your-hash-key
ECPAY_HASH_IV=your-hash-iv
ECPAY_API_URL=https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5
ECPAY_RETURN_URL=http://localhost:3000/api/ecpay/notify
ECPAY_CLIENT_BACK_URL=http://localhost:3000/checkout/success
```

**Step 3: 建立 ECPay 工具函數**

`src/lib/ecpay/ecpay.ts`:

- `generateCheckMacValue(params)`: 產生檢查碼
- `createPaymentForm(order)`: 產生 ECPay 表單 HTML（auto-submit form）
- `verifyNotification(body)`: 驗證 ECPay 回調的 CheckMacValue

**Step 4: 建立結帳 API**

`src/app/api/checkout/route.ts`:

```
POST /api/checkout
Body: { serviceId, selectedAddons?, customerId }
→ 建立 order（paymentStatus: pending）
→ 產生 ECPay 表單 HTML
→ 回傳 { orderId, formHtml }
```

**Step 5: 建立 ECPay 回調 API**

`src/app/api/ecpay/notify/route.ts`:

```
POST /api/ecpay/notify（ECPay Server to Server）
→ 驗證 CheckMacValue
→ 查詢 order by MerchantTradeNo
→ 更新 paymentStatus（paid / failed）
→ 回傳 "1|OK"
```

**Step 6: 建立結帳頁面**

`src/app/(frontend)/checkout/[orderId]/page.tsx`:

顯示訂單摘要 + 自動提交 ECPay 表單（或提供「前往付款」按鈕）。

**Step 7: 建立付款成功頁面**

`src/app/(frontend)/checkout/success/page.tsx`:

顯示「付款成功」+ 訂單資訊。

**Step 8: 驗證**

使用 ECPay 測試環境，完成一筆測試交易。

**Step 9: Commit**

```bash
git add .
git commit -m "feat: add ecpay checkout flow with order creation and payment callback"
```

---

## Phase 6：Resend Email 系統

### Task 15: Resend 串接 + Email 發送

**Files:**
- Create: `src/lib/resend/resend.ts`
- Create: `src/lib/resend/renderTemplate.ts`
- Create: `src/emails/Layout.tsx`
- Create: `src/emails/components/EmailHeadingComponent.tsx`
- Create: `src/emails/components/EmailTextComponent.tsx`
- Create: `src/emails/components/EmailButtonComponent.tsx`
- Create: `src/emails/components/EmailOrderSummaryComponent.tsx`
- Modify: `.env`

**Step 1: 安裝依賴**

```bash
npm install resend @react-email/components
```

**Step 2: 設定環境變數**

```env
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@chinalink.com.tw
```

**Step 3: 建立 Email Layout**

`src/emails/Layout.tsx`:

統一外框，包含 Logo header + content slot + footer（懂陸姐 chinalink.com.tw）。

**Step 4: 建立 Email Block 渲染元件**

每個 email block type 對應一個 React Email 元件。

**Step 5: 建立 renderTemplate 函數**

`src/lib/resend/renderTemplate.ts`:

```ts
// 1. 從 Payload 查詢 emailTemplate by slug
// 2. 將 {{變數}} 替換為實際值
// 3. 將 blocks 渲染為 React Email 元件
// 4. 包在 Layout 裡
// 5. 回傳 { subject, react }
```

**Step 6: 建立 sendEmail 函數**

`src/lib/resend/resend.ts`:

```ts
import { Resend } from 'resend'
import { renderTemplate } from './renderTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTemplateEmail(
  templateSlug: string,
  to: string,
  variables: Record<string, string>,
) {
  const { subject, react } = await renderTemplate(templateSlug, variables)
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    react,
  })
}
```

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add resend email system with template rendering"
```

---

### Task 16: Email 觸發 Hooks + 種子模板

**Files:**
- Create: `src/payload/hooks/sendWelcomeEmail.ts`
- Create: `src/payload/hooks/sendOrderEmail.ts`
- Create: `src/payload/hooks/sendInquiryEmail.ts`
- Create: `src/payload/seed/emailTemplates.ts`
- Modify: `src/payload/collections/Customers.ts`（加 afterChange hook）
- Modify: `src/payload/collections/Orders.ts`（加 afterChange hook）
- Modify: `src/payload/collections/Inquiries.ts`（加 afterChange hook）

**Step 1: 建立 Payload Hooks**

每個 hook 在對應 collection 的 `afterChange` 觸發 `sendTemplateEmail`。

**Step 2: 建立種子模板**

`src/payload/seed/emailTemplates.ts`:

初始化 6 個系統模板（welcome, order-created, order-paid, order-failed, inquiry-received, custom-quote），每個含預設 blocks + availableVariables。

**Step 3: 在 payload.config.ts 加入 onInit 執行種子**

```ts
onInit: async (payload) => {
  const existing = await payload.find({ collection: 'email-templates', limit: 1 })
  if (existing.totalDocs === 0) {
    await seedEmailTemplates(payload)
  }
}
```

**Step 4: 驗證**

啟動 dev server，確認 6 個模板自動建立。修改模板內容後，觸發對應事件確認 Email 發送。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add email trigger hooks and seed 6 system templates"
```

---

## Phase 7：部署

### Task 17: Docker + Railway 部署設定

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `railway.toml`（選配）

**Step 1: 建立 Dockerfile**

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

**Step 2: 建立 .dockerignore**

```
node_modules
.next
.env
.git
```

**Step 3: Railway 設定**

- 新增 PostgreSQL service
- 設定環境變數（DATABASE_URI, PAYLOAD_SECRET, AUTH_*, ECPAY_*, RESEND_*）
- 連結 GitHub repo 自動部署

**Step 4: 測試 build**

```bash
npm run build
```

確認 build 成功無錯誤。

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add dockerfile and deployment config for railway"
```

---

## 完成檢查清單

| 功能 | 驗證方式 |
|------|---------|
| Payload Admin 後台 | `/admin` 可登入，所有 Collection 可 CRUD |
| Blog 模組化編輯 | 在後台用 12 種 Block 組合文章，前台正確渲染 |
| 服務三種定價 | fixed / addons / custom 各建一個服務，前台顯示正確 |
| Admin 快速開單 | 建立 unlisted 服務，產生專屬連結，會員可開啟付款 |
| LINE 登入 | 前台 LINE OAuth 登入成功，customers 建立記錄 |
| Google 登入 | 前台 Google OAuth 登入成功 |
| ECPay 付款 | 完成測試交易（信用卡 + ATM + 超商）|
| Email 發送 | 註冊/下單/付款成功各觸發對應 Email |
| Email 模板編輯 | 後台修改模板內容 + 變數表，發送結果正確 |
| 前台 RWD | 手機版 Navbar、頁面排版正常 |
| Railway 部署 | 正式環境可訪問 |
