import type { Block } from 'payload'

export const StepGuide: Block = {
  slug: 'step-guide',
  labels: { singular: '步驟教學', plural: '步驟教學' },
  fields: [
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'richText', required: true },
        { name: 'screenshot', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
