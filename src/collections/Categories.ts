import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: '文章分類',
    plural: '文章分類',
  },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '分類名稱' },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' }, label: '網址代稱' },
  ],
}
