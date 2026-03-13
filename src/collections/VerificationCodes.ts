import type { CollectionConfig } from 'payload'

export const VerificationCodes: CollectionConfig = {
  slug: 'verification-codes',
  labels: {
    singular: '驗證碼',
    plural: '驗證碼',
  },
  admin: {
    hidden: true,
  },
  access: {
    read: () => false,
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
  ],
  timestamps: true,
}
