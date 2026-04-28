'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { homeFaqs } from '@/lib/content/faq'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-brand-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary"></span>
            FAQ
            <span className="h-px w-8 bg-brand-primary"></span>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl md:text-5xl">
            常見問題
          </h2>
          <p className="mt-4 text-lg text-brand-muted">
            第一次接觸大陸市場？這些是大家最常問的問題
          </p>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-border/60">
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  <span className="text-base font-semibold text-brand-text sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-muted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-base leading-relaxed text-brand-muted">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
