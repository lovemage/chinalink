import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: '行動呼籲', plural: '行動呼籲' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'buttonText', type: 'text', required: true },
    { name: 'buttonLink', type: 'text', required: true },
  ],
}
