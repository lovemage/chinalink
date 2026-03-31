import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function getSettings(): Promise<Record<string, string>> {
  const row = await db
    .select({
      lineOfficialUrl: siteSettings.lineOfficialUrl,
      lineOfficialId: siteSettings.lineOfficialId,
    })
    .from(siteSettings)
    .orderBy(desc(siteSettings.updatedAt), desc(siteSettings.id))
    .limit(1)

  return {
    lineOfficialUrl: row[0]?.lineOfficialUrl ?? '',
    lineOfficialId: row[0]?.lineOfficialId ?? '',
  }
}

export async function getSetting(key: string): Promise<string | null> {
  const settings = await getSettings()
  if (key === 'lineOfficialUrl') return settings.lineOfficialUrl || null
  if (key === 'lineOfficialId') return settings.lineOfficialId || null
  return null
}
