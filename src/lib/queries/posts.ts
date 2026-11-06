import { db } from '@/lib/db'
import { posts, categories, media, postSlugRedirects } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, asc, inArray, sql, count } from 'drizzle-orm'
import { isPostSection, type PostSection } from '@/lib/posts/constants'

interface GetPostsOpts {
  search?: string
  categoryId?: number
  status?: string
  section?: string
}

export async function getPosts(opts: GetPostsOpts = {}) {
  const { search, categoryId, status, section } = opts

  const conditions = []
  if (section && isPostSection(section)) conditions.push(eq(posts.section, section))
  if (search) conditions.push(ilike(posts.title, `%${search}%`))
  if (categoryId) conditions.push(eq(posts.categoryId, categoryId))
  if (status) conditions.push(eq(posts.status, status))

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      categoryId: posts.categoryId,
      categoryName: categories.name,
      section: posts.section,
      author: posts.author,
      status: posts.status,
      publishedAt: posts.publishedAt,
      scheduledAt: posts.scheduledAt,
      scheduleError: posts.scheduleError,
      createdAt: posts.createdAt,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImageUrl: media.url,
      coverImageAlt: posts.coverImageAlt,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      focusKeyword: posts.focusKeyword,
      ogTitle: posts.ogTitle,
      ogDescription: posts.ogDescription,
      sources: posts.sources,
      faq: posts.faq,
      relatedPostIds: posts.relatedPostIds,
      tagCount: sql<number>`(select count(*)::int from post_tag_relations r where r.post_id = ${posts.id})`,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverImageId, media.id))
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
      description: categories.description,
    })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
  return rows
}

const postCardFields = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  excerpt: posts.excerpt,
  author: posts.author,
  section: posts.section,
  sources: posts.sources,
  publishedAt: posts.publishedAt,
  createdAt: posts.createdAt,
  categoryName: categories.name,
  categorySlug: categories.slug,
  coverImageUrl: media.url,
  coverImageAlt: posts.coverImageAlt,
  mediaAlt: media.alt,
}

export const POSTS_PER_PAGE = 13

interface PublishedPostsOpts {
  section?: PostSection
  categorySlug?: string
  search?: string
  page?: number
  limit?: number
}

/** Public lists. Posts without a category stay visible, only a category filter narrows them. */
export async function getPublishedPostsFiltered(opts: PublishedPostsOpts = {}) {
  const { section, categorySlug, search, page = 1, limit = POSTS_PER_PAGE } = opts

  const conditions = [eq(posts.status, 'published')]
  if (section) conditions.push(eq(posts.section, section))
  if (categorySlug) conditions.push(eq(categories.slug, categorySlug))
  if (search?.trim()) {
    const q = `%${search.trim()}%`
    conditions.push(or(ilike(posts.title, q), ilike(posts.excerpt, q))!)
  }

  const [rows, [{ total }]] = await Promise.all([
    db
      .select(postCardFields)
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(media, eq(posts.coverImageId, media.id))
      .where(and(...conditions))
      .orderBy(sql`${posts.publishedAt} desc nulls last`, desc(posts.id))
      .limit(limit)
      .offset(Math.max(0, page - 1) * limit),
    db
      .select({ total: count() })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(...conditions)),
  ])

  return { posts: rows, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
}

export type PublishedPostCard = Awaited<ReturnType<typeof getPublishedPostsFiltered>>['posts'][number]

/** Posts Tina picked by hand come first, then the same category, without repeats. */
export async function getRelatedPostsFor(
  post: { id: number; categoryId: number | null; relatedPostIds: number[] },
  limit = 3
) {
  const picked = post.relatedPostIds.filter((id) => id !== post.id).slice(0, limit)
  const pickedRows = picked.length
    ? await db
        .select(postCardFields)
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .leftJoin(media, eq(posts.coverImageId, media.id))
        .where(and(eq(posts.status, 'published'), inArray(posts.id, picked)))
    : []
  const ordered = picked
    .map((id) => pickedRows.find((row) => row.id === id))
    .filter((row): row is PublishedPostCard => Boolean(row))
  if (ordered.length >= limit || !post.categoryId) return ordered

  const excluded = [post.id, ...ordered.map((row) => row.id)]
  const fill = await db
    .select(postCardFields)
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(media, eq(posts.coverImageId, media.id))
    .where(
      and(
        eq(posts.status, 'published'),
        eq(posts.categoryId, post.categoryId),
        sql`${posts.id} not in ${excluded}`
      )
    )
    .orderBy(sql`${posts.publishedAt} desc nulls last`)
    .limit(limit - ordered.length)
  return [...ordered, ...fill]
}

export async function getPublishedPostRefs() {
  return db
    .select({ id: posts.id, title: posts.title, slug: posts.slug, excerpt: posts.excerpt })
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(sql`${posts.publishedAt} desc nulls last`)
}

export async function getSlugRedirectTarget(slugCandidates: string[]) {
  if (slugCandidates.length === 0) return null
  const [row] = await db
    .select({ slug: posts.slug })
    .from(postSlugRedirects)
    .innerJoin(posts, eq(postSlugRedirects.postId, posts.id))
    .where(inArray(postSlugRedirects.oldSlug, slugCandidates))
    .limit(1)
  return row?.slug ?? null
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
