import { RichText } from '@payloadcms/richtext-lexical/react'
import { Info, AlertTriangle, Lightbulb } from 'lucide-react'
import type { Post } from '@/payload-types'

type CalloutData = Extract<NonNullable<Post['content']>[number], { blockType: 'callout' }>

interface CalloutBlockProps {
  type?: CalloutData['type']
  content: CalloutData['content']
}

const calloutStyles: Record<string, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: Info,
    iconColor: 'text-blue-600',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  tip: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: Lightbulb,
    iconColor: 'text-green-600',
  },
}

export function CalloutBlock({ type, content }: CalloutBlockProps) {
  const style = calloutStyles[type || 'info'] || calloutStyles.info
  const Icon = style.icon

  return (
    <div className={`my-6 rounded-xl border-l-4 ${style.border} ${style.bg} p-5`}>
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.iconColor}`} />
        <div className="prose prose-sm max-w-none prose-headings:text-brand-text">
          <RichText data={content} />
        </div>
      </div>
    </div>
  )
}
