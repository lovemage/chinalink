'use server'

import { db } from '@/lib/db'
import { services, serviceAddons, serviceFeatures, media } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

interface AddonInput {
  name: string
  price: number
  required: boolean
  sortOrder: number
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

export async function createService(
  formData: FormData
): Promise<{ success: true; id: number } | { error: string }> {
  try {
    const title = (formData.get('title') as string)?.trim()
    if (!title) return { error: '服務名稱為必填' }

    let slug = (formData.get('slug') as string)?.trim()
    if (!slug) slug = generateSlug(title)

    const categoryIdRaw = formData.get('categoryId') as string
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null

    const iconName = (formData.get('iconName') as string) || 'handshake'
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
    const cartEnabled = formData.get('cartEnabled') === 'true'
    const pricingMode = (formData.get('pricingMode') as string) || 'fixed'

    const priceRaw = formData.get('price') as string
    const price = priceRaw ? parseInt(priceRaw) : null

    const basePriceRaw = formData.get('basePrice') as string
    const basePrice = basePriceRaw ? parseInt(basePriceRaw) : null

    const seoTitle = (formData.get('seoTitle') as string)?.trim() || null
    const seoDescription = (formData.get('seoDescription') as string)?.trim() || null

    const addonsRaw = formData.get('addons') as string
    let addons: AddonInput[] = []
    if (addonsRaw) {
      try {
        addons = JSON.parse(addonsRaw)
      } catch {
        addons = []
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

    let coverImageId: number | null = null
    if (coverImageUrl) {
      coverImageId = await findOrCreateMedia(coverImageUrl)
    }

    const [service] = await db
      .insert(services)
      .values({
        title,
        slug,
        serviceCategoryId: categoryId,
        iconName,
        coverImageId,
        description,
        status,
        visibility,
        pricingMode,
        price,
        basePrice,
        cartEnabled,
        seoTitle,
        seoDescription,
      })
      .returning({ id: services.id })

    if (addons.length > 0) {
      await db.insert(serviceAddons).values(
        addons.map((a, i) => ({
          serviceId: service.id,
          name: a.name,
          price: a.price,
          required: a.required,
          sortOrder: a.sortOrder ?? i,
        }))
      )
    }

    if (features.length > 0) {
      await db.insert(serviceFeatures).values(
        features.map((f, i) => ({
          serviceId: service.id,
          text: f.text,
          sortOrder: f.sortOrder ?? i,
        }))
      )
    }

    revalidatePath('/admin/services')
    return { success: true, id: service.id }
  } catch (err) {
    console.error('createService error:', err)
    if (err instanceof Error && err.message.includes('unique')) {
      return { error: '此 Slug 已被使用，請換一個' }
    }
    return { error: '建立服務時發生錯誤，請稍後再試' }
  }
}

export async function updateService(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  try {
    const idRaw = formData.get('id') as string
    if (!idRaw) return { error: '缺少服務 ID' }
    const id = parseInt(idRaw)

    const title = (formData.get('title') as string)?.trim()
    if (!title) return { error: '服務名稱為必填' }

    let slug = (formData.get('slug') as string)?.trim()
    if (!slug) slug = generateSlug(title)

    const categoryIdRaw = formData.get('categoryId') as string
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null

    const iconName = (formData.get('iconName') as string) || 'handshake'
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
    const cartEnabled = formData.get('cartEnabled') === 'true'
    const pricingMode = (formData.get('pricingMode') as string) || 'fixed'

    const priceRaw = formData.get('price') as string
    const price = priceRaw ? parseInt(priceRaw) : null

    const basePriceRaw = formData.get('basePrice') as string
    const basePrice = basePriceRaw ? parseInt(basePriceRaw) : null

    const seoTitle = (formData.get('seoTitle') as string)?.trim() || null
    const seoDescription = (formData.get('seoDescription') as string)?.trim() || null

    const addonsRaw = formData.get('addons') as string
    let addons: AddonInput[] = []
    if (addonsRaw) {
      try {
        addons = JSON.parse(addonsRaw)
      } catch {
        addons = []
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

    let coverImageId: number | null = null
    if (coverImageUrl) {
      coverImageId = await findOrCreateMedia(coverImageUrl)
    }

    await db
      .update(services)
      .set({
        title,
        slug,
        serviceCategoryId: categoryId,
        iconName,
        coverImageId,
        description,
        status,
        visibility,
        pricingMode,
        price,
        basePrice,
        cartEnabled,
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))

    // Delete and re-insert addons and features
    await db.delete(serviceAddons).where(eq(serviceAddons.serviceId, id))
    await db.delete(serviceFeatures).where(eq(serviceFeatures.serviceId, id))

    if (addons.length > 0) {
      await db.insert(serviceAddons).values(
        addons.map((a, i) => ({
          serviceId: id,
          name: a.name,
          price: a.price,
          required: a.required,
          sortOrder: a.sortOrder ?? i,
        }))
      )
    }

    if (features.length > 0) {
      await db.insert(serviceFeatures).values(
        features.map((f, i) => ({
          serviceId: id,
          text: f.text,
          sortOrder: f.sortOrder ?? i,
        }))
      )
    }

    revalidatePath('/admin/services')
    revalidatePath(`/admin/services/${id}`)
    return { success: true }
  } catch (err) {
    console.error('updateService error:', err)
    if (err instanceof Error && err.message.includes('unique')) {
      return { error: '此 Slug 已被使用，請換一個' }
    }
    return { error: '更新服務時發生錯誤，請稍後再試' }
  }
}

export async function deleteService(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await db.delete(services).where(eq(services.id, id))
    revalidatePath('/admin/services')
    return { success: true }
  } catch (err) {
    console.error('deleteService error:', err)
    return { error: '刪除服務時發生錯誤，請稍後再試' }
  }
}
