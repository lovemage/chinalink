'use server'

import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'

export async function updateSettings(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  try {
    const lineOfficialUrl = String(formData.get('lineOfficialUrl') ?? '')
    const lineOfficialId = String(formData.get('lineOfficialId') ?? '')
    const now = new Date()

    const existing = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .orderBy(desc(siteSettings.updatedAt), desc(siteSettings.id))
      .limit(1)

    if (existing[0]?.id) {
      await db
        .update(siteSettings)
        .set({ lineOfficialUrl, lineOfficialId, updatedAt: now })
        .where(eq(siteSettings.id, existing[0].id))
    } else {
      await db.insert(siteSettings).values({
        lineOfficialUrl,
        lineOfficialId,
        updatedAt: now,
        createdAt: now,
      })
    }

    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err) {
    console.error('updateSettings error:', err)
    return { error: '儲存設定時發生錯誤' }
  }
}
