// Tina schedules in Taiwan time whatever the server or phone timezone is.
const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000

/** Date -> value for <input type="datetime-local"> in Taiwan time. */
export function toTaipeiInputValue(date: Date | string | null | undefined): string {
  if (!date) return ''
  const value = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(value.getTime())) return ''
  return new Date(value.getTime() + TAIPEI_OFFSET_MS).toISOString().slice(0, 16)
}

/** "2026-11-06T09:30" read as Taiwan time -> Date. */
export function fromTaipeiInputValue(value: string | null | undefined): Date | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value)
  if (!match) return null
  const [, y, m, d, h, min] = match.map(Number)
  const utc = Date.UTC(y, m - 1, d, h, min) - TAIPEI_OFFSET_MS
  return Number.isNaN(utc) ? null : new Date(utc)
}

/** 2026.11.06, the dateline format used across lists. */
export function formatDateline(date: Date | string | null | undefined): string {
  if (!date) return ''
  const value = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(value.getTime())) return ''
  return new Date(value.getTime() + TAIPEI_OFFSET_MS).toISOString().slice(0, 10).replace(/-/g, '.')
}

export function formatTaipeiDateTime(date: Date | string | null | undefined): string {
  const input = toTaipeiInputValue(date)
  return input ? `${input.slice(0, 10).replace(/-/g, '/')} ${input.slice(11)}` : ''
}
