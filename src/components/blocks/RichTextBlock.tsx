import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Post } from '@/payload-types'

type RichTextBlockData = Extract<NonNullable<Post['content']>[number], { blockType: 'rich-text' }>

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
