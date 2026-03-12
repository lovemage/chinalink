import { getPayload } from 'payload'
import configPromise from '@payload-config'

import {
  productCategories,
  productSeedSources,
  productTags,
  serviceCategories,
  serviceSeedSources,
} from './catalog'

export async function seedCatalog() {
  const payload = await getPayload({ config: configPromise })

  const serviceCategoryIds = new Map<string, number>()
  for (const category of serviceCategories) {
    const existing = await payload.find({
      collection: 'service-categories',
      where: { slug: { equals: category.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      serviceCategoryIds.set(category.slug, existing.docs[0].id)
      console.log(`[seed] Service category "${category.slug}" already exists, skipping.`)
      continue
    }

    const created = await payload.create({
      collection: 'service-categories',
      data: category,
    })

    serviceCategoryIds.set(category.slug, created.id)
    console.log(`[seed] Created service category: ${category.slug}`)
  }

  for (const service of serviceSeedSources) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
    })

    const data = {
      title: service.title,
      slug: service.slug,
      serviceCategory: serviceCategoryIds.get(service.categorySlug),
      pricingMode: service.pricingMode,
      price: service.price,
      basePrice: service.basePrice,
      addons: service.addons,
      status: 'published' as const,
      visibility: 'public' as const,
      features: service.features.map((text) => ({ text })),
      seo: {
        metaTitle: `${service.title} - 懂陸姐 ChinaLink`,
        metaDescription: service.seoDescription,
      },
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data,
      })
      console.log(`[seed] Updated service: ${service.slug}`)
      continue
    }

    await payload.create({
      collection: 'services',
      data,
    })
    console.log(`[seed] Created service: ${service.slug}`)
  }

  const productCategoryIds = new Map<string, number>()
  for (const category of productCategories) {
    const existing = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: category.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      productCategoryIds.set(category.slug, existing.docs[0].id)
      console.log(`[seed] Product category "${category.slug}" already exists, skipping.`)
      continue
    }

    const created = await payload.create({
      collection: 'product-categories',
      data: category,
    })

    productCategoryIds.set(category.slug, created.id)
    console.log(`[seed] Created product category: ${category.slug}`)
  }

  const productTagIds = new Map<string, number>()
  for (const tag of productTags) {
    const existing = await payload.find({
      collection: 'product-tags',
      where: { slug: { equals: tag.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      productTagIds.set(tag.slug, existing.docs[0].id)
      console.log(`[seed] Product tag "${tag.slug}" already exists, skipping.`)
      continue
    }

    const created = await payload.create({
      collection: 'product-tags',
      data: tag,
    })

    productTagIds.set(tag.slug, created.id)
    console.log(`[seed] Created product tag: ${tag.slug}`)
  }

  for (const product of productSeedSources) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: product.slug } },
      limit: 1,
    })

    const data = {
      title: product.title,
      slug: product.slug,
      productCategory: productCategoryIds.get(product.categorySlug),
      tags: product.tagSlugs.map((slug) => productTagIds.get(slug)).filter(Boolean),
      summary: product.summary,
      status: 'published' as const,
      visibility: 'public' as const,
      variants: product.variants.map((variant) => ({
        ...variant,
        isDefault: Boolean(variant.isDefault),
        isActive: variant.isActive ?? true,
      })),
      features: product.features.map((text) => ({ text })),
      seo: {
        metaTitle: `${product.title} - 懂陸姐 ChinaLink`,
        metaDescription: product.seoDescription,
      },
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data,
      })
      console.log(`[seed] Updated product: ${product.slug}`)
      continue
    }

    await payload.create({
      collection: 'products',
      data,
    })
    console.log(`[seed] Created product: ${product.slug}`)
  }

  console.log('[seed] Catalog seeding complete.')
}
