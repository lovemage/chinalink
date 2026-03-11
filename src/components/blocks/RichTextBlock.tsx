import { RichText } from '@payloadcms/richtext-lexical/react'

interface RichTextBlockProps {
  content: any
}

export function RichTextBlock({ content }: RichTextBlockProps) {
  return (
    <div className="prose prose-stone max-w-none prose-headings:text-brand-text prose-a:text-brand-primary prose-strong:text-brand-text">
      <RichText data={content} />
    </div>
  )
}
