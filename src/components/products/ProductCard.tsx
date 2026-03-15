import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import type { Media, Product } from '@/payload-types'

interface ProductCardProps {
  product: Product
}

function getDisplayPrice(product: Product) {
  const variants = product.variants || []
  const activeVariants = variants.filter((variant) => variant.isActive !== false)
  const priceCandidates = (activeVariants.length > 0 ? activeVariants : variants)
    .map((variant) => variant.price)
    .filter((price) => typeof price === 'number')

  if (priceCandidates.length === 0) {
    return null
  }

  return Math.min(...priceCandidates)
}

export function ProductCard({ product }: ProductCardProps) {
  const cover =
    typeof product.coverImage === 'object' && product.coverImage
      ? (product.coverImage as Media)
      : null
  const startingPrice = getDisplayPrice(product)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-brand-primary/10 bg-white shadow-xl shadow-brand-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg m-2 rounded-[2rem]">
        {cover?.url ? (
          <Image
            src={cover.sizes?.card?.url || cover.url}
            alt={cover.alt || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-muted">商品圖片</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="font-serif text-2xl font-medium text-brand-text transition-colors group-hover:text-brand-cta line-clamp-2">
          {product.title}
        </h3>
        {product.summary && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-muted">{product.summary}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-xs tracking-wider text-brand-muted uppercase">起始價格</p>
            <p className="mt-1 font-serif text-xl font-medium text-brand-cta">
              {startingPrice !== null ? `NT$ ${startingPrice.toLocaleString()}` : '待上架'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-cta/10 px-4 py-2 text-sm font-medium text-brand-cta transition-all duration-200 group-hover:bg-brand-cta group-hover:text-white">
            <ShoppingCart className="h-4 w-4" />
            加入購物車
          </span>
        </div>
      </div>
    </Link>
  )
}
