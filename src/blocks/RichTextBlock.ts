import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: '段落', plural: '段落' },
  fields: [
    { name: 'content', type: 'richText', required: true, label: '內容' },
  ],
}
