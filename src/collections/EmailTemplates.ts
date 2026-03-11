import type { CollectionConfig } from 'payload'
import {
  EmailHeading,
  EmailText,
  EmailButton,
  EmailImage,
  EmailOrderSummary,
  EmailDivider,
  EmailFooter,
} from '../blocks/email'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: '模板名稱' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: '代稱（程式呼叫用）',
      admin: { description: '如 welcome, order-paid, custom-quote' },
    },
    { name: 'subject', type: 'text', required: true, label: '信件主旨（支援 {{變數}}）' },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'system',
      options: [
        { label: '系統模板', value: 'system' },
        { label: '行銷模板', value: 'marketing' },
      ],
      label: '類型',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '啟用', value: 'active' },
      ],
      label: '狀態',
      admin: { position: 'sidebar' },
    },
    {
      name: 'availableVariables',
      type: 'array',
      label: '可用變數表',
      admin: {
        position: 'sidebar',
        description: '此模板可使用的變數',
      },
      fields: [
        { name: 'key', type: 'text', required: true, label: '變數名（如 customerName）' },
        { name: 'description', type: 'text', required: true, label: '說明（如「會員姓名」）' },
      ],
    },
    {
      name: 'content',
      type: 'blocks',
      required: true,
      label: '模板內容',
      blocks: [
        EmailHeading,
        EmailText,
        EmailButton,
        EmailImage,
        EmailOrderSummary,
        EmailDivider,
        EmailFooter,
      ],
    },
  ],
  timestamps: true,
}
