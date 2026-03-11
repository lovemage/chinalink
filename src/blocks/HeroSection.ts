import type { Block } from 'payload'

export const HeroSection: Block = {
  slug: 'hero-section',
  labels: { singular: '引言區', plural: '引言區' },
  fields: [
    { name: 'heading', type: 'text', required: true, label: '大標題' },
    { name: 'subheading', type: 'text', label: '副標題' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: '背景圖' },
  ],
}
