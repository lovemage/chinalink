import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export interface SiteSettings {
  lineOfficialUrl: string
  lineOfficialId: string
  aiAgentEnabled: boolean
  openrouterApiKey: string
  openrouterModel: string
  systemPrompt: string
  aiAgentPrompt: string
  whatsappUrl: string
}

export async function getSettings(): Promise<SiteSettings> {
  let row: Array<{
    lineOfficialUrl: string | null
    lineOfficialId: string | null
    aiAgentEnabled: boolean | null
    openrouterApiKey: string | null
    openrouterModel: string | null
    systemPrompt: string | null
    aiAgentPrompt: string | null
    whatsappUrl: string | null
  }> = []

  try {
    row = await db
      .select({
        lineOfficialUrl: siteSettings.lineOfficialUrl,
        lineOfficialId: siteSettings.lineOfficialId,
        aiAgentEnabled: siteSettings.aiAgentEnabled,
        openrouterApiKey: siteSettings.openrouterApiKey,
        openrouterModel: siteSettings.openrouterModel,
        systemPrompt: siteSettings.systemPrompt,
        aiAgentPrompt: siteSettings.aiAgentPrompt,
        whatsappUrl: siteSettings.whatsappUrl,
      })
      .from(siteSettings)
      .orderBy(desc(siteSettings.updatedAt), desc(siteSettings.id))
      .limit(1)
  } catch (error) {
    if (!isMissingSystemPromptColumnError(error)) throw error
    const fallbackRow = await db
      .select({
        lineOfficialUrl: siteSettings.lineOfficialUrl,
        lineOfficialId: siteSettings.lineOfficialId,
        aiAgentEnabled: siteSettings.aiAgentEnabled,
        openrouterApiKey: siteSettings.openrouterApiKey,
        openrouterModel: siteSettings.openrouterModel,
        aiAgentPrompt: siteSettings.aiAgentPrompt,
        whatsappUrl: siteSettings.whatsappUrl,
      })
      .from(siteSettings)
      .orderBy(desc(siteSettings.updatedAt), desc(siteSettings.id))
      .limit(1)

    row = fallbackRow.map((r) => ({
      ...r,
      systemPrompt: null,
    }))
  }

  return {
    lineOfficialUrl: row[0]?.lineOfficialUrl ?? '',
    lineOfficialId: row[0]?.lineOfficialId ?? '',
    aiAgentEnabled: row[0]?.aiAgentEnabled ?? false,
    openrouterApiKey: row[0]?.openrouterApiKey ?? '',
    openrouterModel: row[0]?.openrouterModel ?? 'openai/gpt-4.1-mini',
    systemPrompt: row[0]?.systemPrompt ?? '',
    aiAgentPrompt: row[0]?.aiAgentPrompt ?? '',
    whatsappUrl: row[0]?.whatsappUrl ?? '',
  }
}

function isMissingSystemPromptColumnError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return /system_prompt/.test(error.message) && /does not exist/i.test(error.message)
}

export async function getSetting(key: string): Promise<string | null> {
  const settings = await getSettings()
  if (key === 'lineOfficialUrl') return settings.lineOfficialUrl || null
  if (key === 'lineOfficialId') return settings.lineOfficialId || null
  if (key === 'openrouterApiKey') return settings.openrouterApiKey || null
  if (key === 'openrouterModel') return settings.openrouterModel || null
  if (key === 'systemPrompt') return settings.systemPrompt || null
  if (key === 'aiAgentPrompt') return settings.aiAgentPrompt || null
  if (key === 'whatsappUrl') return settings.whatsappUrl || null
  if (key === 'aiAgentEnabled') return settings.aiAgentEnabled ? 'true' : 'false'
  return null
}
