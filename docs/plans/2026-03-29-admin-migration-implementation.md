# ChinaLink 後台系統遷移 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Payload CMS with a custom-built admin dashboard using Drizzle ORM + PostgreSQL, replicating Yuxiang's admin architecture patterns.

**Architecture:** Next.js App Router admin pages under `/admin/*`, Drizzle ORM for PostgreSQL access, Server Actions for mutations, query functions for reads, JWT cookie auth, Tiptap rich text editor, Cloudinary image uploads.

**Tech Stack:** Next.js 15, Drizzle ORM, PostgreSQL (Railway), bcryptjs, JWT (jose), Tiptap, Cloudinary, Tailwind CSS

**Reference project:** `/home/aistorm/projects/Yuxiang` — replicate admin UI patterns (sidebar, tab bar, layout, form patterns)

---

## Phase 1: Foundation (Database + Auth)

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Drizzle ORM and related packages**

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
npm install bcryptjs jose
npm install -D @types/bcryptjs
```

**Step 2: Add drizzle config**

Create `drizzle.config.ts` at project root:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI!,
  },
})
```

**Step 3: Add scripts to package.json**

Add to `scripts`:
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

**Step 4: Commit**

```bash
git add package.json package-lock.json drizzle.config.ts
git commit -m "chore: add Drizzle ORM, auth dependencies and config"
```

---

### Task 2: Drizzle Schema — Core Tables

**Files:**
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/index.ts`

**Step 1: Create DB connection**

Create `src/lib/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URI!

const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })
```

**Step 2: Create schema file with all tables**

Create `src/lib/db/schema.ts` with these tables (map from current Payload collections):

- `admins` — id, username (unique), passwordHash, createdAt
- `media` — id, filename, alt, mimeType, filesize, width, height, url, thumbnailUrl, cardUrl, heroUrl, createdAt
- `categories` — id, name, slug (unique), createdAt (blog categories)
- `serviceCategories` — id, name, slug (unique), createdAt
- `productCategories` — id, name, slug (unique), createdAt
- `productTags` — id, name, slug (unique), createdAt
- `services` — id, title, slug (unique), serviceCategoryId (FK), iconName, coverImageId (FK→media), description (jsonb for Tiptap), status, visibility, pricingMode, price, basePrice, cartEnabled, seoTitle, seoDescription, createdAt, updatedAt
- `serviceAddons` — id, serviceId (FK, cascade), name, price, required, sortOrder
- `serviceFeatures` — id, serviceId (FK, cascade), text, sortOrder
- `products` — id, title, slug (unique), productCategoryId (FK), coverImageId (FK→media), summary, description (jsonb), status, visibility, seoTitle, seoDescription, createdAt, updatedAt
- `productImages` — id, productId (FK, cascade), mediaId (FK→media), sortOrder
- `productVariants` — id, productId (FK, cascade), sku, name, specs (jsonb), price, compareAtPrice, stock, isDefault, isActive, sortOrder
- `productFeatures` — id, productId (FK, cascade), text, sortOrder
- `productTagRelations` — productId (FK, cascade), tagId (FK, cascade), composite PK
- `posts` — id, title, slug (unique), categoryId (FK), coverImageId (FK→media), excerpt, author, status, publishedAt, content (jsonb), seoTitle, seoDescription, createdAt, updatedAt
- `customers` — id, name, email (unique), phone, avatar, authProvider, providerId, lastLoginAt, createdAt, updatedAt
- `orders` — id, orderNumber (unique), itemType, customerId (FK), serviceId (FK), productId (FK), productVariantSKU, productVariantName, amount, paymentMethod, paymentStatus, orderStatus, ecpayTradeNo, note, createdAt, updatedAt
- `orderItems` — id, orderId (FK, cascade), itemType, serviceId (FK), serviceName, productId (FK), productName, variantSKU, variantName, unitPrice, quantity, subtotal
- `orderSelectedAddons` — id, orderId (FK, cascade), name, price
- `inquiries` — id, itemType, customerId (FK), serviceId (FK), productId (FK), name, contactMethod, message, status, createdAt, updatedAt
- `inquiryAttachments` — id, inquiryId (FK, cascade), mediaId (FK→media)
- `siteSettings` — key (PK), value, updatedAt
- `emailTemplates` — id, name, slug (unique), subject, type, status, availableVariables (jsonb), content (jsonb), createdAt, updatedAt
- `verificationCodes` — id, email, code, expiresAt, createdAt

Use `pgTable` from `drizzle-orm/pg-core`. Use `serial` for integer PKs, `text` for strings, `integer` for numbers, `boolean` for booleans, `timestamp` for dates, `jsonb` for JSON data.

**Step 3: Generate and push schema**

```bash
npx drizzle-kit push
```

**Step 4: Commit**

```bash
git add src/lib/db/
git commit -m "feat: add Drizzle schema and DB connection for all ChinaLink tables"
```

---

### Task 3: Admin Authentication

**Files:**
- Create: `src/lib/auth-admin.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/actions.ts`
- Modify: `src/middleware.ts`

**Step 1: Create admin auth utilities**

Create `src/lib/auth-admin.ts`:
- `signAdminJWT(username)` — 24h expiry, uses `jose` library
- `verifyAdminJWT(token)` — verify and return payload or null
- `verifyAdmin(username, password)` — DB lookup + bcryptjs compare
- `getAdminFromCookies()` — read `admin_token` cookie and verify

Reference: `/home/aistorm/projects/Yuxiang/src/lib/auth-admin.ts` (adapt from D1 to Drizzle)

**Step 2: Create admin server actions**

Create `src/app/admin/actions.ts`:
- `loginAction(prevState, formData)` — validate credentials, set JWT cookie, redirect
- `logoutAction()` — clear cookie, redirect to login

**Step 3: Create login page**

Create `src/app/admin/login/page.tsx`:
- Client component with `useActionState`
- Username + password form
- Error display
- Brand styling (use ChinaLink brand colors: brand-primary `#F4845F`, brand-cta `#E11D48`)

Reference: `/home/aistorm/projects/Yuxiang/src/app/admin/login/page.tsx`

**Step 4: Update middleware**

Modify `src/middleware.ts`:
- Add matcher for `/admin/:path*`
- Check `admin_token` cookie existence
- Redirect to `/admin/login` if missing (except login page itself)
- Preserve existing Payload middleware if still present (will remove later)

**Step 5: Seed admin account**

Create a seed script or use `db:push` to insert initial admin:
```sql
INSERT INTO admins (username, password_hash) VALUES ('admin', '<bcrypt hash>');
```

**Step 6: Commit**

```bash
git add src/lib/auth-admin.ts src/app/admin/login/ src/app/admin/actions.ts src/middleware.ts
git commit -m "feat: add admin JWT authentication with login page"
```

---

### Task 4: Admin Layout + Navigation

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminTabBar.tsx`
- Create: `src/components/admin/AdminHeader.tsx`

**Step 1: Create AdminSidebar**

Desktop sidebar (hidden on mobile). Navigation items:
1. 儀表板 `/admin`
2. 服務管理 `/admin/services`
3. 商品管理 `/admin/products`
4. 文章管理 `/admin/posts`
5. 訂單管理 `/admin/orders`
6. 會員管理 `/admin/members`
7. 分類管理 `/admin/categories`
8. 站台設定 `/admin/settings`

Action buttons: View site (→ `/`), Logout

Style: dark sidebar `bg-brand-text` (#1C1917), active items use `brand-primary` (#F4845F)

Reference: `/home/aistorm/projects/Yuxiang/src/components/admin/AdminSidebar.tsx`

**Step 2: Create AdminTabBar**

Mobile bottom navigation (3 primary + more menu):
- Primary: 服務, 商品, 訂單
- More overlay: 文章, 會員, 分類, 設定, 登出

Reference: `/home/aistorm/projects/Yuxiang/src/components/admin/AdminTabBar.tsx`

**Step 3: Create AdminHeader**

Mobile top header: `ChinaLink 後台` + admin username

Reference: `/home/aistorm/projects/Yuxiang/src/components/admin/AdminHeader.tsx`

**Step 4: Create admin layout**

`src/app/admin/layout.tsx`:
- Server component
- Verify admin JWT from cookies
- If authenticated: render sidebar + header + tab bar + children
- If not authenticated (login page): render children only
- Main content padding: `md:ml-60 pb-20 md:pb-0 pt-14 md:pt-0`

Reference: `/home/aistorm/projects/Yuxiang/src/app/admin/layout.tsx`

**Step 5: Create admin dashboard placeholder**

Create `src/app/admin/page.tsx` — simple "儀表板" placeholder page

**Step 6: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat: add admin layout with responsive sidebar, tab bar and header"
```

---

## Phase 2: Shared Admin Components

### Task 5: Image Uploader (Cloudinary)

**Files:**
- Create: `src/components/admin/ImageUploader.tsx`
- Create: `src/app/api/admin/upload/route.ts`

**Step 1: Create upload API route**

POST endpoint that receives file, uploads to Cloudinary, returns URL.
Use existing Cloudinary config from current project (check `CLOUDINARY_*` env vars).

**Step 2: Create ImageUploader component**

Client component:
- Grid display of uploaded images
- File input (click/drag to upload)
- Upload to `/api/admin/upload`
- Delete button per image
- Loading states
- Returns array of image URLs

Reference: `/home/aistorm/projects/Yuxiang/src/components/admin/ImageUploader.tsx` (adapt R2→Cloudinary)

**Step 3: Commit**

```bash
git add src/components/admin/ImageUploader.tsx src/app/api/admin/upload/
git commit -m "feat: add Cloudinary image uploader component for admin"
```

---

### Task 6: Tiptap Rich Text Editor

**Files:**
- Create: `src/components/admin/TiptapEditor.tsx`

**Step 1: Install Tiptap**

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-header @tiptap/extension-table-cell @tiptap/extension-placeholder
```

**Step 2: Create TiptapEditor component**

Client component with toolbar:
- Bold, italic, heading (H2, H3), bullet list, ordered list
- Link, image (via Cloudinary upload), table
- Blockquote, code block, divider
- Outputs JSON (Tiptap native format, stored in jsonb columns)
- Accepts `content` prop (JSON) and `onChange` callback

**Step 3: Commit**

```bash
git add src/components/admin/TiptapEditor.tsx package.json package-lock.json
git commit -m "feat: add Tiptap rich text editor for admin content editing"
```

---

### Task 7: Shared Admin UI Components

**Files:**
- Create: `src/components/admin/DataTable.tsx`
- Create: `src/components/admin/AdminFormField.tsx`
- Create: `src/components/admin/StatusBadge.tsx`
- Create: `src/components/admin/AdminToast.tsx`

**Step 1: Create DataTable**

Generic table component with:
- Column definitions
- Search input
- Filter dropdowns
- Empty state
- Row click handler

**Step 2: Create form helpers**

- `AdminFormField` — label + input/select/textarea wrapper
- `StatusBadge` — colored badge for status display (draft/published, pending/paid/completed)
- `AdminToast` — toast notification provider + component

**Step 3: Commit**

```bash
git add src/components/admin/
git commit -m "feat: add shared admin UI components (DataTable, FormField, StatusBadge, Toast)"
```

---

## Phase 3: Admin Modules

### Task 8: Categories Management

**Files:**
- Create: `src/lib/queries/categories.ts`
- Create: `src/lib/actions/categories.ts`
- Create: `src/app/admin/categories/page.tsx`

**Step 1: Create query functions**

`src/lib/queries/categories.ts`:
- `getServiceCategories()` — list all service categories
- `getProductCategories()` — list all product categories
- `getBlogCategories()` — list all blog categories

**Step 2: Create server actions**

`src/lib/actions/categories.ts`:
- `createCategory(type, formData)` — create category (service/product/blog)
- `updateCategory(id, type, formData)` — update category
- `deleteCategory(id, type)` — delete category

**Step 3: Create categories admin page**

Tabbed interface: 服務分類 / 商品分類 / 文章分類
Each tab: list + inline create/edit/delete

**Step 4: Commit**

```bash
git add src/lib/queries/categories.ts src/lib/actions/categories.ts src/app/admin/categories/
git commit -m "feat: add categories management admin module"
```

---

### Task 9: Services Management

**Files:**
- Create: `src/lib/queries/services.ts`
- Create: `src/lib/actions/services.ts`
- Create: `src/app/admin/services/page.tsx`
- Create: `src/app/admin/services/new/page.tsx`
- Create: `src/app/admin/services/[id]/page.tsx`
- Create: `src/components/admin/ServiceForm.tsx`

**Step 1: Create query functions**

`src/lib/queries/services.ts`:
- `getServices(opts?)` — list with optional search/category/status filter
- `getService(id)` — full service with addons, features, cover image
- `getPublishedServices()` — for frontend use (replaces Payload query)
- `getServiceBySlug(slug)` — for frontend detail page

**Step 2: Create server actions**

`src/lib/actions/services.ts`:
- `createService(formData)` — create service + addons + features; auto-generate slug
- `updateService(formData)` — update service + addons + features
- `deleteService(id)` — delete service

**Step 3: Create ServiceForm component**

Shared form for create/edit with fields:
- Title, slug (auto-generated), category (select), icon (select)
- Cover image (ImageUploader)
- Description (TiptapEditor)
- Status (draft/published), visibility (public/private/unlisted)
- Pricing mode (fixed/addons/custom) + conditional price fields
- Addons array (name, price, required) — dynamic add/remove
- Features array (text) — dynamic add/remove
- SEO fields (title, description)
- Cart enabled toggle

**Step 4: Create admin pages**

- List page: DataTable with search, filter by category/status
- New page: ServiceForm (empty)
- Edit page: ServiceForm (pre-filled)

Reference: `/home/aistorm/projects/Yuxiang/src/app/admin/products/` pattern

**Step 5: Commit**

```bash
git add src/lib/queries/services.ts src/lib/actions/services.ts src/app/admin/services/ src/components/admin/ServiceForm.tsx
git commit -m "feat: add services management admin module with CRUD"
```

---

### Task 10: Products Management

**Files:**
- Create: `src/lib/queries/products.ts`
- Create: `src/lib/actions/products.ts`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`
- Create: `src/components/admin/ProductForm.tsx`
- Create: `src/components/admin/VariantEditor.tsx`

**Step 1: Create query and action functions**

Same pattern as services. Key differences:
- Products have variants (sku, specs, price, stock)
- Products have multiple images (not just cover)
- Products have tags (many-to-many)

**Step 2: Create VariantEditor component**

Table-style editor for product variants:
- Columns: SKU, name, price, compare price, stock, default, active
- Add/remove rows
- Specs sub-editor (key-value pairs)

Reference: `/home/aistorm/projects/Yuxiang/src/components/admin/VariationEditor.tsx`

**Step 3: Create ProductForm and admin pages**

Same pattern as services with additional variant/image/tag fields.

**Step 4: Commit**

```bash
git add src/lib/queries/products.ts src/lib/actions/products.ts src/app/admin/products/ src/components/admin/ProductForm.tsx src/components/admin/VariantEditor.tsx
git commit -m "feat: add products management admin module with variants"
```

---

### Task 11: Posts Management

**Files:**
- Create: `src/lib/queries/posts.ts`
- Create: `src/lib/actions/posts.ts`
- Create: `src/app/admin/posts/page.tsx`
- Create: `src/app/admin/posts/new/page.tsx`
- Create: `src/app/admin/posts/[id]/page.tsx`
- Create: `src/components/admin/PostForm.tsx`

**Step 1: Create query and action functions**

`src/lib/queries/posts.ts`:
- `getPosts(opts?)` — list with search/category/status
- `getPost(id)` — full post with cover image
- `getPublishedPosts(limit?)` — for frontend
- `getPostBySlug(slug)` — for frontend detail

`src/lib/actions/posts.ts`:
- `createPost(formData)` — create post; auto-slug from title
- `updatePost(formData)` — update post
- `deletePost(id)` — delete post

**Step 2: Create PostForm component**

Fields: title, slug, category, cover image, excerpt, author, status, publishedAt, content (TiptapEditor), SEO fields

**Step 3: Create admin pages**

List, new, edit — same pattern as services.

**Step 4: Commit**

```bash
git add src/lib/queries/posts.ts src/lib/actions/posts.ts src/app/admin/posts/ src/components/admin/PostForm.tsx
git commit -m "feat: add posts management admin module with rich text editing"
```

---

### Task 12: Orders Management

**Files:**
- Create: `src/lib/queries/orders.ts`
- Create: `src/lib/actions/orders.ts`
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/app/admin/orders/[id]/page.tsx`

**Step 1: Create query and action functions**

`src/lib/queries/orders.ts`:
- `getOrders(opts?)` — list with search (orderNumber, customer name), filter by status
- `getOrder(id)` — full order with items, customer, service/product details

`src/lib/actions/orders.ts`:
- `updateOrderStatus(id, status)` — update order status
- `updatePaymentStatus(id, status)` — update payment status
- `addOrderNote(id, note)` — add/update note

**Step 2: Create admin pages**

- List page: DataTable with order number, customer, amount, status, date
- Detail page: read-only order info + status controls + note editing

**Step 3: Commit**

```bash
git add src/lib/queries/orders.ts src/lib/actions/orders.ts src/app/admin/orders/
git commit -m "feat: add orders management admin module"
```

---

### Task 13: Members Management

**Files:**
- Create: `src/lib/queries/members.ts`
- Create: `src/lib/actions/members.ts`
- Create: `src/app/admin/members/page.tsx`
- Create: `src/app/admin/members/[id]/page.tsx`

**Step 1: Create query and action functions**

`src/lib/queries/members.ts`:
- `getMembers(opts?)` — list with search (name, email)
- `getMember(id)` — member detail + order history

`src/lib/actions/members.ts`:
- `updateMemberStatus(id, status)` — if needed

**Step 2: Create admin pages**

- List page: DataTable with name, email, provider, last login
- Detail page: member info + order history list

**Step 3: Commit**

```bash
git add src/lib/queries/members.ts src/lib/actions/members.ts src/app/admin/members/
git commit -m "feat: add members management admin module"
```

---

### Task 14: Site Settings + Inquiries

**Files:**
- Create: `src/lib/queries/settings.ts`
- Create: `src/lib/actions/settings.ts`
- Create: `src/lib/queries/inquiries.ts`
- Create: `src/lib/actions/inquiries.ts`
- Create: `src/app/admin/settings/page.tsx`

**Step 1: Create settings query/actions**

Key-value store pattern:
- `getSettings()` — all settings as object
- `getSetting(key)` — single setting
- `updateSettings(formData)` — bulk update settings

**Step 2: Create inquiries query/actions**

- `getInquiries(opts?)` — list with search/status filter
- `updateInquiryStatus(id, status)` — update status

**Step 3: Create settings admin page**

Tabbed: 基本設定 / 諮詢紀錄
- 基本設定: LINE URL, LINE ID, other site settings
- 諮詢紀錄: DataTable with inquiry list + status update

**Step 4: Commit**

```bash
git add src/lib/queries/settings.ts src/lib/actions/settings.ts src/lib/queries/inquiries.ts src/lib/actions/inquiries.ts src/app/admin/settings/
git commit -m "feat: add site settings and inquiries admin module"
```

---

### Task 15: Admin Dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`

**Step 1: Build dashboard with summary stats**

Query counts: total orders (+ this month), total members, total services, total products, recent orders list (last 5)

**Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add admin dashboard with summary statistics"
```

---

## Phase 4: Frontend Migration

### Task 16: Migrate Frontend Pages to Drizzle Queries

**Files to modify** (replace all `getPayload` calls with Drizzle queries):

1. `src/app/(frontend)/services/page.tsx` — use `getPublishedServices()`
2. `src/app/(frontend)/services/[slug]/page.tsx` — use `getServiceBySlug(slug)`
3. `src/app/(frontend)/products/page.tsx` — use `getPublishedProducts()`
4. `src/app/(frontend)/products/[slug]/page.tsx` — use `getProductBySlug(slug)`
5. `src/app/(frontend)/blog/page.tsx` — use `getPublishedPosts()`
6. `src/app/(frontend)/blog/[slug]/page.tsx` — use `getPostBySlug(slug)`
7. `src/components/home/ServiceOverview.tsx` — use `getPublishedServices()`
8. `src/components/home/LatestPosts.tsx` — use `getPublishedPosts(limit)`
9. `src/app/(frontend)/service-cart/page.tsx` — use Drizzle queries
10. `src/app/api/service-cart/route.ts` — use Drizzle queries
11. `src/app/api/checkout/route.ts` — use Drizzle queries
12. `src/app/api/orders/[orderId]/route.ts` — use Drizzle queries
13. `src/app/api/contact/route.ts` — use Drizzle actions
14. `src/app/api/inquiries/route.ts` — use Drizzle actions
15. `src/app/api/ecpay/notify/route.ts` — use Drizzle actions
16. `src/lib/auth/auth.config.ts` — use Drizzle for customer lookup
17. `src/lib/resend/renderTemplate.tsx` — use Drizzle for email template lookup

**Step 1: Migrate frontend pages one by one**

For each file:
- Remove `import { getPayload } from 'payload'` and `import configPromise from '@payload-config'`
- Import from `src/lib/queries/*`
- Replace `payload.find()` / `payload.findByID()` calls with Drizzle query functions
- Ensure returned data shape matches what components expect (may need field mapping)

**Step 2: Migrate API routes**

Same pattern — replace Payload operations with Drizzle queries/actions.

**Step 3: Migrate BlockRenderer**

The `BlockRenderer` component currently renders Payload's Lexical block format. It needs to be updated to render Tiptap JSON format for new content, while maintaining backwards compatibility with existing Lexical content during transition.

**Step 4: Commit after each batch**

```bash
git commit -m "feat: migrate frontend service pages from Payload to Drizzle"
git commit -m "feat: migrate frontend product pages from Payload to Drizzle"
git commit -m "feat: migrate frontend blog pages from Payload to Drizzle"
git commit -m "feat: migrate API routes from Payload to Drizzle"
```

---

### Task 17: Data Migration Script

**Files:**
- Create: `scripts/migrate-data.ts`

**Step 1: Write migration script**

Script that reads existing Payload PostgreSQL tables and inserts into new Drizzle tables:
- Read from Payload's auto-generated tables (e.g., `services`, `posts`, `products`, etc.)
- Transform data to match new schema
- Insert into new tables
- Handle relationships (category IDs, media references)
- Convert Lexical JSON content to Tiptap JSON (or keep as-is with dual renderer)

**Step 2: Run migration**

```bash
npx tsx scripts/migrate-data.ts
```

**Step 3: Commit**

```bash
git add scripts/migrate-data.ts
git commit -m "feat: add data migration script from Payload tables to Drizzle tables"
```

---

## Phase 5: Cleanup

### Task 18: Remove Payload CMS

**Files to remove/modify:**
- Remove: `src/payload.config.ts`
- Remove: `src/payload-types.ts`
- Remove: `src/collections/` (entire directory)
- Remove: `src/globals/` (if exists)
- Remove: `src/seed/` (Payload seeders)
- Remove: `src/app/(payload)/` (Payload admin routes)
- Remove: `src/emails/` (Payload email templates — replaced by Drizzle)
- Modify: `next.config.mjs` — remove `withPayload()` wrapper
- Modify: `package.json` — remove all `@payloadcms/*` and `payload` dependencies

**Step 1: Remove Payload config and collections**

**Step 2: Remove Payload from next.config**

**Step 3: Uninstall Payload packages**

```bash
npm uninstall payload @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/next @payloadcms/plugin-cloud-storage @payloadcms/storage-cloudinary
```

**Step 4: Clean up imports**

Search entire codebase for any remaining `payload` imports and remove.

**Step 5: Verify build**

```bash
npx next build
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove Payload CMS — migration to custom admin complete"
```

---

## Execution Order Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1–4 | Foundation: Drizzle + Auth + Admin Layout |
| 2 | 5–7 | Shared Components: ImageUploader, Tiptap, DataTable |
| 3 | 8–15 | Admin Modules: Categories, Services, Products, Posts, Orders, Members, Settings, Dashboard |
| 4 | 16–17 | Frontend Migration: Replace Payload queries + Data migration |
| 5 | 18 | Cleanup: Remove Payload CMS |

**Critical path:** Tasks 1→2→3→4 must be sequential. Tasks 8–15 can be parallelized. Task 16 depends on 8–15. Task 18 depends on everything else.
