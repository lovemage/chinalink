'use server'

import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

export async function updateSettings(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  try {
    const entries = Array.from(formData.entries()) as [string, string][]

    for (const [key, value] of entries) {
      await db
        .insert(siteSettings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value, updatedAt: new Date() },
        })
    }

    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err) {
    console.error('updateSettings error:', err)
    return { error: '儲存設定時發生錯誤' }
  }
}
