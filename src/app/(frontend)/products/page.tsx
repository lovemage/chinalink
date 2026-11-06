export const dynamic = 'force-dynamic'

import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'
import { PageHeader } from '@/components/site/PageHeader'
import { getProductCategoriesAll, getPublishedProductsWithDetails } from '@/lib/queries/products'

export const metadata = {
  title: '商品專區｜懂陸姐 ChinaLink',
  description: '懂陸姐提供可直接下單的顧問商品方案，包含採購、帳號與內容營運等主題。',
  alternates: { canonical: '/products' },
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
    <section className="pb-20">
      <PageHeader title="商品專區" description="將常見需求整理成可直接下單的商品方案，適合需要快速起步的大陸市場經營者。" />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {categories.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/products"
              className={`border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                !category
                  ? 'bg-brand-tint font-bold text-brand-text border-brand-tint'
                  : 'border-brand-rule bg-brand-raised text-brand-text hover:bg-brand-tint'
              }`}
            >
              全部商品
            </Link>
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/products?category=${encodeURIComponent(item.slug)}`}
                className={`border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  category === item.slug
                    ? 'bg-brand-tint font-bold text-brand-text border-brand-tint'
                    : 'border-brand-rule bg-brand-raised text-brand-text hover:bg-brand-tint'
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
