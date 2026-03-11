import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [{ label: '管理員', value: 'admin' }],
      required: true,
    },
  ],
}
