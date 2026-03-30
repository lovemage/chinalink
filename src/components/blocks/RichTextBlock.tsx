import { RichText } from '@/components/RichText'
import type { RichTextBlockData } from '@/lib/types'

interface RichTextBlockProps {
  content: RichTextBlockData['content']
}

export function RichTextBlock({ content }: RichTextBlockProps) {
  return (
    <div className="prose prose-stone max-w-none prose-headings:text-brand-text prose-a:text-brand-primary prose-strong:text-brand-text">
      <RichText data={content} />
    </div>
  )
}
