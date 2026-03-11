import type { Media } from '@/payload-types'

interface HeroSectionBlockProps {
  heading: string
  subheading?: string | null
  backgroundImage?: (number | null) | Media
}

export function HeroSectionBlock({ heading, subheading, backgroundImage }: HeroSectionBlockProps) {
  const bgImage = typeof backgroundImage === 'object' && backgroundImage ? backgroundImage : null

  return (
    <section
      className="relative flex min-h-[320px] items-center justify-center rounded-2xl bg-brand-primary/10 px-6 py-16 text-center"
      style={
        bgImage?.url
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="max-w-3xl">
        <h1
          className={`text-3xl font-bold sm:text-4xl lg:text-5xl ${bgImage?.url ? 'text-white' : 'text-brand-text'}`}
        >
          {heading}
        </h1>
        {subheading && (
          <p
            className={`mt-4 text-lg sm:text-xl ${bgImage?.url ? 'text-white/90' : 'text-brand-muted'}`}
          >
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}
