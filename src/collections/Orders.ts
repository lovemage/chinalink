import type { CollectionConfig } from 'payload'
import { sendOrderEmail } from '@/hooks/sendOrderEmail'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: '訂單管理',
    plural: '訂單管理',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'orderStatus', 'amount', 'paymentStatus', 'createdAt'],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [sendOrderEmail],
  },
  fields: [
    {
      name: 'itemType',
      type: 'select',
      required: true,
      defaultValue: 'service',
      options: [
        { label: '服務', value: 'service' },
        { label: '商品', value: 'product' },
      ],
      label: '項目類型',
    },
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: '訂單編號',
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
              const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
              return `DL${dateStr}${rand}`
            }
            return value
          },
        ],
      },
    },
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, label: '會員' },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: '服務',
      admin: {
        condition: (_, siblingData) => siblingData?.itemType !== 'product',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: '商品',
      admin: {
        condition: (_, siblingData) => siblingData?.itemType === 'product',
      },
    },
    {
      name: 'productVariantSKU',
      type: 'text',
      label: '商品規格 SKU',
      admin: {
        condition: (_, siblingData) => siblingData?.itemType === 'product',
      },
    },
    {
      name: 'productVariantName',
      type: 'text',
      label: '商品規格名稱',
      admin: {
        condition: (_, siblingData) => siblingData?.itemType === 'product',
      },
    },
    {
      name: 'selectedAddons',
      type: 'array',
      label: '所選加購項目',
      fields: [
        { name: 'name', type: 'text', required: true, label: '項目名稱' },
        { name: 'price', type: 'number', required: true, label: '價格' },
      ],
    },
    { name: 'amount', type: 'number', required: true, label: '總金額（新台幣）' },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: '信用卡', value: 'credit_card' },
        { label: 'ATM 轉帳', value: 'atm' },
        { label: '超商代碼', value: 'cvs' },
      ],
      label: '付款方式',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: '待付款', value: 'pending' },
        { label: '已付款', value: 'paid' },
        { label: '付款失敗', value: 'failed' },
        { label: '已過期', value: 'expired' },
      ],
      label: '付款狀態',
    },
    {
      name: 'orderStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: '待處理', value: 'pending' },
        { label: '已付款', value: 'paid' },
        { label: '已完成', value: 'completed' },
      ],
      label: '訂單狀態',
      admin: {
        position: 'sidebar',
        description: '客服手動切換訂單處理進度',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: '訂購項目',
      admin: {
        description: '購物車多項訂單使用（服務與商品）',
      },
      fields: [
        {
          name: 'itemType',
          type: 'select',
          required: true,
          defaultValue: 'service',
          label: '類型',
          options: [
            { label: '服務', value: 'service' },
            { label: '商品', value: 'product' },
          ],
        },
        {
          name: 'serviceId',
          type: 'relationship',
          relationTo: 'services',
          label: '服務',
          admin: { condition: (_, siblingData) => siblingData?.itemType !== 'product' },
        },
        {
          name: 'serviceName',
          type: 'text',
          label: '服務名稱',
          admin: { condition: (_, siblingData) => siblingData?.itemType !== 'product' },
        },
        {
          name: 'productId',
          type: 'relationship',
          relationTo: 'products',
          label: '商品',
          admin: { condition: (_, siblingData) => siblingData?.itemType === 'product' },
        },
        {
          name: 'productName',
          type: 'text',
          label: '商品名稱',
          admin: { condition: (_, siblingData) => siblingData?.itemType === 'product' },
        },
        {
          name: 'variantSKU',
          type: 'text',
          label: '規格 SKU',
          admin: { condition: (_, siblingData) => siblingData?.itemType === 'product' },
        },
        {
          name: 'variantName',
          type: 'text',
          label: '規格名稱',
          admin: { condition: (_, siblingData) => siblingData?.itemType === 'product' },
        },
        { name: 'unitPrice', type: 'number', required: true, label: '單價' },
        { name: 'quantity', type: 'number', required: true, label: '數量', min: 1 },
        { name: 'subtotal', type: 'number', required: true, label: '小計' },
      ],
    },
    { name: 'ecpayTradeNo', type: 'text', label: '綠界交易編號', admin: { readOnly: true } },
    { name: 'note', type: 'textarea', label: '管理員備註' },
  ],
  timestamps: true,
}
