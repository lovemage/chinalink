import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'image-gallery',
  labels: { singular: '圖片集', plural: '圖片集' },
  fields: [
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: '網格', value: 'grid' },
        { label: '輪播', value: 'carousel' },
      ],
    },
  ],
}
