import { and, eq, lte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { media, posts } from '@/lib/db/schema'
import { checkPost } from './checks'

/**
 * Publishes every scheduled post that is due. Each post's update is conditional on it
 * still being scheduled, so overlapping runs or replicas cannot publish twice.
 * A post that no longer passes the check stays scheduled and records why.
 */
export async function publishDueScheduledPosts(now = new Date()) {
  const due = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      section: posts.section,
      categoryId: posts.categoryId,
      coverImageUrl: media.url,
      coverImageAlt: posts.coverImageAlt,
      author: posts.author,
      scheduledAt: posts.scheduledAt,
    })
    .from(posts)
    .leftJoin(media, eq(posts.coverImageId, media.id))
    .where(and(eq(posts.status, 'scheduled'), lte(posts.scheduledAt, now)))

  const published: number[] = []
  const failed: { id: number; error: string }[] = []

  for (const post of due) {
    try {
      const { required } = checkPost({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        content: post.content,
        section: post.section,
        categoryId: post.categoryId,
        coverImageUrl: post.coverImageUrl ?? '',
        coverImageAlt: post.coverImageAlt ?? '',
        author: post.author ?? '',
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
      if (required.length > 0) {
        throw new Error(required.map((issue) => issue.message).join('、'))
      }
      const [row] = await db
        .update(posts)
        .set({
          status: 'published',
          publishedAt: post.scheduledAt ?? now,
          scheduledAt: null,
          scheduleError: null,
          updatedAt: now,
        })
        .where(and(eq(posts.id, post.id), eq(posts.status, 'scheduled')))
        .returning({ id: posts.id })
      if (row) published.push(row.id)
    } catch (error) {
      const message = error instanceof Error ? error.message : '排程發布失敗'
      failed.push({ id: post.id, error: message })
      console.error(`[schedule] post ${post.id} not published:`, message)
      await db.update(posts).set({ scheduleError: message }).where(eq(posts.id, post.id))
    }
  }

  return { published, failed }
}

