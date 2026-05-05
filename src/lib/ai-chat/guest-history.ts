import type { AiChatMessage } from '@/lib/queries/ai-chat'

type RawGuestMessage = {
  id?: unknown
  role?: unknown
  content?: unknown
  createdAt?: unknown
}

export function normalizeGuestHistory(input: unknown, limit = 20): AiChatMessage[] {
  if (!Array.isArray(input)) return []

  return input
    .map((row: RawGuestMessage, index): AiChatMessage | null => {
      if (row.role !== 'user' && row.role !== 'assistant') return null
      const content = String(row.content ?? '').trim()
      if (!content) return null

      return {
        id: Number(row.id) || index + 1,
        role: row.role,
        content,
        createdAt: null,
      }
    })
    .filter((row): row is AiChatMessage => row !== null)
    .slice(-limit)
}

export function buildGuestResponseMessages(
  history: AiChatMessage[],
  userMessage: string,
  assistantMessage: string,
): AiChatMessage[] {
  const now = Date.now()
  const userRow: AiChatMessage = { id: now, role: 'user', content: userMessage, createdAt: null }
  const assistantRow: AiChatMessage = {
    id: now + 1,
    role: 'assistant',
    content: assistantMessage,
    createdAt: null,
  }

  return [...history, userRow, assistantRow].slice(-20)
}
