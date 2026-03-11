import Image from 'next/image'
import type { Media } from '@/payload-types'

interface GalleryImage {
  image: number | Media
  caption?: string | null
  id?: string | null
}

interface ImageGalleryBlockProps {
  images?: GalleryImage[] | null
  layout?: ('grid' | 'carousel') | null
}

export function ImageGalleryBlock({ images, layout }: ImageGalleryBlockProps) {
  if (!images || images.length === 0) return null

  return (
    <div
      className={`my-6 grid gap-4 ${
        layout === 'carousel'
          ? 'grid-flow-col auto-cols-[280px] overflow-x-auto pb-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {images.map((item) => {
        const media = typeof item.image === 'object' ? item.image : null
        if (!media?.url) return null

        return (
          <figure key={item.id || media.id} className="overflow-hidden rounded-xl">
            <Image
              src={media.url}
              alt={media.alt || ''}
              width={media.width || 400}
              height={media.height || 300}
              className="h-auto w-full object-cover"
            />
            {item.caption && (
              <figcaption className="mt-2 text-center text-sm text-brand-muted">
                {item.caption}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}
