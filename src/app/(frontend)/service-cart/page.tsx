export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Service, ServiceCategory, Product, ProductCategory } from '@/payload-types'
import { ServiceCartClient } from '@/components/service-cart/ServiceCartClient'

export const metadata = {
  title: '服務選購 - 懂陸姐 ChinaLink',
  description: '選擇您需要的服務與商品，輕鬆加入購物車並完成預約。',
}

export default async function ServiceCartPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; addProduct?: string; checkout?: string }>
}) {
  const { add, addProduct, checkout } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, servicesResult, productCategoriesResult, productsResult] =
    await Promise.all([
      payload.find({
        collection: 'service-categories',
        limit: 100,
      }),
      payload.find({
        collection: 'services',
        where: {
          status: { equals: 'published' },
          visibility: { equals: 'public' },
        },
        limit: 100,
        depth: 1,
        sort: '-createdAt',
      }),
      payload.find({
        collection: 'product-categories',
        limit: 100,
      }),
      payload.find({
        collection: 'products',
        where: {
          status: { equals: 'published' },
          visibility: { in: ['public', 'unlisted'] },
        },
        limit: 100,
        depth: 1,
        sort: '-createdAt',
      }),
    ])

  const categories = categoriesResult.docs as ServiceCategory[]
  const services = servicesResult.docs as Service[]
  const productCategories = productCategoriesResult.docs as ProductCategory[]
  const products = productsResult.docs as Product[]

  // Parse the service ID to auto-add from query param
  const initialAddId = add ? parseInt(add, 10) : undefined

  return (
    <ServiceCartClient
      services={services}
      categories={categories}
      products={products}
      productCategories={productCategories}
      initialAddServiceId={initialAddId && !isNaN(initialAddId) ? initialAddId : undefined}
      initialAddProductSlug={addProduct || undefined}
      autoCheckout={checkout === '1'}
    />
  )
}
