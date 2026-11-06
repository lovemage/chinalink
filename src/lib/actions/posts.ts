'use server'

import { and, eq, ne, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import {
  media,
  posts,
  postSlugRedirects,
  postTagRelations,
  postTags,
  type PostAiSource,
  type PostFaqItem,
  type PostSource,
} from '@/lib/db/schema'
import { getAdminFromCookies } from '@/lib/auth-admin'
import { checkPost, type PostIssue } from '@/lib/posts/checks'
import { isValidSlug, resolveUniqueSlug, rewriteBlogLinks, titleToSlug } from '@/lib/posts/slug'
import { fromTaipeiInputValue } from '@/lib/posts/time'
import { parseFaq, parseSources } from '@/lib/posts/ai-assistant'
import { getSiteUrl, isPostSection } from '@/lib/posts/constants'

export type SavePostIntent = 'draft' | 'publish' | 'schedule' | 'update'

export interface SavePostPayload {
  id?: number
  title: string
  slug: string
  /** True once Tina has edited the slug herself: conflicts are reported, not auto-suffixed. */
  slugManual: boolean
  section: string
  categoryId: number | null
  coverImageUrl: string
  coverImageAlt: string
  excerpt: string
  author: string
  content: unknown
  seoTitle: string
  seoDescription: string
  focusKeyword: string
  ogTitle: string
  ogDescription: string
  ogImageUrl: string
  sources: PostSource[]
  faq: PostFaqItem[]
  relatedPostIds: number[]
  noindex: boolean
  canonicalUrl: string
  tagNames: string[]
  scheduledAt: string
  publishedAt: string
  aiSource: PostAiSource | null
}

export type SavePostResult =
  | { success: true; id: number; slug: string; status: string; url: string }
  | { error: string; issues?: PostIssue[] }

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

async function requireAdmin() {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error('UNAUTHORIZED')
  return admin
}

function isUniqueViolation(error: unknown): boolean {
  const code = (error as { code?: string; cause?: { code?: string } })
  return code?.code === '23505' || code?.cause?.code === '23505'
}

async function isSlugTaken(slug: string, ownPostId?: number): Promise<boolean> {
  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(ownPostId ? and(eq(posts.slug, slug), ne(posts.id, ownPostId)) : eq(posts.slug, slug))
    .limit(1)
  if (post) return true
  const [redirect] = await db
    .select({ postId: postSlugRedirects.postId })
    .from(postSlugRedirects)
    .where(eq(postSlugRedirects.oldSlug, slug))
    .limit(1)
  return !!redirect && redirect.postId !== ownPostId
}

/** Live slug preview for the editor. */
export async function suggestPostSlug(title: string, postId?: number): Promise<string> {
  await requireAdmin()
  const base = titleToSlug(title)
  if (!base) return ''
  return resolveUniqueSlug(base, (candidate) => isSlugTaken(candidate, postId))
}

async function findOrCreateMedia(url: string, alt: string, tx: Tx): Promise<number> {
  const existing = await tx.query.media.findFirst({ where: eq(media.url, url) })
  if (existing) return existing.id
  const [created] = await tx
    .insert(media)
    .values({ url, filename: url.split('/').pop() ?? 'image', alt: alt || null })
    .returning({ id: media.id })
  return created.id
}

async function replacePostTags(postId: number, rawNames: string[], tx: Tx) {
  const names = Array.from(new Set(rawNames.map((name) => name.trim()).filter(Boolean)))
  await tx.delete(postTagRelations).where(eq(postTagRelations.postId, postId))

  const tagIds = new Set<number>()
  for (const name of names) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
    if (!slug) continue
    const [tag] = await tx
      .insert(postTags)
      .values({ name, slug })
      .onConflictDoUpdate({ target: postTags.slug, set: { name } })
      .returning({ id: postTags.id })
    tagIds.add(tag.id)
  }
  if (tagIds.size > 0) {
    await tx
      .insert(postTagRelations)
      .values(Array.from(tagIds).map((tagId) => ({ postId, tagId })))
  }
}

/** Old address -> permanent redirect, internal links follow, no redirect chains. */
async function moveSlug(postId: number, oldSlug: string, newSlug: string, tx: Tx) {
  await tx.delete(postSlugRedirects).where(eq(postSlugRedirects.oldSlug, newSlug))
  await tx
    .insert(postSlugRedirects)
    .values({ oldSlug, postId })
    .onConflictDoUpdate({ target: postSlugRedirects.oldSlug, set: { postId } })

  const linking = await tx
    .select({ id: posts.id, content: posts.content })
    .from(posts)
    .where(
      or(
        sql`${posts.content}::text like ${`%/blog/${oldSlug}%`}`,
        sql`${posts.content}::text like ${`%/blog/${encodeURIComponent(oldSlug)}%`}`
      )
    )
  for (const row of linking) {
    const rewritten = rewriteBlogLinks(JSON.stringify(row.content), oldSlug, newSlug)
    await tx.update(posts).set({ content: JSON.parse(rewritten) }).where(eq(posts.id, row.id))
  }
}

function canonicalIsValid(url: string): boolean {
  if (!url) return true
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}

export async function savePost(
  payload: SavePostPayload,
  intent: SavePostIntent
): Promise<SavePostResult> {
  try {
    await requireAdmin()

    const title = payload.title.trim()
    if (!title) return { error: '請先填寫文章標題', issues: [{ field: 'title', message: '請填寫文章標題' }] }

    const existing = payload.id
      ? await db.query.posts.findFirst({ where: eq(posts.id, payload.id) })
      : null
    if (payload.id && !existing) return { error: '找不到這篇文章，可能已被刪除' }

    const sources = parseSources(payload.sources)
    const faq = parseFaq(payload.faq)
    const section = isPostSection(payload.section) ? payload.section : 'opinion'
    const canonicalUrl = payload.canonicalUrl.trim()
    if (!canonicalIsValid(canonicalUrl)) {
      return { error: 'canonical 必須是完整網址', issues: [{ field: 'slug', message: 'canonical 必須是完整網址' }] }
    }

    // Slug: legacy addresses stay as they are; only a new or changed slug is validated.
    let slug = payload.slug.trim()
    const slugChanged = !existing || existing.slug !== slug
    if (slugChanged) {
      if (!slug) {
        slug = titleToSlug(title)
        if (!slug) return { error: '無法由標題產生網址，請手動填寫 slug' }
      }
      if (!isValidSlug(slug)) {
        return {
          error: 'slug 只能使用小寫英文、數字與連字號',
          issues: [{ field: 'slug', message: 'slug 只能使用小寫英文、數字與連字號' }],
        }
      }
      if (payload.slugManual) {
        if (await isSlugTaken(slug, payload.id)) {
          return {
            error: `網址 ${slug} 已被使用，請換一個`,
            issues: [{ field: 'slug', message: '這個網址已被使用' }],
          }
        }
      } else {
        slug = await resolveUniqueSlug(slug, (candidate) => isSlugTaken(candidate, payload.id))
      }
    }

    const check = checkPost({
      title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      section,
      categoryId: payload.categoryId,
      coverImageUrl: payload.coverImageUrl,
      coverImageAlt: payload.coverImageAlt,
      author: payload.author,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      focusKeyword: payload.focusKeyword,
      tagCount: payload.tagNames.length,
      ogTitle: payload.ogTitle,
      ogDescription: payload.ogDescription,
      sources,
      faq,
      relatedPostIds: payload.relatedPostIds,
    })

    const now = new Date()
    const scheduledFor = fromTaipeiInputValue(payload.scheduledAt)

    if (intent === 'publish' || intent === 'schedule') {
      if (check.required.length > 0) {
        return { error: `還有 ${check.required.length} 個必填項目未完成`, issues: check.required }
      }
    }
    if (intent === 'schedule' && (!scheduledFor || scheduledFor <= now)) {
      return { error: '排程時間需晚於現在' }
    }

    const wasPublished = existing?.status === 'published'
    let status: string
    let publishedAt: Date | null = existing?.publishedAt ?? null
    let scheduledAt: Date | null = null

    switch (intent) {
      case 'publish':
        status = 'published'
        publishedAt = wasPublished ? publishedAt : now
        break
      case 'schedule':
        status = 'scheduled'
        scheduledAt = scheduledFor
        break
      case 'update':
        // Keep the current state. Existing published posts stay editable without the new checks.
        status = existing?.status ?? 'draft'
        scheduledAt = status === 'scheduled' ? (scheduledFor ?? existing?.scheduledAt ?? null) : null
        break
      default:
        status = 'draft'
    }
    if (status === 'scheduled' && intent === 'update' && check.required.length > 0) {
      return { error: `已排程文章還有 ${check.required.length} 個必填項目未完成`, issues: check.required }
    }
    if (status === 'published' && payload.publishedAt) {
      publishedAt = fromTaipeiInputValue(payload.publishedAt) ?? publishedAt
    }

    const id = await db.transaction(async (tx) => {
      const coverImageId = payload.coverImageUrl.trim()
        ? await findOrCreateMedia(payload.coverImageUrl.trim(), payload.coverImageAlt.trim(), tx)
        : null
      const values = {
        title,
        slug,
        section,
        categoryId: payload.categoryId,
        coverImageId,
        coverImageAlt: payload.coverImageAlt.trim() || null,
        excerpt: payload.excerpt.trim() || null,
        author: payload.author.trim() || '懂陸姐',
        status,
        publishedAt,
        scheduledAt,
        scheduleError: null,
        content: payload.content ?? null,
        seoTitle: payload.seoTitle.trim() || null,
        seoDescription: payload.seoDescription.trim() || null,
        focusKeyword: payload.focusKeyword.trim() || null,
        ogTitle: payload.ogTitle.trim() || null,
        ogDescription: payload.ogDescription.trim() || null,
        ogImageUrl: payload.ogImageUrl.trim() || null,
        sources,
        faq,
        relatedPostIds: payload.relatedPostIds,
        noindex: payload.noindex,
        canonicalUrl: canonicalUrl || null,
        aiSource: payload.aiSource,
        updatedAt: now,
      }

      if (existing) {
        await tx.update(posts).set(values).where(eq(posts.id, existing.id))
        // A public address that moves keeps working. Other states were never public.
        if (existing.slug !== slug && wasPublished) {
          await moveSlug(existing.id, existing.slug, slug, tx)
        }
        await replacePostTags(existing.id, payload.tagNames, tx)
        return existing.id
      }
      const [created] = await tx.insert(posts).values(values).returning({ id: posts.id })
      await replacePostTags(created.id, payload.tagNames, tx)
      return created.id
    })

    revalidatePublicPaths(id, slug)
    return { success: true, id, slug, status, url: `${getSiteUrl()}/blog/${slug}` }
  } catch (error) {
    console.error('savePost error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { error: '登入已過期，請在新分頁重新登入後再儲存，目前內容不會遺失' }
    }
    if (isUniqueViolation(error)) {
      return { error: '這個網址已被使用，請換一個', issues: [{ field: 'slug', message: '這個網址已被使用' }] }
    }
    return { error: '儲存失敗，請再試一次，目前內容不會遺失' }
  }
}

function revalidatePublicPaths(id: number, slug: string) {
  revalidatePath('/admin/posts')
  revalidatePath(`/admin/posts/${id}`)
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/observations')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
}

/** Schedule list actions: reschedule, cancel, publish now. */
export async function reschedulePost(id: number, when: string): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin()
    const scheduledAt = fromTaipeiInputValue(when)
    if (!scheduledAt || scheduledAt <= new Date()) return { error: '排程時間需晚於現在' }
    await db
      .update(posts)
      .set({ scheduledAt, scheduleError: null, updatedAt: new Date() })
      .where(and(eq(posts.id, id), eq(posts.status, 'scheduled')))
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (error) {
    console.error('reschedulePost error:', error)
    return { error: '改期失敗，請再試一次' }
  }
}

export async function cancelSchedule(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin()
    await db
      .update(posts)
      .set({ status: 'draft', scheduledAt: null, scheduleError: null, updatedAt: new Date() })
      .where(and(eq(posts.id, id), eq(posts.status, 'scheduled')))
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (error) {
    console.error('cancelSchedule error:', error)
    return { error: '取消排程失敗，請再試一次' }
  }
}

export async function publishScheduledNow(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin()
    const [row] = await db
      .select({
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        section: posts.section,
        categoryId: posts.categoryId,
        coverImageUrl: media.url,
        coverImageAlt: posts.coverImageAlt,
        author: posts.author,
      })
      .from(posts)
      .leftJoin(media, eq(posts.coverImageId, media.id))
      .where(and(eq(posts.id, id), eq(posts.status, 'scheduled')))
    if (!row) return { error: '這篇文章已不在排程中' }
    const { required } = checkPost({
      ...row,
      excerpt: row.excerpt ?? '',
      coverImageUrl: row.coverImageUrl ?? '',
      coverImageAlt: row.coverImageAlt ?? '',
      author: row.author ?? '',
      seoTitle: '',
      seoDescription: '',
      focusKeyword: '',
      tagCount: 0,
      ogTitle: '',
      ogDescription: '',
      sources: [],
      faq: [],
      relatedPostIds: [],
    })
    if (required.length > 0) return { error: required.map((issue) => issue.message).join('、') }
    const now = new Date()
    await db
      .update(posts)
      .set({ status: 'published', publishedAt: now, scheduledAt: null, scheduleError: null, updatedAt: now })
      .where(and(eq(posts.id, id), eq(posts.status, 'scheduled')))
    revalidatePublicPaths(id, row.slug)
    return { success: true }
  } catch (error) {
    console.error('publishScheduledNow error:', error)
    return { error: '發布失敗，請再試一次' }
  }
}

/** Takes a published post offline; it leaves the lists and the sitemap. */
export async function unpublishPost(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin()
    const [row] = await db
      .update(posts)
      .set({ status: 'draft', scheduledAt: null, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning({ slug: posts.slug })
    if (row) revalidatePublicPaths(id, row.slug)
    return { success: true }
  } catch (error) {
    console.error('unpublishPost error:', error)
    return { error: '下架失敗，請再試一次' }
  }
}

export async function deletePost(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin()
    await db.delete(posts).where(eq(posts.id, id))
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (err) {
    console.error('deletePost error:', err)
    return { error: '刪除文章時發生錯誤，請稍後再試' }
  }
}

