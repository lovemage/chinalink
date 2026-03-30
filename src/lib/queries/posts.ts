import { db } from '@/lib/db'
import { posts, categories, media } from '@/lib/db/schema'
import { eq, and, ilike, desc } from 'drizzle-orm'

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
    },
  })
  return result ?? null
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

export async function getPostBySlug(slug: string) {
  const result = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      category: true,
      coverImage: true,
    },
  })
  return result ?? null
}
