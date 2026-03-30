'use server'

import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateInquiryStatus(
  id: number,
  status: string
): Promise<{ success: true } | { error: string }> {
  try {
    await db
      .update(inquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(inquiries.id, id))
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err) {
    console.error('updateInquiryStatus error:', err)
    return { error: '更新諮詢狀態時發生錯誤' }
  }
}
