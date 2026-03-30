import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings)
  return Object.fromEntries(
    rows.map((row) => [row.key, row.value ?? ''])
  )
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1)
  return row[0]?.value ?? null
}
