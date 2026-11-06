import { db } from '@/lib/db'
import { posts, siteFaqs } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'

const faqFields = {
  id: siteFaqs.id,
  question: siteFaqs.question,
  answer: siteFaqs.answer,
  status: siteFaqs.status,
  sortOrder: siteFaqs.sortOrder,
  relatedPostId: siteFaqs.relatedPostId,
  relatedPostTitle: posts.title,
  relatedPostSlug: posts.slug,
  relatedPostStatus: posts.status,
}

export async function getPublishedSiteFaqs(limit?: number) {
  const query = db
    .select(faqFields)
    .from(siteFaqs)
    .leftJoin(posts, eq(siteFaqs.relatedPostId, posts.id))
    .where(eq(siteFaqs.status, 'published'))
    .orderBy(asc(siteFaqs.sortOrder), asc(siteFaqs.id))
  return limit ? query.limit(limit) : query
}

export async function getAllSiteFaqs() {
  return db
    .select(faqFields)
    .from(siteFaqs)
    .leftJoin(posts, eq(siteFaqs.relatedPostId, posts.id))
    .orderBy(asc(siteFaqs.sortOrder), asc(siteFaqs.id))
}

export type SiteFaqRow = Awaited<ReturnType<typeof getAllSiteFaqs>>[number]
