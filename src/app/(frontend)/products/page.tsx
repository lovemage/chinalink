export const dynamic = 'force-dynamic'

import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'
import { getProductCategoriesAll, getPublishedProductsWithDetails } from '@/lib/queries/products'

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

  const [categories, products] = await Promise.all([
    getProductCategoriesAll(),
    getPublishedProductsWithDetails(category),
  ])

  return (
    <section className="relative min-h-screen overflow-hidden bg-brand-bg pt-32 pb-24">
      <div className="pointer-events-none absolute -top-20 left-0 h-[600px] w-[600px] rounded-[60%_40%_70%_30%_/_40%_40%_60%_60%] bg-brand-cta/5 blur-3xl opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-cta uppercase">
            <span className="h-px w-8 bg-brand-cta" />
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
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                !category
                  ? 'border-brand-cta bg-brand-cta text-white shadow-lg shadow-brand-cta/20'
                  : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-cta/40 hover:bg-white'
              }`}
            >
              全部商品
            </Link>
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/products?category=${encodeURIComponent(item.slug)}`}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  category === item.slug
                    ? 'border-brand-cta bg-brand-cta text-white shadow-lg shadow-brand-cta/20'
                    : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-cta/40 hover:bg-white'
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
