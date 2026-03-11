import type { Block } from 'payload'

export const EmailFooter: Block = {
  slug: 'email-footer',
  labels: { singular: '頁尾', plural: '頁尾' },
  fields: [
    { name: 'text', type: 'textarea', label: '頁尾文字（支援 {{變數}}）' },
  ],
}
