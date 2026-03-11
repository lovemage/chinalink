import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: '圖片', plural: '圖片' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', label: '圖說' },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Full', value: 'full' },
      ],
    },
  ],
}
