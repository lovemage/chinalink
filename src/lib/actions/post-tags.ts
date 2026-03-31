'use server'

import { db } from '@/lib/db'
import { postTags, postTagRelations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

export async function createPostTag(formData: FormData): Promise<{ success: true } | { error: string }> {
  try {
    const name = String(formData.get('name') ?? '').trim()
    if (!name) return { error: '標籤名稱為必填' }

    const slug = slugify(name)
    if (!slug) return { error: '標籤格式不正確' }

    await db
      .insert(postTags)
      .values({ name, slug })
      .onConflictDoUpdate({
        target: postTags.slug,
        set: { name },
      })

    revalidatePath('/admin/posts')
    revalidatePath('/admin/posts/new')
    return { success: true }
  } catch (err) {
    console.error('createPostTag error:', err)
    return { error: '建立標籤失敗' }
  }
}

export async function updatePostTag(formData: FormData): Promise<{ success: true } | { error: string }> {
  try {
    const id = Number(formData.get('id'))
    const name = String(formData.get('name') ?? '').trim()
    if (!id) return { error: '缺少標籤 ID' }
    if (!name) return { error: '標籤名稱為必填' }

    const slug = slugify(name)
    if (!slug) return { error: '標籤格式不正確' }

    await db
      .update(postTags)
      .set({ name, slug })
      .where(eq(postTags.id, id))

    revalidatePath('/admin/posts')
    revalidatePath('/admin/posts/new')
    return { success: true }
  } catch (err) {
    console.error('updatePostTag error:', err)
    return { error: '更新標籤失敗（可能 slug 衝突）' }
  }
}

export async function deletePostTag(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await db.delete(postTagRelations).where(eq(postTagRelations.tagId, id))
    await db.delete(postTags).where(eq(postTags.id, id))
    revalidatePath('/admin/posts')
    revalidatePath('/admin/posts/new')
    return { success: true }
  } catch (err) {
    console.error('deletePostTag error:', err)
    return { error: '刪除標籤失敗' }
  }
}

