import type { Block } from 'payload'

export const EmailOrderSummary: Block = {
  slug: 'email-order-summary',
  labels: { singular: '訂單摘要', plural: '訂單摘要' },
  fields: [
    {
      name: 'note',
      type: 'text',
      defaultValue: '此區塊會自動帶入訂單資料',
      admin: { readOnly: true },
      label: '說明',
    },
  ],
}
