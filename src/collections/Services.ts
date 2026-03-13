import type { CollectionConfig } from 'payload'

import {
  HeroSection,
  RichTextBlock,
  ImageBlock,
  ImageGallery,
  Callout,
  Quote,
  StepGuide,
  FAQ,
  CTABlock,
  TableBlock,
  Embed,
  Divider,
} from '../blocks'
import { defaultServiceIconName, serviceIconOptions } from '@/lib/services/serviceIcons'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: '服務管理',
    plural: '服務管理',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'serviceCategory', 'pricingMode', 'status', 'visibility'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, label: '服務名稱' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      label: '網址代稱',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'serviceCategory',
      type: 'relationship',
      relationTo: 'service-categories',
      admin: { position: 'sidebar' },
      label: '服務分類',
    },
    {
      name: 'iconName',
      type: 'select',
      required: true,
      defaultValue: defaultServiceIconName,
      options: serviceIconOptions.map((option) => ({
        label: option.label,
        value: option.value,
      })),
      admin: {
        position: 'sidebar',
        components: {
          beforeInput: ['./components/payload/ServiceIconPreviewField.tsx#ServiceIconPreviewField'],
        },
      },
      label: '服務圖示',
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: '封面圖' },
    {
      name: 'description',
      type: 'blocks',
      label: '服務說明',
      blocks: [
        HeroSection,
        RichTextBlock,
        ImageBlock,
        ImageGallery,
        Callout,
        Quote,
        StepGuide,
        FAQ,
        CTABlock,
        TableBlock,
        Embed,
        Divider,
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已發佈', value: 'published' },
      ],
      admin: { position: 'sidebar' },
      label: '狀態',
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: '公開', value: 'public' },
        { label: '私密', value: 'private' },
        { label: '專屬連結', value: 'unlisted' },
      ],
      admin: { position: 'sidebar' },
      label: '可見性',
    },
    {
      name: 'pricingMode',
      type: 'select',
      required: true,
      defaultValue: 'fixed',
      options: [
        { label: '固定價格', value: 'fixed' },
        { label: '加購項目', value: 'addons' },
        { label: '自訂報價', value: 'custom' },
      ],
      label: '定價模式',
    },
    {
      name: 'price',
      type: 'number',
      label: '價格（新台幣）',
      admin: {
        condition: (data) => data?.pricingMode === 'fixed',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      label: '基本價格（新台幣）',
      admin: {
        condition: (data) => data?.pricingMode === 'addons',
      },
    },
    {
      name: 'addons',
      type: 'array',
      label: '加購項目',
      admin: {
        condition: (data) => data?.pricingMode === 'addons',
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: '項目名稱' },
        { name: 'price', type: 'number', required: true, label: '價格（新台幣）' },
        { name: 'required', type: 'checkbox', defaultValue: false, label: '必選' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '服務特點',
      fields: [
        { name: 'text', type: 'text', required: true, label: '特點說明' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: '搜尋優化',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text', label: 'SEO 標題' },
        { name: 'metaDescription', type: 'textarea', label: 'SEO 描述' },
      ],
    },
  ],
}
