'use server'

import { db } from '@/lib/db'
import { posts, media } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

async function findOrCreateMedia(url: string): Promise<number> {
  const existing = await db.query.media.findFirst({
    where: eq(media.url, url),
  })
  if (existing) return existing.id

  const filename = url.split('/').pop() ?? 'image'
  const [created] = await db
    .insert(media)
    .values({ url, filename, alt: filename })
    .returning({ id: media.id })
  return created.id
}

export async function createPost(
  formData: FormData
): Promise<{ success: true; id: number } | { error: string }> {
  try {
    const title = (formData.get('title') as string)?.trim()
    if (!title) return { error: '文章標題為必填' }

    let slug = (formData.get('slug') as string)?.trim()
    if (!slug) slug = generateSlug(title)

    const categoryIdRaw = formData.get('categoryId') as string
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null

    const coverImageUrl = (formData.get('coverImageUrl') as string)?.trim() || null
    const excerpt = (formData.get('excerpt') as string)?.trim() || null
    const author = (formData.get('author') as string)?.trim() || '懂陸姐'
    const status = (formData.get('status') as string) || 'draft'

    const publishedAtRaw = formData.get('publishedAt') as string
    const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null

    const contentRaw = formData.get('content') as string
    let content = null
    if (contentRaw) {
      try {
        content = JSON.parse(contentRaw)
      } catch {
        content = null
      }
    }

    const seoTitle = (formData.get('seoTitle') as string)?.trim() || null
    const seoDescription = (formData.get('seoDescription') as string)?.trim() || null

    let coverImageId: number | null = null
    if (coverImageUrl) {
      coverImageId = await findOrCreateMedia(coverImageUrl)
    }

    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        categoryId,
        coverImageId,
        excerpt,
        author,
        status,
        publishedAt,
        content,
        seoTitle,
        seoDescription,
      })
      .returning({ id: posts.id })

    revalidatePath('/admin/posts')
    return { success: true, id: post.id }
  } catch (err) {
    console.error('createPost error:', err)
    if (err instanceof Error && err.message.includes('unique')) {
      return { error: '此 Slug 已被使用，請換一個' }
    }
    return { error: '建立文章時發生錯誤，請稍後再試' }
  }
}

export async function updatePost(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  try {
    const idRaw = formData.get('id') as string
    if (!idRaw) return { error: '缺少文章 ID' }
    const id = parseInt(idRaw)

    const title = (formData.get('title') as string)?.trim()
    if (!title) return { error: '文章標題為必填' }

    let slug = (formData.get('slug') as string)?.trim()
    if (!slug) slug = generateSlug(title)

    const categoryIdRaw = formData.get('categoryId') as string
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null

    const coverImageUrl = (formData.get('coverImageUrl') as string)?.trim() || null
    const excerpt = (formData.get('excerpt') as string)?.trim() || null
    const author = (formData.get('author') as string)?.trim() || '懂陸姐'
    const status = (formData.get('status') as string) || 'draft'

    const publishedAtRaw = formData.get('publishedAt') as string
    const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null

    const contentRaw = formData.get('content') as string
    let content = null
    if (contentRaw) {
      try {
        content = JSON.parse(contentRaw)
      } catch {
        content = null
      }
    }

    const seoTitle = (formData.get('seoTitle') as string)?.trim() || null
    const seoDescription = (formData.get('seoDescription') as string)?.trim() || null

    let coverImageId: number | null = null
    if (coverImageUrl) {
      coverImageId = await findOrCreateMedia(coverImageUrl)
    }

    await db
      .update(posts)
      .set({
        title,
        slug,
        categoryId,
        coverImageId,
        excerpt,
        author,
        status,
        publishedAt,
        content,
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))

    revalidatePath('/admin/posts')
    revalidatePath(`/admin/posts/${id}`)
    return { success: true }
  } catch (err) {
    console.error('updatePost error:', err)
    if (err instanceof Error && err.message.includes('unique')) {
      return { error: '此 Slug 已被使用，請換一個' }
    }
    return { error: '更新文章時發生錯誤，請稍後再試' }
  }
}

export async function deletePost(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await db.delete(posts).where(eq(posts.id, id))
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (err) {
    console.error('deletePost error:', err)
    return { error: '刪除文章時發生錯誤，請稍後再試' }
  }
}
