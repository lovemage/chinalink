import type { Block } from 'payload'

export const EmailText: Block = {
  slug: 'email-text',
  labels: { singular: '文字', plural: '文字' },
  fields: [
    { name: 'text', type: 'textarea', required: true, label: '內容（支援 {{變數}}）' },
  ],
}
