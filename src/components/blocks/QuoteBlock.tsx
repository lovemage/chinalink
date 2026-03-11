interface QuoteBlockProps {
  quoteText: string
  source?: string | null
}

export function QuoteBlock({ quoteText, source }: QuoteBlockProps) {
  return (
    <blockquote className="my-6 border-l-4 border-brand-primary/40 bg-brand-primary/5 py-4 pl-6 pr-4">
      <p className="text-lg italic leading-relaxed text-brand-text">&ldquo;{quoteText}&rdquo;</p>
      {source && <cite className="mt-3 block text-sm not-italic text-brand-muted">&mdash; {source}</cite>}
    </blockquote>
  )
}
