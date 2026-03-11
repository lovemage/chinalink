import Image from 'next/image'
import type { Media } from '@/payload-types'

interface ImageBlockComponentProps {
  image: number | Media
  caption?: string | null
  alignment?: ('left' | 'center' | 'right' | 'full') | null
}

const alignmentClasses: Record<string, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
  full: 'w-full',
}

export function ImageBlockComponent({ image, caption, alignment }: ImageBlockComponentProps) {
  const media = typeof image === 'object' ? image : null
  if (!media?.url) return null

  const align = alignment || 'center'

  return (
    <figure className={`my-6 ${align === 'full' ? 'w-full' : 'max-w-2xl'} ${alignmentClasses[align] || ''}`}>
      <div className="overflow-hidden rounded-xl">
        <Image
          src={media.url}
          alt={media.alt || ''}
          width={media.width || 800}
          height={media.height || 450}
          className="h-auto w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-brand-muted">{caption}</figcaption>
      )}
    </figure>
  )
}
