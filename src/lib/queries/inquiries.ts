import { db } from '@/lib/db'
import { customers, memberAiChatMessages } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getInquiries() {
  const rows = await db
    .select({
      id: memberAiChatMessages.id,
      name: customers.name,
      contactMethod: customers.email,
      message: memberAiChatMessages.content,
      createdAt: memberAiChatMessages.createdAt,
    })
    .from(memberAiChatMessages)
    .innerJoin(customers, eq(customers.id, memberAiChatMessages.memberId))
    .where(eq(memberAiChatMessages.role, 'user'))
    .orderBy(desc(memberAiChatMessages.createdAt))

  return rows
}
