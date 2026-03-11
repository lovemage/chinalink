import type { Block } from 'payload'

export const EmailHeading: Block = {
  slug: 'email-heading',
  labels: { singular: '標題', plural: '標題' },
  fields: [
    { name: 'text', type: 'text', required: true, label: '標題文字（支援 {{變數}}）' },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
      ],
      label: '層級',
    },
  ],
}
