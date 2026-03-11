import type { CollectionConfig } from 'payload'
import { sendInquiryEmail } from '@/hooks/sendInquiryEmail'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'customer', 'service', 'status', 'createdAt'],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [sendInquiryEmail],
  },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', label: '會員' },
    { name: 'service', type: 'relationship', relationTo: 'services', label: '相關服務' },
    { name: 'name', type: 'text', required: true, label: '姓名' },
    { name: 'contactMethod', type: 'text', required: true, label: '聯繫方式（Line ID / 微信）' },
    { name: 'message', type: 'textarea', required: true, label: '需求說明' },
    {
      name: 'attachments',
      type: 'array',
      label: '附件',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '新需求', value: 'new' },
        { label: '已聯繫', value: 'contacted' },
        { label: '已報價', value: 'quoted' },
        { label: '已結案', value: 'closed' },
      ],
      label: '狀態',
    },
  ],
  timestamps: true,
}
