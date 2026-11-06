import Link from 'next/link'
import { Plus } from 'lucide-react'

export interface FaqListItem {
  question: string
  answer: string
  relatedHref?: string | null
  relatedTitle?: string | null
}

export function FaqList({ items, firstOpen = false }: { items: FaqListItem[]; firstOpen?: boolean }) {
  return (
    <div className="border-t border-brand-text">
      {items.map((item, index) => (
        <details key={item.question} open={firstOpen && index === 0} className="group border-b border-brand-rule">
          <summary className="flex items-start justify-between gap-6 py-5 transition-colors hover:text-brand-primary">
            <span className="font-serif text-[1.0625rem] font-medium leading-8 sm:text-lg">{item.question}</span>
            <Plus className="summary-icon mt-1.5 size-5 shrink-0 text-brand-wood transition-transform duration-200" aria-hidden="true" />
          </summary>
          <div className="max-w-[65ch] pb-6 text-[15px] leading-8 text-brand-muted whitespace-pre-line">
            {item.answer}
            {item.relatedHref && (
              <p className="mt-3 text-brand-text">
                延伸閱讀：
                <Link href={item.relatedHref} className="text-link">
                  {item.relatedTitle}
                </Link>
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
