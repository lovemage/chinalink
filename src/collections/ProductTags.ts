import type { CollectionConfig } from 'payload'

export const ProductTags: CollectionConfig = {
  slug: 'product-tags',
  labels: {
    singular: '商品標籤',
    plural: '商品標籤',
  },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '標籤名稱' },
    { name: 'slug', type: 'text', required: true, unique: true, label: '網址代稱' },
  ],
}
