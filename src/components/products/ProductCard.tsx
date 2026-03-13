import Link from 'next/link'
import Image from 'next/image'
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
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-primary/10 bg-white shadow-xl shadow-brand-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-primary/8">
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

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-serif text-2xl font-medium text-brand-text line-clamp-2">{product.title}</h2>
        {product.summary && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-muted">{product.summary}</p>}

        <div className="mt-auto pt-6">
          <p className="text-xs tracking-wider text-brand-muted uppercase">起始價格</p>
          <p className="mt-1 text-2xl font-semibold text-brand-cta">
            {startingPrice !== null ? `NT$ ${startingPrice.toLocaleString()}` : '待上架'}
          </p>
        </div>
      </div>
    </Link>
  )
}
