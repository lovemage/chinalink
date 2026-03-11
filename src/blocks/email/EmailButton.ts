import type { Block } from 'payload'

export const EmailButton: Block = {
  slug: 'email-button',
  labels: { singular: '按鈕', plural: '按鈕' },
  fields: [
    { name: 'text', type: 'text', required: true, label: '按鈕文字' },
    { name: 'url', type: 'text', required: true, label: '連結（支援 {{變數}}）' },
  ],
}
