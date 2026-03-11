import type { Block } from 'payload'

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: '提示框', plural: '提示框' },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: '資訊', value: 'info' },
        { label: '警告', value: 'warning' },
        { label: '提示', value: 'tip' },
      ],
    },
    { name: 'content', type: 'richText', required: true },
  ],
}
