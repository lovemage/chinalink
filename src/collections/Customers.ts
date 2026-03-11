import type { CollectionConfig } from 'payload'
import { sendWelcomeEmail } from '@/hooks/sendWelcomeEmail'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'authProvider', 'lastLoginAt'],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [sendWelcomeEmail],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '姓名' },
    { name: 'email', type: 'email', required: true, unique: true, label: 'Email' },
    { name: 'phone', type: 'text', label: '電話' },
    { name: 'avatar', type: 'text', label: '大頭照 URL' },
    {
      name: 'authProvider',
      type: 'select',
      required: true,
      options: [
        { label: 'LINE', value: 'line' },
        { label: 'Google', value: 'google' },
      ],
      label: '登入方式',
    },
    { name: 'providerId', type: 'text', required: true, label: '第三方 ID', admin: { readOnly: true } },
    { name: 'lastLoginAt', type: 'date', label: '最後登入' },
  ],
  timestamps: true,
}
