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
        { label: '置左', value: 'left' },
        { label: '置中', value: 'center' },
        { label: '置右', value: 'right' },
        { label: '滿版', value: 'full' },
      ],
    },
  ],
}
