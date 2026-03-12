import type { CollectionConfig } from 'payload'
import { sendOrderEmail } from '@/hooks/sendOrderEmail'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: '訂單',
    plural: '訂單',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'service', 'amount', 'paymentStatus', 'createdAt'],
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
      required: true,
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
    { name: 'ecpayTradeNo', type: 'text', label: '綠界交易編號', admin: { readOnly: true } },
    { name: 'note', type: 'textarea', label: '管理員備註' },
  ],
  timestamps: true,
}
