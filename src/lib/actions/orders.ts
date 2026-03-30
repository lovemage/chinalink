'use server'

import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(
  id: number,
  status: string
): Promise<{ success: true } | { error: string }> {
  try {
    await db
      .update(orders)
      .set({ orderStatus: status, updatedAt: new Date() })
      .where(eq(orders.id, id))
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true }
  } catch (err) {
    console.error('updateOrderStatus error:', err)
    return { error: '更新訂單狀態時發生錯誤' }
  }
}

export async function updatePaymentStatus(
  id: number,
  status: string
): Promise<{ success: true } | { error: string }> {
  try {
    await db
      .update(orders)
      .set({ paymentStatus: status, updatedAt: new Date() })
      .where(eq(orders.id, id))
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true }
  } catch (err) {
    console.error('updatePaymentStatus error:', err)
    return { error: '更新付款狀態時發生錯誤' }
  }
}

export async function updateOrderNote(
  id: number,
  note: string
): Promise<{ success: true } | { error: string }> {
  try {
    await db
      .update(orders)
      .set({ note: note || null, updatedAt: new Date() })
      .where(eq(orders.id, id))
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true }
  } catch (err) {
    console.error('updateOrderNote error:', err)
    return { error: '更新備注時發生錯誤' }
  }
}
