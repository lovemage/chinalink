import { and, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  categories,
  memberAiChatMessages,
  postTagRelations,
  postTags,
  posts,
  products,
  services,
  type PostFaqItem,
} from '@/lib/db/schema'
import { keepNewestMessages } from '@/lib/ai-chat/history'
import { getSettings } from '@/lib/queries/settings'
import { getPublishedSiteFaqs } from '@/lib/queries/site-faqs'
import { POST_SECTIONS, getSiteUrl, isPostSection } from '@/lib/posts/constants'
import { formatDateline } from '@/lib/posts/time'
import { tiptapPlainText } from '@/lib/posts/tiptap'

export interface AiChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  createdAt: Date | null
}

export async function getMemberAiMessages(memberId: number, limit = 20): Promise<AiChatMessage[]> {
  const rows = await db
    .select({
      id: memberAiChatMessages.id,
      role: memberAiChatMessages.role,
      content: memberAiChatMessages.content,
      createdAt: memberAiChatMessages.createdAt,
    })
    .from(memberAiChatMessages)
    .where(eq(memberAiChatMessages.memberId, memberId))
    .orderBy(desc(memberAiChatMessages.createdAt), desc(memberAiChatMessages.id))
    .limit(limit)

  return rows.reverse() as AiChatMessage[]
}

export async function appendMemberAiMessage(
  memberId: number,
  role: 'user' | 'assistant',
  content: string,
): Promise<void> {
  await db.insert(memberAiChatMessages).values({
    memberId,
    role,
    content,
  })
}

export async function pruneMemberAiMessages(memberId: number, limit = 20): Promise<void> {
  const rows = await db
    .select({ id: memberAiChatMessages.id })
    .from(memberAiChatMessages)
    .where(eq(memberAiChatMessages.memberId, memberId))
    .orderBy(desc(memberAiChatMessages.createdAt), desc(memberAiChatMessages.id))

  const { removeIds } = keepNewestMessages(rows, limit)
  if (!removeIds.length) return

  await db
    .delete(memberAiChatMessages)
    .where(
      and(
        eq(memberAiChatMessages.memberId, memberId),
        inArray(memberAiChatMessages.id, removeIds),
      ),
    )
}

export async function getAiPublicConfig() {
  const settings = await getSettings()
  return {
    enabled: settings.aiAgentEnabled,
    lineOfficialUrl: settings.lineOfficialUrl,
    lineOfficialId: settings.lineOfficialId,
    whatsappUrl: settings.whatsappUrl,
  }
}

export async function getAiServerConfig() {
  const settings = await getSettings()
  return {
    enabled: settings.aiAgentEnabled,
    apiKey: settings.openrouterApiKey,
    model: settings.openrouterModel || 'openai/gpt-4.1-mini',
    systemPrompt: settings.systemPrompt || '',
    prompt: settings.aiAgentPrompt || '',
    lineOfficialUrl: settings.lineOfficialUrl,
    lineOfficialId: settings.lineOfficialId,
    whatsappUrl: settings.whatsappUrl,
  }
}

export interface AiPostDoc {
  id: number
  title: string
  url: string
  section: string
  category: string
  date: string
  excerpt: string
  sources: string[]
  /** Used for ranking only. */
  summary: string
  body: string
  faq: PostFaqItem[]
}

export interface AiContextSnapshot {
  posts: AiPostDoc[]
  siteFaqs: Array<{ question: string; answer: string; relatedUrl: string | null }>
  services: Array<{ title: string; url: string }>
  products: Array<{ title: string; url: string }>
}

/** Everything the assistant may cite: published articles, 問題與交流, services and products. */
export async function getAiContextSnapshot(): Promise<AiContextSnapshot> {
  const base = getSiteUrl()
  const [postRows, tagRows, faqRows, serviceRows, productRows] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        section: posts.section,
        categoryName: categories.name,
        excerpt: posts.excerpt,
        focusKeyword: posts.focusKeyword,
        publishedAt: posts.publishedAt,
        content: posts.content,
        sources: posts.sources,
        faq: posts.faq,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(eq(posts.status, 'published'), eq(posts.noindex, false)))
      .orderBy(desc(posts.publishedAt))
      .limit(80),
    db
      .select({ postId: postTagRelations.postId, name: postTags.name })
      .from(postTagRelations)
      .innerJoin(postTags, eq(postTagRelations.tagId, postTags.id)),
    getPublishedSiteFaqs(),
    db
      .select({ title: services.title, slug: services.slug })
      .from(services)
      .where(and(eq(services.status, 'published'), eq(services.visibility, 'public')))
      .orderBy(desc(services.createdAt))
      .limit(40),
    db
      .select({ title: products.title, slug: products.slug })
      .from(products)
      .where(and(eq(products.status, 'published'), eq(products.visibility, 'public')))
      .orderBy(desc(products.createdAt))
      .limit(40),
  ])

  const tagsByPost = new Map<number, string[]>()
  for (const row of tagRows) tagsByPost.set(row.postId, [...(tagsByPost.get(row.postId) ?? []), row.name])

  return {
    posts: postRows.map((row) => {
      const section = isPostSection(row.section) ? POST_SECTIONS[row.section].label : ''
      const tags = tagsByPost.get(row.id) ?? []
      return {
        id: row.id,
        title: row.title,
        url: `${base}/blog/${row.slug}`,
        section,
        category: row.categoryName ?? '',
        date: formatDateline(row.publishedAt),
        excerpt: row.excerpt ?? '',
        sources: (row.sources ?? []).map((source) => source.name).filter(Boolean),
        summary: [row.excerpt, row.focusKeyword, row.categoryName, section, ...tags].filter(Boolean).join(' '),
        body: tiptapPlainText(row.content),
        faq: row.faq ?? [],
      }
    }),
    siteFaqs: faqRows.map((row) => ({
      question: row.question,
      answer: row.answer,
      relatedUrl:
        row.relatedPostSlug && row.relatedPostStatus === 'published' ? `${base}/blog/${row.relatedPostSlug}` : null,
    })),
    services: serviceRows.map((row) => ({ title: row.title, url: `${base}/services/${row.slug}` })),
    products: productRows.map((row) => ({ title: row.title, url: `${base}/products/${row.slug}` })),
  }
}
