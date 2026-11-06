import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

export interface DrizzleProductVariant {
  id: number
  sku: string
  name: string
  price: number
  isActive: boolean | null
  sortOrder: number | null
}

export interface DrizzleProductForCard {
  id: number
  title: string
  slug: string
  summary: string | null
  coverImage: { id: number; url: string; alt: string | null; cardUrl: string | null } | null
  variants: DrizzleProductVariant[]
}

interface ProductCardProps {
  product: DrizzleProductForCard
}

function getDisplayPrice(product: DrizzleProductForCard) {
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
  const cover = product.coverImage
  const startingPrice = getDisplayPrice(product)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-brand-primary/10 bg-brand-raised transition-all duration-300 "
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg m-2 ">
        {cover?.url ? (
          <Image
            src={cover.cardUrl || cover.url}
            alt={cover.alt || product.title}
            fill
            className="object-cover transition-transform duration-500 "
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
            <p className="text-xs text-brand-muted">起始價格</p>
            <p className="mt-1 font-serif text-xl font-medium text-brand-cta">
              {startingPrice !== null ? `NT$ ${startingPrice.toLocaleString()}` : '待上架'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-brand-cta/10 px-4 py-2 text-sm font-medium text-brand-cta transition-all duration-200 group-hover:bg-brand-cta group-hover:text-white">
            <ShoppingCart className="h-4 w-4" />
            加入購物車
          </span>
        </div>
      </div>
    </Link>
  )
}
