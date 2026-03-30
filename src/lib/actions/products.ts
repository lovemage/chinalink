'use server'

import { db } from '@/lib/db'
import {
  products,
  productVariants,
  productImages,
  productFeatures,
  productTagRelations,
  media,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

interface VariantInput {
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  stock: number
  isDefault: boolean
  isActive: boolean
  specs?: { key: string; value: string }[]
  sortOrder?: number
}

interface FeatureInput {
  text: string
  sortOrder: number
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

export async function createProduct(
  formData: FormData
): Promise<{ success: true; id: number } | { error: string }> {
  try {
    const title = (formData.get('title') as string)?.trim()
    if (!title) return { error: '產品名稱為必填' }

    let slug = (formData.get('slug') as string)?.trim()
    if (!slug) slug = generateSlug(title)

    const categoryIdRaw = formData.get('categoryId') as string
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null

    const summary = (formData.get('summary') as string)?.trim() || null
    const coverImageUrl = (formData.get('coverImageUrl') as string)?.trim() || null

    const descriptionRaw = formData.get('description') as string
    let description = null
    if (descriptionRaw) {
      try {
        description = JSON.parse(descriptionRaw)
      } catch {
        description = null
      }
    }

    const status = (formData.get('status') as string) || 'draft'
    const visibility = (formData.get('visibility') as string) || 'public'
    const seoTitle = (formData.get('seoTitle') as string)?.trim() || null
    const seoDescription = (formData.get('seoDescription') as string)?.trim() || null

    const variantsRaw = formData.get('variants') as string
    let variants: VariantInput[] = []
    if (variantsRaw) {
      try {
        variants = JSON.parse(variantsRaw)
      } catch {
        variants = []
      }
    }

    const featuresRaw = formData.get('features') as string
    let features: FeatureInput[] = []
    if (featuresRaw) {
      try {
        features = JSON.parse(featuresRaw)
      } catch {
        features = []
      }
    }

    const tagIdsRaw = formData.get('tagIds') as string
    let tagIds: number[] = []
    if (tagIdsRaw) {
      try {
        tagIds = JSON.parse(tagIdsRaw)
      } catch {
        tagIds = []
      }
    }

    const additionalImagesRaw = formData.get('additionalImages') as string
    let additionalImageUrls: string[] = []
    if (additionalImagesRaw) {
      try {
        additionalImageUrls = JSON.parse(additionalImagesRaw)
      } catch {
        additionalImageUrls = []
      }
    }

    let coverImageId: number | null = null
    if (coverImageUrl) {
      coverImageId = await findOrCreateMedia(coverImageUrl)
    }

    const [product] = await db
      .insert(products)
      .values({
        title,
        slug,
        productCategoryId: categoryId,
        coverImageId,
        summary,
        description,
        status,
        visibility,
        seoTitle,
        seoDescription,
      })
      .returning({ id: products.id })

    if (variants.length > 0) {
      await db.insert(productVariants).values(
        variants.map((v, i) => ({
          productId: product.id,
          sku: v.sku,
          name: v.name,
          price: v.price,
          compareAtPrice: v.compareAtPrice ?? null,
          stock: v.stock,
          isDefault: v.isDefault,
          isActive: v.isActive,
          specs: v.specs ?? null,
          sortOrder: v.sortOrder ?? i,
        }))
      )
    }

    if (features.length > 0) {
      await db.insert(productFeatures).values(
        features.map((f, i) => ({
          productId: product.id,
          text: f.text,
          sortOrder: f.sortOrder ?? i,
        }))
      )
    }

    if (additionalImageUrls.length > 0) {
      const imageRecords = await Promise.all(
        additionalImageUrls.map((url) => findOrCreateMedia(url))
      )
      await db.insert(productImages).values(
        imageRecords.map((mediaId, i) => ({
          productId: product.id,
          mediaId,
          sortOrder: i,
        }))
      )
    }

    if (tagIds.length > 0) {
      await db.insert(productTagRelations).values(
        tagIds.map((tagId) => ({
          productId: product.id,
          tagId,
        }))
      )
    }

    revalidatePath('/admin/products')
    return { success: true, id: product.id }
  } catch (err) {
    console.error('createProduct error:', err)
    if (err instanceof Error && err.message.includes('unique')) {
      return { error: '此 Slug 已被使用，請換一個' }
    }
    return { error: '建立產品時發生錯誤，請稍後再試' }
  }
}

export async function updateProduct(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  try {
    const idRaw = formData.get('id') as string
    if (!idRaw) return { error: '缺少產品 ID' }
    const id = parseInt(idRaw)

    const title = (formData.get('title') as string)?.trim()
    if (!title) return { error: '產品名稱為必填' }

    let slug = (formData.get('slug') as string)?.trim()
    if (!slug) slug = generateSlug(title)

    const categoryIdRaw = formData.get('categoryId') as string
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null

    const summary = (formData.get('summary') as string)?.trim() || null
    const coverImageUrl = (formData.get('coverImageUrl') as string)?.trim() || null

    const descriptionRaw = formData.get('description') as string
    let description = null
    if (descriptionRaw) {
      try {
        description = JSON.parse(descriptionRaw)
      } catch {
        description = null
      }
    }

    const status = (formData.get('status') as string) || 'draft'
    const visibility = (formData.get('visibility') as string) || 'public'
    const seoTitle = (formData.get('seoTitle') as string)?.trim() || null
    const seoDescription = (formData.get('seoDescription') as string)?.trim() || null

    const variantsRaw = formData.get('variants') as string
    let variants: VariantInput[] = []
    if (variantsRaw) {
      try {
        variants = JSON.parse(variantsRaw)
      } catch {
        variants = []
      }
    }

    const featuresRaw = formData.get('features') as string
    let features: FeatureInput[] = []
    if (featuresRaw) {
      try {
        features = JSON.parse(featuresRaw)
      } catch {
        features = []
      }
    }

    const tagIdsRaw = formData.get('tagIds') as string
    let tagIds: number[] = []
    if (tagIdsRaw) {
      try {
        tagIds = JSON.parse(tagIdsRaw)
      } catch {
        tagIds = []
      }
    }

    const additionalImagesRaw = formData.get('additionalImages') as string
    let additionalImageUrls: string[] = []
    if (additionalImagesRaw) {
      try {
        additionalImageUrls = JSON.parse(additionalImagesRaw)
      } catch {
        additionalImageUrls = []
      }
    }

    let coverImageId: number | null = null
    if (coverImageUrl) {
      coverImageId = await findOrCreateMedia(coverImageUrl)
    }

    await db
      .update(products)
      .set({
        title,
        slug,
        productCategoryId: categoryId,
        coverImageId,
        summary,
        description,
        status,
        visibility,
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))

    // Delete and re-insert child records
    await db.delete(productVariants).where(eq(productVariants.productId, id))
    await db.delete(productFeatures).where(eq(productFeatures.productId, id))
    await db.delete(productImages).where(eq(productImages.productId, id))
    await db.delete(productTagRelations).where(eq(productTagRelations.productId, id))

    if (variants.length > 0) {
      await db.insert(productVariants).values(
        variants.map((v, i) => ({
          productId: id,
          sku: v.sku,
          name: v.name,
          price: v.price,
          compareAtPrice: v.compareAtPrice ?? null,
          stock: v.stock,
          isDefault: v.isDefault,
          isActive: v.isActive,
          specs: v.specs ?? null,
          sortOrder: v.sortOrder ?? i,
        }))
      )
    }

    if (features.length > 0) {
      await db.insert(productFeatures).values(
        features.map((f, i) => ({
          productId: id,
          text: f.text,
          sortOrder: f.sortOrder ?? i,
        }))
      )
    }

    if (additionalImageUrls.length > 0) {
      const imageRecords = await Promise.all(
        additionalImageUrls.map((url) => findOrCreateMedia(url))
      )
      await db.insert(productImages).values(
        imageRecords.map((mediaId, i) => ({
          productId: id,
          mediaId,
          sortOrder: i,
        }))
      )
    }

    if (tagIds.length > 0) {
      await db.insert(productTagRelations).values(
        tagIds.map((tagId) => ({
          productId: id,
          tagId,
        }))
      )
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    return { success: true }
  } catch (err) {
    console.error('updateProduct error:', err)
    if (err instanceof Error && err.message.includes('unique')) {
      return { error: '此 Slug 已被使用，請換一個' }
    }
    return { error: '更新產品時發生錯誤，請稍後再試' }
  }
}

export async function deleteProduct(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await db.delete(products).where(eq(products.id, id))
    revalidatePath('/admin/products')
    return { success: true }
  } catch (err) {
    console.error('deleteProduct error:', err)
    return { error: '刪除產品時發生錯誤，請稍後再試' }
  }
}
