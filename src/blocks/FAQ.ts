import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  labels: { singular: '常見問題', plural: '常見問題' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ],
}
