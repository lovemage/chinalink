export interface ChatMessageRow {
  id: number
  memberId: number
  role: 'user' | 'assistant'
  content: string
  createdAt: Date | null
}

export function keepNewestMessages<T extends { id: number }>(
  messages: T[],
  limit = 20,
): { keepIds: number[]; removeIds: number[] } {
  if (messages.length <= limit) {
    return { keepIds: messages.map((m) => m.id), removeIds: [] }
  }

  const keep = messages.slice(0, limit)
  const remove = messages.slice(limit)
  return {
    keepIds: keep.map((m) => m.id),
    removeIds: remove.map((m) => m.id),
  }
}

