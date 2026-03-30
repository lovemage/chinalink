import { db } from '@/lib/db'
import {
  products,
  productCategories,
  media,
} from '@/lib/db/schema'
import { eq, and, ilike, desc } from 'drizzle-orm'

interface GetProductsOpts {
  search?: string
  categoryId?: number
  status?: string
}

export async function getProducts(opts: GetProductsOpts = {}) {
  const { search, categoryId, status } = opts

  const conditions = []
  if (search) conditions.push(ilike(products.title, `%${search}%`))
  if (categoryId) conditions.push(eq(products.productCategoryId, categoryId))
  if (status) conditions.push(eq(products.status, status))

  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      categoryName: productCategories.name,
      status: products.status,
      visibility: products.visibility,
      coverImageUrl: media.url,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(productCategories, eq(products.productCategoryId, productCategories.id))
    .leftJoin(media, eq(products.coverImageId, media.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt))

  return rows
}

export async function getProduct(id: number) {
  const result = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      productCategory: true,
      coverImage: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        with: {
          media: true,
        },
      },
      variants: {
        orderBy: (variants, { asc }) => [asc(variants.sortOrder)],
      },
      features: {
        orderBy: (features, { asc }) => [asc(features.sortOrder)],
      },
      tagRelations: {
        with: {
          tag: true,
        },
      },
    },
  })
  return result ?? null
}

export async function getProductCategoriesAll() {
  const rows = await db
    .select({
      id: productCategories.id,
      name: productCategories.name,
      slug: productCategories.slug,
    })
    .from(productCategories)
    .orderBy(productCategories.name)
  return rows
}

export async function getPublishedProductsWithDetails(categorySlug?: string) {
  let categoryId: number | undefined

  if (categorySlug) {
    const cat = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(eq(productCategories.slug, categorySlug))
      .limit(1)
    categoryId = cat[0]?.id
  }

  const conditions = [
    eq(products.status, 'published'),
    eq(products.visibility, 'public'),
  ]
  if (categoryId !== undefined) {
    conditions.push(eq(products.productCategoryId, categoryId))
  }

  const rows = await db.query.products.findMany({
    where: and(...conditions),
    orderBy: [desc(products.createdAt)],
    with: {
      productCategory: true,
      coverImage: true,
      variants: {
        orderBy: (variants, { asc }) => [asc(variants.sortOrder)],
      },
    },
  })
  return rows
}

export async function getPublishedProducts() {
  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      summary: products.summary,
      categoryName: productCategories.name,
      coverImageUrl: media.url,
    })
    .from(products)
    .leftJoin(productCategories, eq(products.productCategoryId, productCategories.id))
    .leftJoin(media, eq(products.coverImageId, media.id))
    .where(and(eq(products.status, 'published'), eq(products.visibility, 'public')))
    .orderBy(desc(products.createdAt))

  return rows
}

export async function getProductBySlug(slug: string) {
  const result = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      productCategory: true,
      coverImage: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        with: {
          media: true,
        },
      },
      variants: {
        orderBy: (variants, { asc }) => [asc(variants.sortOrder)],
      },
      features: {
        orderBy: (features, { asc }) => [asc(features.sortOrder)],
      },
      tagRelations: {
        with: {
          tag: true,
        },
      },
    },
  })
  return result ?? null
}
