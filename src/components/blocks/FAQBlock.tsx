'use client'

import { useState } from 'react'
import { RichText } from '@/components/RichText'
import { ChevronDown } from 'lucide-react'
import type { LexicalNode } from '@/lib/types'

interface FAQItem {
  question: string
  id?: string | null
  answer?: LexicalNode | null
}

interface FAQBlockProps {
  items?: FAQItem[] | null
}

export function FAQBlock({ items }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <div className="my-6 divide-y divide-gray-200 rounded-xl border border-gray-200">
      {items.map((item, index) => (
        <div key={item.id || index}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-brand-text transition-colors hover:bg-brand-primary/5"
          >
            <span className="font-medium">{item.question}</span>
            <ChevronDown
              className={`h-5 w-5 flex-shrink-0 text-brand-muted transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="prose prose-sm max-w-none px-5 pb-4 text-brand-muted">
              <RichText data={item.answer} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
