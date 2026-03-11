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
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Tip', value: 'tip' },
      ],
    },
    { name: 'content', type: 'richText', required: true },
  ],
}
