import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '網站設定',
  access: { read: () => true },
  fields: [
    {
      name: 'lineOfficialUrl',
      type: 'text',
      required: true,
      label: '官方 LINE 連結',
      defaultValue: '',
      admin: {
        description: '官方 LINE 帳號連結，用於訂單完成後引導會員聯繫客服',
      },
    },
    {
      name: 'lineOfficialId',
      type: 'text',
      label: 'LINE 官方帳號 ID',
      admin: {
        description: '例如 @chinalink，顯示在前台供會員辨識',
      },
    },
  ],
}
