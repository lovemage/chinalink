export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Product, ProductCategory } from '@/payload-types'
import type { Where } from 'payload'
import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'

export const metadata = {
  title: '商品專區 - 懂陸姐 ChinaLink',
  description: '懂陸姐提供可直接下單的顧問商品方案，包含採購、帳號與內容營運等主題。',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const categoriesResult = await payload.find({
    collection: 'product-categories',
    limit: 100,
    sort: 'createdAt',
  })

  const where: Where = {
    status: { equals: 'published' },
    visibility: { equals: 'public' },
  }

  if (category) {
    const matchedCategory = categoriesResult.docs.find((item) => item.slug === category)
    if (matchedCategory) {
      where.productCategory = { equals: matchedCategory.id }
    }
  }

  const productsResult = await payload.find({
    collection: 'products',
    where,
    limit: 100,
    depth: 1,
    sort: '-createdAt',
  })

  const categories = categoriesResult.docs as ProductCategory[]
  const products = productsResult.docs as Product[]

  return (
    <section className="relative min-h-[50vh] overflow-hidden bg-brand-bg pt-32 pb-24">
      <div className="pointer-events-none absolute top-0 left-0 h-[560px] w-[560px] rounded-[60%_40%_70%_30%_/_40%_40%_60%_60%] bg-brand-cta/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-cta uppercase">
            <span className="h-px w-8 bg-brand-cta"></span>
            Product Center
          </div>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl">
            商品專區 <span className="font-playfair italic text-brand-cta">Collection</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-brand-muted">
            將高頻需求整理為可直接下單的商品方案，適合需要快速起步的大陸市場經營者。
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/products"
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                !category
                  ? 'border-brand-cta bg-brand-cta text-white'
                  : 'border-brand-primary/20 bg-white/70 text-brand-text hover:border-brand-cta/40'
              }`}
            >
              全部商品
            </Link>
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/products?category=${encodeURIComponent(item.slug)}`}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  category === item.slug
                    ? 'border-brand-cta bg-brand-cta text-white'
                    : 'border-brand-primary/20 bg-white/70 text-brand-text hover:border-brand-cta/40'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-24 text-center">
            <p className="font-serif text-xl text-brand-muted">目前沒有上架中的商品</p>
          </div>
        )}
      </div>
    </section>
  )
}
