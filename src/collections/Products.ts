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

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: '商品管理',
    plural: '商品管理',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'productCategory', 'status', 'visibility'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, label: '商品名稱' },
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
      name: 'productCategory',
      type: 'relationship',
      relationTo: 'product-categories',
      admin: { position: 'sidebar' },
      label: '商品分類',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'product-tags',
      hasMany: true,
      label: '商品標籤',
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: '封面圖' },
    { name: 'summary', type: 'textarea', label: '商品摘要' },
    {
      name: 'description',
      type: 'blocks',
      label: '商品說明',
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
      name: 'variants',
      type: 'array',
      required: true,
      minRows: 1,
      label: '商品規格',
      fields: [
        { name: 'sku', type: 'text', required: true, label: 'SKU' },
        { name: 'name', type: 'text', required: true, label: '規格名稱' },
        {
          name: 'specs',
          type: 'array',
          label: '規格組合',
          fields: [
            { name: 'key', type: 'text', required: true, label: '規格名稱' },
            { name: 'value', type: 'text', required: true, label: '規格值' },
          ],
        },
        { name: 'price', type: 'number', required: true, label: '售價（新台幣）' },
        { name: 'compareAtPrice', type: 'number', label: '原價（新台幣）' },
        { name: 'stock', type: 'number', defaultValue: 0, required: true, label: '庫存' },
        { name: 'isDefault', type: 'checkbox', defaultValue: false, label: '預設規格' },
        { name: 'isActive', type: 'checkbox', defaultValue: true, label: '啟用' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '商品特點',
      fields: [{ name: 'text', type: 'text', required: true, label: '特點說明' }],
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
