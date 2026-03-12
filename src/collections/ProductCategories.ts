import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: '商品分類',
    plural: '商品分類',
  },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '分類名稱' },
    { name: 'slug', type: 'text', required: true, unique: true, label: '網址代稱' },
  ],
}
