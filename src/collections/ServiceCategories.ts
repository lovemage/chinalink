import type { CollectionConfig } from 'payload'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '分類名稱' },
    { name: 'slug', type: 'text', required: true, unique: true, label: '網址代稱' },
  ],
}
