/**
 * Data Migration Script: Payload CMS Tables → Drizzle Tables
 *
 * Usage:
 *   DATABASE_URI=postgresql://... npx tsx src/scripts/migrate-data.ts
 *
 * This script:
 *   1. Inspects which Payload tables exist in the public schema
 *   2. Reads data from each Payload table using raw SQL
 *   3. Inserts into Drizzle-managed tables using onConflictDoNothing (idempotent)
 *
 * NOTES:
 *   - Both Payload and Drizzle tables share the SAME PostgreSQL database (Railway)
 *   - Payload stores relation arrays in separate "_rels" or "<table>_<field>" tables
 *   - Run after `pnpm db:migrate` (Drizzle tables must already exist)
 *   - Safe to run multiple times — inserts are skipped if row already exists
 */

import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../lib/db/schema'
import bcrypt from 'bcryptjs'

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------
const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.error('ERROR: DATABASE_URI environment variable is required')
  process.exit(1)
}

const sql = postgres(connectionString, { prepare: false })
const db = drizzle(sql, { schema })

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return the set of existing table names in the public schema */
async function getExistingTables(): Promise<Set<string>> {
  const rows = await sql<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `
  return new Set(rows.map((r) => r.table_name))
}

/** Return all columns of a table so we can do safe field mapping */
async function getTableColumns(tableName: string): Promise<Set<string>> {
  const rows = await sql<{ column_name: string }[]>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${tableName}
  `
  return new Set(rows.map((r) => r.column_name))
}

/** Read all rows from a Payload table.  Returns [] if table does not exist. */
async function readAll<T extends Record<string, unknown>>(
  tables: Set<string>,
  tableName: string
): Promise<T[]> {
  if (!tables.has(tableName)) {
    console.warn(`  [skip] Payload table "${tableName}" not found`)
    return []
  }
  // sql template tag does not allow dynamic identifiers — use unsafe()
  const rows = await sql.unsafe(`SELECT * FROM "${tableName}"`)
  return rows as T[]
}

/** Parse a Payload rich-text/JSON field that may already be an object or a JSON string */
function parseJson(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
  return null
}

/** Coerce a value to an integer, returning null if not numeric */
function toInt(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const n = Number(value)
  return isNaN(n) ? null : Math.round(n)
}

/** Coerce a value to boolean */
function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (value === 1 || value === '1' || value === 'true') return true
  return false
}

/** Convert a Payload "status" field (published/draft) to our convention */
function mapStatus(value: unknown): string {
  const s = String(value ?? 'draft').toLowerCase()
  if (s === 'published') return 'published'
  return 'draft'
}

// ---------------------------------------------------------------------------
// Individual migration functions
// ---------------------------------------------------------------------------

async function migrateAdmins(): Promise<void> {
  console.log('\n[1] Seeding default admin...')
  const hash = await bcrypt.hash('admin123', 10)
  await db
    .insert(schema.admins)
    .values({ username: 'admin', passwordHash: hash })
    .onConflictDoNothing()
  console.log('    ✓ admin / admin123 seeded (or already exists)')
}

async function migrateMedia(tables: Set<string>): Promise<void> {
  console.log('\n[2] Migrating media...')
  const rows = await readAll<Record<string, unknown>>(tables, 'media')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.media)
        .values({
          id: toInt(row.id) ?? undefined,
          filename: String(row.filename ?? row.url ?? ''),
          alt: row.alt ? String(row.alt) : null,
          mimeType: row.mime_type ? String(row.mime_type) : null,
          filesize: toInt(row.filesize),
          width: toInt(row.width),
          height: toInt(row.height),
          url: String(row.url ?? ''),
          thumbnailUrl: row.thumbnail_u_r_l
            ? String(row.thumbnail_u_r_l)
            : row.thumbnailURL
              ? String(row.thumbnailURL)
              : null,
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] media id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} media rows inserted`)
}

async function migrateCategories(tables: Set<string>): Promise<void> {
  console.log('\n[3] Migrating blog categories...')
  const rows = await readAll<Record<string, unknown>>(tables, 'categories')
  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.categories)
        .values({
          id: toInt(row.id) ?? undefined,
          name: String(row.name ?? row.title ?? ''),
          slug: String(row.slug ?? ''),
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] category id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} blog categories inserted`)
}

async function migrateServiceCategories(tables: Set<string>): Promise<void> {
  console.log('\n[4] Migrating service_categories...')
  const rows = await readAll<Record<string, unknown>>(tables, 'service_categories')
  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.serviceCategories)
        .values({
          id: toInt(row.id) ?? undefined,
          name: String(row.name ?? row.title ?? ''),
          slug: String(row.slug ?? ''),
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] service_category id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} service_categories inserted`)
}

async function migrateProductCategories(tables: Set<string>): Promise<void> {
  console.log('\n[5] Migrating product_categories...')
  const rows = await readAll<Record<string, unknown>>(tables, 'product_categories')
  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.productCategories)
        .values({
          id: toInt(row.id) ?? undefined,
          name: String(row.name ?? row.title ?? ''),
          slug: String(row.slug ?? ''),
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] product_category id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} product_categories inserted`)
}

async function migrateProductTags(tables: Set<string>): Promise<void> {
  console.log('\n[6] Migrating product_tags...')
  const rows = await readAll<Record<string, unknown>>(tables, 'product_tags')
  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.productTags)
        .values({
          id: toInt(row.id) ?? undefined,
          name: String(row.name ?? row.title ?? ''),
          slug: String(row.slug ?? ''),
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] product_tag id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} product_tags inserted`)
}

async function migrateServices(tables: Set<string>): Promise<void> {
  console.log('\n[7] Migrating services...')
  const rows = await readAll<Record<string, unknown>>(tables, 'services')
  if (rows.length === 0) return

  // Detect Payload column names vs our schema column names
  const cols = await getTableColumns('services')
  let inserted = 0

  for (const row of rows) {
    try {
      await db
        .insert(schema.services)
        .values({
          id: toInt(row.id) ?? undefined,
          title: String(row.title ?? ''),
          slug: String(row.slug ?? ''),
          serviceCategoryId: toInt(
            row.service_category_id ?? row.serviceCategoryId ?? row.category_id
          ),
          iconName: row.icon_name
            ? String(row.icon_name)
            : row.iconName
              ? String(row.iconName)
              : 'handshake',
          coverImageId: toInt(row.cover_image_id ?? row.coverImageId ?? row.image_id),
          description: parseJson(row.description ?? row.content),
          status: mapStatus(row.status ?? row._status),
          visibility: String(row.visibility ?? 'public'),
          pricingMode: String(row.pricing_mode ?? row.pricingMode ?? 'fixed'),
          price: toInt(row.price),
          basePrice: toInt(row.base_price ?? row.basePrice),
          cartEnabled: toBool(row.cart_enabled ?? row.cartEnabled ?? true),
          seoTitle: row.seo_title ? String(row.seo_title) : null,
          seoDescription: row.seo_description ? String(row.seo_description) : null,
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] service id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} services inserted`)

  // --- service_addons ---
  // Payload may store addons in a relation table named "services_addons" or "services_addons"
  await migrateServiceAddons(tables)

  // --- service_features ---
  await migrateServiceFeatures(tables)
}

async function migrateServiceAddons(tables: Set<string>): Promise<void> {
  // Payload naming candidates: services_addons, service_addons, services_blocks_addons
  const candidates = ['service_addons', 'services_addons', 'services_blocks_add_ons']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No service_addons source table found — skipping addons migration')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const serviceId = toInt(row.service_id ?? row.parent_id ?? row._parent_id)
    if (!serviceId) continue
    try {
      await db
        .insert(schema.serviceAddons)
        .values({
          id: toInt(row.id) ?? undefined,
          serviceId,
          name: String(row.name ?? ''),
          price: toInt(row.price) ?? 0,
          required: toBool(row.required),
          sortOrder: toInt(row._order ?? row.sort_order ?? row.order) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] service_addon id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} service_addons inserted (from "${sourceTable}")`)
}

async function migrateServiceFeatures(tables: Set<string>): Promise<void> {
  const candidates = ['service_features', 'services_features', 'services_blocks_features']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No service_features source table found — skipping features migration')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const serviceId = toInt(row.service_id ?? row.parent_id ?? row._parent_id)
    if (!serviceId) continue
    try {
      await db
        .insert(schema.serviceFeatures)
        .values({
          id: toInt(row.id) ?? undefined,
          serviceId,
          text: String(row.text ?? row.feature ?? row.value ?? ''),
          sortOrder: toInt(row._order ?? row.sort_order ?? row.order) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] service_feature id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(
    `    ✓ ${inserted}/${rows.length} service_features inserted (from "${sourceTable}")`
  )
}

async function migrateProducts(tables: Set<string>): Promise<void> {
  console.log('\n[8] Migrating products...')
  const rows = await readAll<Record<string, unknown>>(tables, 'products')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.products)
        .values({
          id: toInt(row.id) ?? undefined,
          title: String(row.title ?? ''),
          slug: String(row.slug ?? ''),
          productCategoryId: toInt(
            row.product_category_id ?? row.productCategoryId ?? row.category_id
          ),
          coverImageId: toInt(row.cover_image_id ?? row.coverImageId ?? row.image_id),
          summary: row.summary ? String(row.summary) : null,
          description: parseJson(row.description ?? row.content),
          status: mapStatus(row.status ?? row._status),
          visibility: String(row.visibility ?? 'public'),
          seoTitle: row.seo_title ? String(row.seo_title) : null,
          seoDescription: row.seo_description ? String(row.seo_description) : null,
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] product id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} products inserted`)

  await migrateProductVariants(tables)
  await migrateProductImages(tables)
  await migrateProductFeatures(tables)
  await migrateProductTagRelations(tables)
}

async function migrateProductVariants(tables: Set<string>): Promise<void> {
  const candidates = ['product_variants', 'products_variants']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No product_variants source table found')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const productId = toInt(row.product_id ?? row.parent_id ?? row._parent_id)
    if (!productId) continue
    try {
      await db
        .insert(schema.productVariants)
        .values({
          id: toInt(row.id) ?? undefined,
          productId,
          sku: String(row.sku ?? row.id ?? ''),
          name: String(row.name ?? row.title ?? ''),
          specs: parseJson(row.specs ?? row.attributes),
          price: toInt(row.price) ?? 0,
          compareAtPrice: toInt(row.compare_at_price ?? row.compareAtPrice),
          stock: toInt(row.stock ?? row.inventory) ?? 0,
          isDefault: toBool(row.is_default ?? row.isDefault),
          isActive: toBool(row.is_active ?? row.isActive ?? true),
          sortOrder: toInt(row._order ?? row.sort_order ?? row.order) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] product_variant id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} product_variants inserted (from "${sourceTable}")`)
}

async function migrateProductImages(tables: Set<string>): Promise<void> {
  const candidates = ['product_images', 'products_images', 'products_gallery']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No product_images source table found')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const productId = toInt(row.product_id ?? row.parent_id ?? row._parent_id)
    const mediaId = toInt(row.media_id ?? row.image_id ?? row.value)
    if (!productId || !mediaId) continue
    try {
      await db
        .insert(schema.productImages)
        .values({
          id: toInt(row.id) ?? undefined,
          productId,
          mediaId,
          sortOrder: toInt(row._order ?? row.sort_order ?? row.order) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] product_image id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} product_images inserted (from "${sourceTable}")`)
}

async function migrateProductFeatures(tables: Set<string>): Promise<void> {
  const candidates = ['product_features', 'products_features']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No product_features source table found')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const productId = toInt(row.product_id ?? row.parent_id ?? row._parent_id)
    if (!productId) continue
    try {
      await db
        .insert(schema.productFeatures)
        .values({
          id: toInt(row.id) ?? undefined,
          productId,
          text: String(row.text ?? row.feature ?? row.value ?? ''),
          sortOrder: toInt(row._order ?? row.sort_order ?? row.order) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] product_feature id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} product_features inserted (from "${sourceTable}")`)
}

async function migrateProductTagRelations(tables: Set<string>): Promise<void> {
  // Payload stores many-to-many tags in a _rels table or a dedicated join table
  const candidates = [
    'product_tag_relations',
    'products_tags',
    'products_rels',
  ]
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No product_tag_relations source table found')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const productId = toInt(row.product_id ?? row.parent_id ?? row._parent_id)
    // _rels table uses "value" for the related id and "path" for the field name
    const tagId = toInt(row.tag_id ?? row.tags_id ?? row.value)
    if (!productId || !tagId) continue
    // Skip _rels rows that are not tag relations
    if (row.path && !String(row.path).includes('tag')) continue
    try {
      await db
        .insert(schema.productTagRelations)
        .values({ productId, tagId })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(
        `    [warn] product_tag_relation product=${productId} tag=${tagId}:`,
        (err as Error).message
      )
    }
  }
  console.log(
    `    ✓ ${inserted}/${rows.length} product_tag_relations inserted (from "${sourceTable}")`
  )
}

async function migratePosts(tables: Set<string>): Promise<void> {
  console.log('\n[9] Migrating posts...')
  const rows = await readAll<Record<string, unknown>>(tables, 'posts')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.posts)
        .values({
          id: toInt(row.id) ?? undefined,
          title: String(row.title ?? ''),
          slug: String(row.slug ?? ''),
          categoryId: toInt(row.category_id ?? row.categoryId),
          coverImageId: toInt(row.cover_image_id ?? row.coverImageId ?? row.hero_image_id),
          excerpt: row.excerpt ? String(row.excerpt) : null,
          author: row.author ? String(row.author) : '懂陸姐',
          status: mapStatus(row.status ?? row._status),
          publishedAt: row.published_at
            ? new Date(String(row.published_at))
            : row.publishedAt
              ? new Date(String(row.publishedAt))
              : null,
          content: parseJson(row.content ?? row.rich_text),
          seoTitle: row.seo_title ? String(row.seo_title) : null,
          seoDescription: row.seo_description ? String(row.seo_description) : null,
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] post id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} posts inserted`)
}

async function migrateCustomers(tables: Set<string>): Promise<void> {
  console.log('\n[10] Migrating customers...')
  const rows = await readAll<Record<string, unknown>>(tables, 'customers')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.customers)
        .values({
          id: toInt(row.id) ?? undefined,
          name: String(row.name ?? ''),
          email: String(row.email ?? ''),
          phone: row.phone ? String(row.phone) : null,
          avatar: row.avatar ? String(row.avatar) : null,
          authProvider: String(row.auth_provider ?? row.authProvider ?? 'email'),
          providerId: String(row.provider_id ?? row.providerId ?? row.id ?? ''),
          lastLoginAt: row.last_login_at
            ? new Date(String(row.last_login_at))
            : row.lastLoginAt
              ? new Date(String(row.lastLoginAt))
              : null,
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] customer id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} customers inserted`)
}

async function migrateOrders(tables: Set<string>): Promise<void> {
  console.log('\n[11] Migrating orders...')
  const rows = await readAll<Record<string, unknown>>(tables, 'orders')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.orders)
        .values({
          id: toInt(row.id) ?? undefined,
          orderNumber: String(row.order_number ?? row.orderNumber ?? row.id ?? ''),
          itemType: String(row.item_type ?? row.itemType ?? 'service'),
          customerId: toInt(row.customer_id ?? row.customerId),
          serviceId: toInt(row.service_id ?? row.serviceId),
          productId: toInt(row.product_id ?? row.productId),
          productVariantSKU: row.product_variant_sku
            ? String(row.product_variant_sku)
            : row.productVariantSKU
              ? String(row.productVariantSKU)
              : null,
          productVariantName: row.product_variant_name
            ? String(row.product_variant_name)
            : row.productVariantName
              ? String(row.productVariantName)
              : null,
          amount: toInt(row.amount ?? row.total) ?? 0,
          paymentMethod: row.payment_method
            ? String(row.payment_method)
            : row.paymentMethod
              ? String(row.paymentMethod)
              : null,
          paymentStatus: String(row.payment_status ?? row.paymentStatus ?? 'pending'),
          orderStatus: String(row.order_status ?? row.orderStatus ?? row.status ?? 'pending'),
          ecpayTradeNo: row.ecpay_trade_no
            ? String(row.ecpay_trade_no)
            : row.ecpayTradeNo
              ? String(row.ecpayTradeNo)
              : null,
          note: row.note ? String(row.note) : null,
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] order id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} orders inserted`)

  await migrateOrderItems(tables)
  await migrateOrderSelectedAddons(tables)
}

async function migrateOrderItems(tables: Set<string>): Promise<void> {
  const candidates = ['order_items', 'orders_items']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No order_items source table found')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const orderId = toInt(row.order_id ?? row.parent_id ?? row._parent_id)
    if (!orderId) continue
    try {
      await db
        .insert(schema.orderItems)
        .values({
          id: toInt(row.id) ?? undefined,
          orderId,
          itemType: String(row.item_type ?? row.itemType ?? 'service'),
          serviceId: toInt(row.service_id ?? row.serviceId),
          serviceName: row.service_name ? String(row.service_name) : null,
          productId: toInt(row.product_id ?? row.productId),
          productName: row.product_name ? String(row.product_name) : null,
          variantSKU: row.variant_sku ? String(row.variant_sku) : null,
          variantName: row.variant_name ? String(row.variant_name) : null,
          unitPrice: toInt(row.unit_price ?? row.price) ?? 0,
          quantity: toInt(row.quantity ?? row.qty) ?? 1,
          subtotal: toInt(row.subtotal ?? row.total) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] order_item id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} order_items inserted (from "${sourceTable}")`)
}

async function migrateOrderSelectedAddons(tables: Set<string>): Promise<void> {
  const candidates = ['order_selected_addons', 'orders_selected_addons']
  let sourceTable: string | null = null
  for (const t of candidates) {
    if (tables.has(t)) { sourceTable = t; break }
  }

  if (!sourceTable) {
    console.warn('    [skip] No order_selected_addons source table found')
    return
  }

  const rows = await readAll<Record<string, unknown>>(tables, sourceTable)
  let inserted = 0
  for (const row of rows) {
    const orderId = toInt(row.order_id ?? row.parent_id ?? row._parent_id)
    if (!orderId) continue
    try {
      await db
        .insert(schema.orderSelectedAddons)
        .values({
          id: toInt(row.id) ?? undefined,
          orderId,
          name: String(row.name ?? ''),
          price: toInt(row.price) ?? 0,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] order_selected_addon id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(
    `    ✓ ${inserted}/${rows.length} order_selected_addons inserted (from "${sourceTable}")`
  )
}

async function migrateInquiries(tables: Set<string>): Promise<void> {
  console.log('\n[12] Migrating inquiries...')
  const rows = await readAll<Record<string, unknown>>(tables, 'inquiries')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.inquiries)
        .values({
          id: toInt(row.id) ?? undefined,
          itemType: String(row.item_type ?? row.itemType ?? 'service'),
          customerId: toInt(row.customer_id ?? row.customerId),
          serviceId: toInt(row.service_id ?? row.serviceId),
          productId: toInt(row.product_id ?? row.productId),
          name: String(row.name ?? ''),
          contactMethod: String(row.contact_method ?? row.contactMethod ?? row.email ?? ''),
          message: String(row.message ?? ''),
          status: String(row.status ?? 'new'),
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] inquiry id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} inquiries inserted`)
}

async function migrateSiteSettings(tables: Set<string>): Promise<void> {
  console.log('\n[13] Migrating site_settings...')
  const rows = await readAll<Record<string, unknown>>(tables, 'site_settings')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    // Payload's globals may flatten settings into a single row; detect which shape we have
    // Shape A: rows have "key" + "value" columns (matches our schema directly)
    // Shape B: a single-row global with named columns — flatten into key/value pairs
    const hasKey = 'key' in row && 'value' in row
    if (hasKey) {
      try {
        await db
          .insert(schema.siteSettings)
          .values({
            key: String(row.key),
            value: row.value !== null ? String(row.value) : null,
            updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
          })
          .onConflictDoNothing()
        inserted++
      } catch (err) {
        console.warn(`    [warn] site_settings key=${row.key}:`, (err as Error).message)
      }
    } else {
      // Flatten single-row global into key/value pairs — skip internal Payload fields
      const skipColumns = new Set(['id', 'created_at', 'updated_at', '_status', 'global_type'])
      for (const [key, value] of Object.entries(row)) {
        if (skipColumns.has(key)) continue
        try {
          await db
            .insert(schema.siteSettings)
            .values({
              key,
              value: value !== null && value !== undefined ? String(value) : null,
              updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
            })
            .onConflictDoNothing()
          inserted++
        } catch (err) {
          console.warn(`    [warn] site_settings key=${key}:`, (err as Error).message)
        }
      }
    }
  }
  console.log(`    ✓ ${inserted} site_settings entries inserted`)
}

async function migrateEmailTemplates(tables: Set<string>): Promise<void> {
  console.log('\n[14] Migrating email_templates...')
  const rows = await readAll<Record<string, unknown>>(tables, 'email_templates')
  if (rows.length === 0) return

  let inserted = 0
  for (const row of rows) {
    try {
      await db
        .insert(schema.emailTemplates)
        .values({
          id: toInt(row.id) ?? undefined,
          name: String(row.name ?? row.title ?? ''),
          slug: String(row.slug ?? ''),
          subject: String(row.subject ?? ''),
          type: String(row.type ?? 'system'),
          status: String(row.status ?? 'active'),
          availableVariables: parseJson(row.available_variables ?? row.availableVariables),
          content: parseJson(row.content ?? row.body ?? row.html),
          createdAt: row.created_at ? new Date(String(row.created_at)) : undefined,
          updatedAt: row.updated_at ? new Date(String(row.updated_at)) : undefined,
        })
        .onConflictDoNothing()
      inserted++
    } catch (err) {
      console.warn(`    [warn] email_template id=${row.id}:`, (err as Error).message)
    }
  }
  console.log(`    ✓ ${inserted}/${rows.length} email_templates inserted`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function migrate(): Promise<void> {
  console.log('========================================')
  console.log('  ChinaLink: Payload → Drizzle Migration')
  console.log('========================================')

  // Step 0: Discover existing tables
  console.log('\n[0] Discovering tables in public schema...')
  const tables = await getExistingTables()
  console.log(`    Found ${tables.size} tables:`)
  for (const t of [...tables].sort()) {
    console.log(`      - ${t}`)
  }

  // Run migrations in dependency order
  await migrateAdmins()
  await migrateMedia(tables)
  await migrateCategories(tables)
  await migrateServiceCategories(tables)
  await migrateProductCategories(tables)
  await migrateProductTags(tables)
  // services depends on service_categories + media
  await migrateServices(tables)
  // products depends on product_categories + media
  await migrateProducts(tables)
  // posts depends on categories + media
  await migratePosts(tables)
  // customers has no deps
  await migrateCustomers(tables)
  // orders depends on customers + services + products
  await migrateOrders(tables)
  // inquiries depends on customers + services + products
  await migrateInquiries(tables)
  // standalone
  await migrateSiteSettings(tables)
  await migrateEmailTemplates(tables)

  console.log('\n========================================')
  console.log('  Migration complete!')
  console.log('========================================\n')

  await sql.end()
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
