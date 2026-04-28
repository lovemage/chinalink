import { and, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { memberAiChatMessages, products, services } from '@/lib/db/schema'
import { keepNewestMessages } from '@/lib/ai-chat/history'
import { getSettings } from '@/lib/queries/settings'

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
    prompt: settings.aiAgentPrompt || '',
    lineOfficialUrl: settings.lineOfficialUrl,
    lineOfficialId: settings.lineOfficialId,
    whatsappUrl: settings.whatsappUrl,
  }
}

export async function getAiContextSnapshot() {
  const [publishedProducts, publishedServices] = await Promise.all([
    db
      .select({
        title: products.title,
        slug: products.slug,
        summary: products.summary,
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
      })
      .from(services)
      .where(and(eq(services.status, 'published'), eq(services.visibility, 'public')))
      .orderBy(desc(services.createdAt))
      .limit(40),
  ])

  return { publishedProducts, publishedServices }
}

