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

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: '文章',
    plural: '文章',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, label: '標題' },
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
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
      label: '分類',
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: '封面圖' },
    { name: 'excerpt', type: 'textarea', label: '文章摘要' },
    { name: 'author', type: 'text', defaultValue: '懂陸姐', label: '作者' },
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
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
      label: '發佈日期',
    },
    {
      name: 'content',
      type: 'blocks',
      required: true,
      label: '內容',
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
