import type { Block } from 'payload'

export const TableBlock: Block = {
  slug: 'table',
  labels: { singular: '表格', plural: '表格' },
  fields: [
    {
      name: 'headers',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
