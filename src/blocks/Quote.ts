import type { Block } from 'payload'

export const Quote: Block = {
  slug: 'quote',
  labels: { singular: '引用', plural: '引用' },
  fields: [
    { name: 'quoteText', type: 'textarea', required: true },
    { name: 'source', type: 'text' },
  ],
}
