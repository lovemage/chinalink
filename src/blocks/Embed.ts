import type { Block } from 'payload'

export const Embed: Block = {
  slug: 'embed',
  labels: { singular: '嵌入', plural: '嵌入' },
  fields: [
    { name: 'url', type: 'text', required: true, label: '嵌入網址' },
    { name: 'caption', type: 'text' },
  ],
}
