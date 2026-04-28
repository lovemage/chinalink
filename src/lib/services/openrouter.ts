import type { AiChatMessage } from '@/lib/queries/ai-chat'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const GUARD_PROMPT = `
你是懂陸姐網站的 AI 客服。
你只能回答本站「商品、服務、下單、付款、會員、聯絡方式、站內文章」相關問題。
以下類型問題一律拒答：政治、醫療、法律、投資、程式設計、翻譯、一般知識、站外推薦或任何與本站無關問題。
回覆格式必須清楚分行，重點請換行呈現，不要全部擠成同一行。
若要提供連結，只能使用我提供給你的「可用連結清單」中的網址，禁止自行猜測或拼接任何網址。
遇到拒答時，請簡短說明你僅提供站內商品/服務協助，並建議使用者改聯繫官方 LINE 或 WhatsApp。
不要捏造商品、價格、時程、庫存、保證或任何未提供資訊。
`.trim()

interface OpenRouterInput {
  apiKey: string
  model: string
  adminPrompt: string
  userMessage: string
  history: AiChatMessage[]
  lineOfficialUrl?: string
  lineOfficialId?: string
  whatsappUrl?: string
  context: {
    publishedProducts: Array<{
      title: string
      slug: string
      summary: string | null
      description: string
    }>
    publishedServices: Array<{
      title: string
      slug: string
      pricingMode: string
      price: number | null
      basePrice: number | null
      description: string
    }>
    homeFaqs: Array<{
      q: string
      a: string
    }>
    postFaqs: Array<{
      source: string
      question: string
      answer: string
    }>
  }
}

export async function askOpenRouter(input: OpenRouterInput): Promise<string> {
  const {
    apiKey,
    model,
    adminPrompt,
    userMessage,
    history,
    lineOfficialUrl,
    lineOfficialId,
    whatsappUrl,
    context,
  } = input

  const contactContext = [
    lineOfficialUrl ? `LINE: ${lineOfficialUrl}` : null,
    lineOfficialId ? `LINE ID: ${lineOfficialId}` : null,
    whatsappUrl ? `WhatsApp: ${whatsappUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const siteContext = JSON.stringify(context)

  const systemPrompt = [
    GUARD_PROMPT,
    adminPrompt ? `\n管理員額外規則:\n${adminPrompt}` : '',
    contactContext ? `\n官方聯絡方式:\n${contactContext}` : '',
    `\n可用連結清單:\n${[
      ...(context.publishedProducts ?? []).map((p) => `https://www.chinalink.tw/products/${p.slug}`),
      ...(context.publishedServices ?? []).map((s) => `https://www.chinalink.tw/services/${s.slug}`),
      'https://www.chinalink.tw/products',
      'https://www.chinalink.tw/services',
      'https://www.chinalink.tw/contact',
    ]
      .filter(Boolean)
      .slice(0, 120)
      .join('\n')}`,
    `\n可參考的站內資料(JSON):\n${siteContext}`,
  ]
    .filter(Boolean)
    .join('\n')

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const resp = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chinalink.tw',
      'X-Title': 'ChinaLink AI Support',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
    }),
    cache: 'no-store',
  })

  if (!resp.ok) {
    throw new Error(`OpenRouter request failed (${resp.status})`)
  }

  const data = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('OpenRouter returned empty response')
  }
  return content
}
