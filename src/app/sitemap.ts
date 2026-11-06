import type { MetadataRoute } from 'next'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, posts, products, services } from '@/lib/db/schema'
import { ARTICLE_CATEGORY_SLUGS, getSiteUrl } from '@/lib/posts/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  const [postRows, categoryRows, serviceRows, productRows] = await Promise.all([
    db
      .select({
        slug: posts.slug,
        section: posts.section,
        categoryId: posts.categoryId,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(and(eq(posts.status, 'published'), eq(posts.noindex, false))),
    db
      .select({ id: categories.id, slug: categories.slug })
      .from(categories)
      .where(inArray(categories.slug, [...ARTICLE_CATEGORY_SLUGS])),
    db
      .select({ slug: services.slug, updatedAt: services.updatedAt })
      .from(services)
      .where(and(eq(services.status, 'published'), eq(services.visibility, 'public'))),
    db
      .select({ slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .where(and(eq(products.status, 'published'), eq(products.visibility, 'public'))),
  ])

  // Listing pages change when their newest post does.
  const latest = (rows: { updatedAt: Date | null }[]) =>
    rows.reduce<Date | undefined>((newest, row) => {
      if (!row.updatedAt) return newest
      return !newest || row.updatedAt > newest ? row.updatedAt : newest
    }, undefined)

  const entry = (path: string, lastModified?: Date | null): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    ...(lastModified ? { lastModified } : {}),
  })

  return [
    entry('/', latest(postRows)),
    entry('/blog', latest(postRows.filter((post) => post.section === 'opinion'))),
    entry('/observations', latest(postRows.filter((post) => post.section === 'observation'))),
    entry('/questions'),
    entry('/services', latest(serviceRows)),
    entry('/supply-chain'),
    entry('/supply-chain/sihui-jade'),
    entry('/products', latest(productRows)),
    entry('/about'),
    entry('/contact'),
    entry('/privacy-policy'),
    entry('/terms-of-service'),
    ...categoryRows.map((category) =>
      entry(`/category/${category.slug}`, latest(postRows.filter((post) => post.categoryId === category.id)))
    ),
    ...postRows.map((post) => entry(`/blog/${encodeURI(post.slug)}`, post.updatedAt)),
    ...serviceRows.map((service) => entry(`/services/${service.slug}`, service.updatedAt)),
    ...productRows.map((product) => entry(`/products/${product.slug}`, product.updatedAt)),
  ]
}
