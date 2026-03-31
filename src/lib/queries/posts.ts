import { db } from '@/lib/db'
import { posts, categories, media } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, ne } from 'drizzle-orm'

interface GetPostsOpts {
  search?: string
  categoryId?: number
  status?: string
}

export async function getPosts(opts: GetPostsOpts = {}) {
  const { search, categoryId, status } = opts

  const conditions = []
  if (search) conditions.push(ilike(posts.title, `%${search}%`))
  if (categoryId) conditions.push(eq(posts.categoryId, categoryId))
  if (status) conditions.push(eq(posts.status, status))

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      categoryName: categories.name,
      author: posts.author,
      status: posts.status,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(posts.createdAt))

  return rows
}

export async function getPost(id: number) {
  const result = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      category: true,
      coverImage: true,
      tagRelations: {
        with: {
          tag: true,
        },
      },
    },
  })
  return result ?? null
}

export async function getPostCategoriesAll() {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .orderBy(categories.name)
  return rows
}

export async function getPublishedPostsFiltered(categorySlug?: string, search?: string) {
  let categoryId: number | undefined

  if (categorySlug) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1)
    categoryId = cat[0]?.id
  }

  const conditions = [eq(posts.status, 'published')]
  if (categoryId !== undefined) {
    conditions.push(eq(posts.categoryId, categoryId))
  }
  if (search?.trim()) {
    const q = `%${search.trim()}%`
    conditions.push(
      or(
        ilike(posts.title, q),
        ilike(posts.excerpt, q)
      )!
    )
  }

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      author: posts.author,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      coverImageUrl: media.url,
      coverImageAlt: media.alt,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverImageId, media.id))
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt))
    .limit(20)

  return rows
}

export async function getRelatedPosts(categoryId: number, excludePostId: number, limit = 3) {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      author: posts.author,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      coverImageUrl: media.url,
      coverImageAlt: media.alt,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverImageId, media.id))
    .where(and(
      eq(posts.status, 'published'),
      eq(posts.categoryId, categoryId),
      ne(posts.id, excludePostId),
    ))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)

  return rows
}

export async function getPublishedPosts(limit?: number) {
  const query = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      author: posts.author,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
      coverImageUrl: media.url,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverImageId, media.id))
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))

  if (limit) {
    return query.limit(limit)
  }
  return query
}

export async function getPostByCandidateSlugs(slugCandidates: string[]) {
  for (const slug of slugCandidates) {
    const result = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: {
        category: true,
        coverImage: true,
        tagRelations: {
          with: {
            tag: true,
          },
        },
      },
    })
    if (result) return result
  }
  return null
}

export async function getPostBySlug(slug: string) {
  const result = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      category: true,
      coverImage: true,
      tagRelations: {
        with: {
          tag: true,
        },
      },
    },
  })
  return result ?? null
}
