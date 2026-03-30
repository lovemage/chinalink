export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import type { ComponentProps } from 'react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getProductBySlug } from '@/lib/queries/products'

type BlockRendererBlocks = ComponentProps<typeof BlockRenderer>['blocks']

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: '找不到商品' }

  return {
    title: product.seoTitle || `${product.title} - 懂陸姐 ChinaLink`,
    description: product.seoDescription || product.summary || `懂陸姐 - ${product.title}`,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()
  if (product.status !== 'published') notFound()
  if (product.visibility === 'private') notFound()

  const cover = product.coverImage
  const category = product.productCategory
  const tags = (product.tagRelations || []).map((rel) => rel.tag).filter(Boolean)

  const variants = (product.variants || []).filter((variant) => variant.isActive !== false)
  const sortedPrices = variants.map((variant) => variant.price).sort((a, b) => a - b)
  const lowestPrice = sortedPrices.length > 0 ? sortedPrices[0] : null

  return (
    <article className="relative min-h-screen overflow-hidden bg-brand-bg pt-32 pb-24">
      <div className="pointer-events-none absolute top-0 left-0 h-[50vh] w-full bg-gradient-to-b from-brand-cta/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Back link */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-cta"
        >
          <ArrowLeft className="h-4 w-4" />
          返回商品專區
        </Link>

        {cover?.url && (
          <div className="relative mb-12 aspect-[2/1] overflow-hidden rounded-[2.5rem] border border-white/50 shadow-2xl shadow-brand-text/5">
            <Image
              src={cover.heroUrl || cover.url}
              alt={cover.alt || product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {category && (
            <span className="inline-block rounded-full border border-brand-cta/20 bg-white/50 px-5 py-1.5 text-xs font-semibold tracking-widest text-brand-cta uppercase backdrop-blur-md shadow-sm">
              {category.name}
            </span>
          )}
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-block rounded-full border border-brand-primary/20 bg-white/50 px-3 py-1 text-xs font-medium text-brand-muted"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <h1 className="text-center font-serif text-4xl font-medium leading-tight text-brand-text sm:text-left sm:text-5xl lg:text-6xl">
          {product.title}
        </h1>

        {product.summary && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-muted">{product.summary}</p>
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2.5rem] border border-brand-primary/10 bg-white p-8 shadow-xl shadow-brand-primary/5 sm:p-12">
            {product.description && (
              <div className="prose prose-stone prose-lg max-w-none font-light leading-relaxed text-brand-muted prose-headings:font-serif prose-headings:font-medium prose-headings:text-brand-text">
                <BlockRenderer blocks={product.description as BlockRendererBlocks} />
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mt-12 border-t border-brand-primary/10 pt-12">
                <h2 className="mb-6 font-serif text-2xl font-medium text-brand-text">商品特點</h2>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3 text-brand-muted">
                      <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-brand-cta" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="self-start rounded-[2.5rem] border border-brand-primary/10 bg-white p-6 shadow-xl shadow-brand-primary/5 lg:sticky lg:top-32">
            <p className="text-sm text-brand-muted">方案價格</p>
            <p className="mt-1 text-3xl font-semibold text-brand-cta">
              {lowestPrice !== null ? `NT$ ${lowestPrice.toLocaleString()} 起` : '尚未定價'}
            </p>

            {variants.length > 0 && (
              <div className="mt-6 space-y-3">
                {variants.map((variant) => (
                  <div key={variant.id} className="rounded-2xl border border-brand-primary/10 p-4">
                    <p className="font-medium text-brand-text">{variant.name}</p>
                    <p className="mt-1 text-sm text-brand-muted">SKU: {variant.sku}</p>
                    <p className="mt-2 font-medium text-brand-cta">NT$ {variant.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/service-cart?addProduct=${product.slug}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-cta px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-cta/90 active:scale-[0.98]"
            >
              <ShoppingCart className="h-5 w-5" />
              加入購物車
            </Link>
          </aside>
        </div>
      </div>
    </article>
  )
}
