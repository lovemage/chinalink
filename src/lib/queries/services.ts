import { db } from '@/lib/db'
import {
  services,
  serviceAddons,
  serviceFeatures,
  serviceCategories,
  media,
} from '@/lib/db/schema'
import { eq, and, ilike, desc } from 'drizzle-orm'

interface GetServicesOpts {
  search?: string
  categoryId?: number
  status?: string
}

export async function getServices(opts: GetServicesOpts = {}) {
  const { search, categoryId, status } = opts

  const conditions = []
  if (search) conditions.push(ilike(services.title, `%${search}%`))
  if (categoryId) conditions.push(eq(services.serviceCategoryId, categoryId))
  if (status) conditions.push(eq(services.status, status))

  const rows = await db
    .select({
      id: services.id,
      title: services.title,
      slug: services.slug,
      categoryName: serviceCategories.name,
      status: services.status,
      pricingMode: services.pricingMode,
      price: services.price,
      basePrice: services.basePrice,
      createdAt: services.createdAt,
    })
    .from(services)
    .leftJoin(serviceCategories, eq(services.serviceCategoryId, serviceCategories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(services.createdAt))

  return rows
}

export async function getService(id: number) {
  const result = await db.query.services.findFirst({
    where: eq(services.id, id),
    with: {
      serviceCategory: true,
      coverImage: true,
      addons: {
        orderBy: (addons, { asc }) => [asc(addons.sortOrder)],
      },
      features: {
        orderBy: (features, { asc }) => [asc(features.sortOrder)],
      },
    },
  })
  return result ?? null
}

export async function getPublishedServices() {
  const rows = await db
    .select({
      id: services.id,
      title: services.title,
      slug: services.slug,
      iconName: services.iconName,
      pricingMode: services.pricingMode,
      price: services.price,
      basePrice: services.basePrice,
      cartEnabled: services.cartEnabled,
      categoryName: serviceCategories.name,
      coverImageUrl: media.url,
    })
    .from(services)
    .leftJoin(serviceCategories, eq(services.serviceCategoryId, serviceCategories.id))
    .leftJoin(media, eq(services.coverImageId, media.id))
    .where(and(eq(services.status, 'published'), eq(services.visibility, 'public')))
    .orderBy(desc(services.createdAt))

  return rows
}

export async function getServiceBySlug(slug: string) {
  const result = await db.query.services.findFirst({
    where: eq(services.slug, slug),
    with: {
      serviceCategory: true,
      coverImage: true,
      addons: {
        orderBy: (addons, { asc }) => [asc(addons.sortOrder)],
      },
      features: {
        orderBy: (features, { asc }) => [asc(features.sortOrder)],
      },
    },
  })
  return result ?? null
}
