import { getPayload } from 'payload'
import configPromise from '@payload-config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chinalink.tw'

interface TemplateData {
  name: string
  slug: string
  subject: string
  type: 'system'
  status: 'active'
  availableVariables: Array<{ key: string; description: string }>
  content: Array<Record<string, unknown>>
}

const templates: TemplateData[] = [
  {
    name: '歡迎加入懂陸姐',
    slug: 'welcome',
    subject: '歡迎加入懂陸姐！',
    type: 'system',
    status: 'active',
    availableVariables: [{ key: 'customerName', description: '會員姓名' }],
    content: [
      { blockType: 'email-heading', text: '歡迎加入懂陸姐！', level: 'h1' },
      {
        blockType: 'email-text',
        text: '親愛的 {{customerName}}，\n\n感謝您加入懂陸姐！我們致力於為您提供最專業的兩岸商務服務，協助您輕鬆拓展大陸市場。\n\n如有任何需求，歡迎隨時與我們聯繫。',
      },
      {
        blockType: 'email-button',
        text: '瀏覽服務',
        url: `${siteUrl}/services`,
      },
      {
        blockType: 'email-footer',
        text: '此信件由懂陸姐系統自動發送，請勿直接回覆。',
      },
    ],
  },
  {
    name: '訂單已建立',
    slug: 'order-created',
    subject: '訂單已建立 — {{orderNumber}}',
    type: 'system',
    status: 'active',
    availableVariables: [
      { key: 'customerName', description: '會員姓名' },
      { key: 'orderNumber', description: '訂單編號' },
      { key: 'serviceName', description: '服務名稱' },
      { key: 'amount', description: '訂單金額' },
    ],
    content: [
      { blockType: 'email-heading', text: '訂單建立成功', level: 'h1' },
      {
        blockType: 'email-text',
        text: '{{customerName}} 您好，\n\n您的訂單已成功建立，以下為訂單資訊：\n\n訂單編號：{{orderNumber}}\n服務項目：{{serviceName}}\n訂單金額：NT$ {{amount}}',
      },
      { blockType: 'email-order-summary', note: '此區塊會自動帶入訂單資料' },
      {
        blockType: 'email-button',
        text: '查看訂單',
        url: `${siteUrl}/orders/{{orderNumber}}`,
      },
      {
        blockType: 'email-footer',
        text: '此信件由懂陸姐系統自動發送，請勿直接回覆。',
      },
    ],
  },
  {
    name: '付款成功',
    slug: 'order-paid',
    subject: '付款成功 — {{orderNumber}}',
    type: 'system',
    status: 'active',
    availableVariables: [
      { key: 'customerName', description: '會員姓名' },
      { key: 'orderNumber', description: '訂單編號' },
      { key: 'serviceName', description: '服務名稱' },
      { key: 'amount', description: '訂單金額' },
      { key: 'paymentMethod', description: '付款方式' },
    ],
    content: [
      { blockType: 'email-heading', text: '付款成功', level: 'h1' },
      {
        blockType: 'email-text',
        text: '{{customerName}} 您好，\n\n我們已收到您的付款，以下為付款資訊：\n\n訂單編號：{{orderNumber}}\n服務項目：{{serviceName}}\n付款金額：NT$ {{amount}}\n付款方式：{{paymentMethod}}',
      },
      { blockType: 'email-order-summary', note: '此區塊會自動帶入訂單資料' },
      {
        blockType: 'email-text',
        text: '我們將盡快為您安排服務，如有任何問題請隨時與我們聯繫。',
      },
      {
        blockType: 'email-footer',
        text: '此信件由懂陸姐系統自動發送，請勿直接回覆。',
      },
    ],
  },
  {
    name: '付款失敗',
    slug: 'order-failed',
    subject: '付款未成功 — {{orderNumber}}',
    type: 'system',
    status: 'active',
    availableVariables: [
      { key: 'customerName', description: '會員姓名' },
      { key: 'orderNumber', description: '訂單編號' },
      { key: 'serviceName', description: '服務名稱' },
      { key: 'amount', description: '訂單金額' },
    ],
    content: [
      { blockType: 'email-heading', text: '付款未成功', level: 'h1' },
      {
        blockType: 'email-text',
        text: '{{customerName}} 您好，\n\n很抱歉，您的付款未成功。\n\n訂單編號：{{orderNumber}}\n服務項目：{{serviceName}}\n訂單金額：NT$ {{amount}}\n\n請確認您的付款資訊後重新嘗試，或選擇其他付款方式。',
      },
      {
        blockType: 'email-button',
        text: '重新付款',
        url: `${siteUrl}/orders/{{orderNumber}}/pay`,
      },
      {
        blockType: 'email-footer',
        text: '此信件由懂陸姐系統自動發送，請勿直接回覆。',
      },
    ],
  },
  {
    name: '收到詢價通知',
    slug: 'inquiry-received',
    subject: '新詢價通知 — 來自 {{customerName}}',
    type: 'system',
    status: 'active',
    availableVariables: [
      { key: 'customerName', description: '客戶姓名' },
      { key: 'contactMethod', description: '聯繫方式' },
      { key: 'serviceName', description: '相關服務' },
      { key: 'message', description: '需求說明' },
    ],
    content: [
      { blockType: 'email-heading', text: '新詢價通知', level: 'h1' },
      {
        blockType: 'email-text',
        text: '收到來自 {{customerName}} 的詢價。',
      },
      {
        blockType: 'email-text',
        text: '聯繫方式：{{contactMethod}}',
      },
      {
        blockType: 'email-text',
        text: '相關服務：{{serviceName}}',
      },
      {
        blockType: 'email-text',
        text: '需求說明：\n{{message}}',
      },
      {
        blockType: 'email-footer',
        text: '此為系統自動通知，請至後台查看完整詢價資訊。',
      },
    ],
  },
  {
    name: '客製報價回覆',
    slug: 'custom-quote',
    subject: '您的客製化報價 — {{serviceName}}',
    type: 'system',
    status: 'active',
    availableVariables: [
      { key: 'customerName', description: '會員姓名' },
      { key: 'serviceName', description: '服務名稱' },
      { key: 'quoteAmount', description: '報價金額' },
      { key: 'quoteDetails', description: '報價明細' },
    ],
    content: [
      { blockType: 'email-heading', text: '報價通知', level: 'h1' },
      {
        blockType: 'email-text',
        text: '{{customerName}} 您好，\n\n以下是您的客製化報價：\n\n服務項目：{{serviceName}}\n報價金額：NT$ {{quoteAmount}}',
      },
      {
        blockType: 'email-text',
        text: '{{quoteDetails}}',
      },
      {
        blockType: 'email-footer',
        text: '此信件由懂陸姐系統自動發送，如有疑問請聯繫我們。',
      },
    ],
  },
]

export async function seedEmailTemplates() {
  const payload = await getPayload({ config: configPromise })

  for (const template of templates) {
    const existing = await payload.find({
      collection: 'email-templates',
      where: { slug: { equals: template.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`[seed] Template "${template.slug}" already exists, skipping.`)
      continue
    }

    await payload.create({
      collection: 'email-templates',
      data: template as never,
    })

    console.log(`[seed] Created template: ${template.slug}`)
  }

  console.log('[seed] Email template seeding complete.')
}
