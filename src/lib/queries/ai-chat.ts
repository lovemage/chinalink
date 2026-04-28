import { and, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { memberAiChatMessages, posts, products, services } from '@/lib/db/schema'
import { keepNewestMessages } from '@/lib/ai-chat/history'
import { getSettings } from '@/lib/queries/settings'
import { homeFaqs } from '@/lib/content/faq'

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

export async function getAiContextSnapshot() {
  const [publishedProducts, publishedServices, publishedFaqPosts] = await Promise.all([
    db
      .select({
        title: products.title,
        slug: products.slug,
        summary: products.summary,
        description: products.description,
      })
      .from(products)
      .where(and(eq(products.status, 'published'), eq(products.visibility, 'public')))
      .orderBy(desc(products.createdAt))
      .limit(40),
    db
      .select({
        title: services.title,
        slug: services.slug,
        pricingMode: services.pricingMode,
        price: services.price,
        basePrice: services.basePrice,
        description: services.description,
      })
      .from(services)
      .where(and(eq(services.status, 'published'), eq(services.visibility, 'public')))
      .orderBy(desc(services.createdAt))
      .limit(40),
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
      })
      .from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt))
      .limit(20),
  ])

  const productContext = publishedProducts.map((p) => ({
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    description: shrinkJson(p.description),
  }))

  const serviceContext = publishedServices.map((s) => ({
    title: s.title,
    slug: s.slug,
    pricingMode: s.pricingMode,
    price: s.price,
    basePrice: s.basePrice,
    description: shrinkJson(s.description),
  }))

  const postFaqs = extractFaqsFromPosts(
    publishedFaqPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      content: p.content,
    })),
  )

  return {
    publishedProducts: productContext,
    publishedServices: serviceContext,
    homeFaqs,
    postFaqs,
  }
}

function shrinkJson(value: unknown, maxLen = 700): string {
  if (!value) return ''
  let text = ''
  try {
    text = JSON.stringify(value)
  } catch {
    return ''
  }
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text
}

function extractFaqsFromPosts(
  rows: Array<{ title: string; slug: string; content: unknown }>,
): Array<{ source: string; question: string; answer: string }> {
  const output: Array<{ source: string; question: string; answer: string }> = []

  for (const row of rows) {
    const content = row.content as
      | { root?: { children?: unknown[] }; blocks?: unknown[] }
      | null
      | undefined
    const blocks = Array.isArray(content?.blocks) ? content?.blocks : []
    for (const rawBlock of blocks) {
      const block = rawBlock as
        | {
            blockType?: string
            items?: Array<{ question?: string; answer?: unknown }>
          }
        | undefined
      if (block?.blockType !== 'faq' || !Array.isArray(block.items)) continue

      for (const item of block.items) {
        const question = String(item.question ?? '').trim()
        if (!question) continue
        const answer = extractLexicalText(item.answer).trim()
        output.push({
          source: `${row.title} (${row.slug})`,
          question,
          answer,
        })
      }
    }
  }

  return output.slice(0, 80)
}

function extractLexicalText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const obj = node as { text?: unknown; children?: unknown[]; root?: { children?: unknown[] } }

  const ownText = typeof obj.text === 'string' ? obj.text : ''
  const childText = Array.isArray(obj.children)
    ? obj.children.map((c) => extractLexicalText(c)).join(' ')
    : ''
  const rootText =
    obj.root && Array.isArray(obj.root.children)
      ? obj.root.children.map((c) => extractLexicalText(c)).join(' ')
      : ''

  return [ownText, childText, rootText].filter(Boolean).join(' ').replace(/\s+/g, ' ')
}
