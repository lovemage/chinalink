import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media, Post } from '@/payload-types'

type StepGuideBlockData = Extract<NonNullable<Post['content']>[number], { blockType: 'step-guide' }>
type StepEntry = NonNullable<StepGuideBlockData['steps']>[number]

interface Step {
  title: string
  screenshot?: (number | null) | Media
  id?: string | null
  description: StepEntry['description']
}

interface StepGuideBlockProps {
  steps?: Step[] | null
}

export function StepGuideBlock({ steps }: StepGuideBlockProps) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="my-8 space-y-8">
      {steps.map((step, index) => {
        const screenshot = typeof step.screenshot === 'object' && step.screenshot ? step.screenshot : null

        return (
          <div key={step.id || index} className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-brand-text">{step.title}</h3>
              <div className="prose prose-sm mt-2 max-w-none text-brand-muted">
                <RichText data={step.description} />
              </div>
              {screenshot?.url && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src={screenshot.url}
                    alt={screenshot.alt || step.title}
                    width={screenshot.width || 600}
                    height={screenshot.height || 400}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
