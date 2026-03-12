export const serviceIconOptions = [
  { label: '身份徽章', value: 'badge' },
  { label: '客服支援', value: 'support_agent' },
  { label: '商品驗貨', value: 'inventory_2' },
  { label: '商店開設', value: 'storefront' },
  { label: '行銷推廣', value: 'campaign' },
  { label: '任務清單', value: 'checklist' },
] as const

export const defaultServiceIconName = 'support_agent'

export type ServiceIconName = (typeof serviceIconOptions)[number]['value']
