import type { Block } from 'payload'

export const EmailImage: Block = {
  slug: 'email-image',
  labels: { singular: '圖片', plural: '圖片' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: '圖片' },
    { name: 'alt', type: 'text', label: '替代文字' },
  ],
}
