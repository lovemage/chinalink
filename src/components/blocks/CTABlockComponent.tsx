import Link from 'next/link'

interface CTABlockComponentProps {
  heading: string
  description?: string | null
  buttonText: string
  buttonLink: string
}

export function CTABlockComponent({ heading, description, buttonText, buttonLink }: CTABlockComponentProps) {
  return (
    <div className="my-8 rounded-2xl bg-brand-primary/10 px-6 py-10 text-center">
      <h3 className="text-2xl font-bold text-brand-text">{heading}</h3>
      {description && <p className="mt-3 text-brand-muted">{description}</p>}
      <Link
        href={buttonLink}
        className="mt-6 inline-block rounded-full bg-brand-cta px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-cta/90"
      >
        {buttonText}
      </Link>
    </div>
  )
}
