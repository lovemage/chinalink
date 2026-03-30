export const dynamic = 'force-dynamic'

import { getPublishedServicesWithDetails } from '@/lib/queries/services'
import { getPublishedProductsWithDetails } from '@/lib/queries/products'
import { getServiceCategories, getProductCategories } from '@/lib/queries/categories'
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

  const [categories, services, productCategories, products] = await Promise.all([
    getServiceCategories(),
    getPublishedServicesWithDetails(),
    getProductCategories(),
    getPublishedProductsWithDetails(),
  ])

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
