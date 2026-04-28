import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import {
  appendMemberAiMessage,
  getAiContextSnapshot,
  getAiPublicConfig,
  getAiServerConfig,
  getMemberAiMessages,
  pruneMemberAiMessages,
} from '@/lib/queries/ai-chat'
import { askOpenRouter } from '@/lib/services/openrouter'
import { buildAllowedLinks, sanitizeAssistantLinks } from '@/lib/ai-chat/sanitize'

function getSessionCustomerId(session: unknown): number | null {
  const id = (session as { customerId?: number } | null)?.customerId
  if (!id || Number.isNaN(Number(id))) return null
  return Number(id)
}

export async function GET() {
  const session = await auth()
  const customerId = getSessionCustomerId(session)
  if (!session?.user || !customerId) {
    return NextResponse.json({ error: '請先登入會員' }, { status: 401 })
  }

  const config = await getAiPublicConfig()
  if (!config.enabled) {
    return NextResponse.json({ error: 'AI 客服暫時未啟用' }, { status: 503 })
  }

  const messages = await getMemberAiMessages(customerId, 20)
  return NextResponse.json({
    messages,
    config,
  })
}

export async function POST(req: Request) {
  const session = await auth()
  const customerId = getSessionCustomerId(session)
  if (!session?.user || !customerId) {
    return NextResponse.json({ error: '請先登入會員' }, { status: 401 })
  }

  const body = (await req.json()) as { message?: string }
  const message = String(body.message ?? '').trim()
  if (!message) {
    return NextResponse.json({ error: '訊息不可為空白' }, { status: 400 })
  }

  const config = await getAiServerConfig()
  if (!config.enabled || !config.apiKey || !config.model) {
    return NextResponse.json({ error: 'AI 客服尚未完成設定' }, { status: 503 })
  }

  try {
    const [history, context] = await Promise.all([
      getMemberAiMessages(customerId, 20),
      getAiContextSnapshot(),
    ])

    const reply = await askOpenRouter({
      apiKey: config.apiKey,
      model: config.model,
      adminPrompt: config.prompt,
      userMessage: message,
      history,
      lineOfficialUrl: config.lineOfficialUrl,
      lineOfficialId: config.lineOfficialId,
      whatsappUrl: config.whatsappUrl,
      context,
    })
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chinalink.tw'
    const allowedLinks = buildAllowedLinks(
      context,
      {
        lineOfficialUrl: config.lineOfficialUrl,
        whatsappUrl: config.whatsappUrl,
      },
      siteUrl,
    )
    const safeReply = sanitizeAssistantLinks(reply, allowedLinks, siteUrl)

    await appendMemberAiMessage(customerId, 'user', message)
    await appendMemberAiMessage(customerId, 'assistant', safeReply)
    await pruneMemberAiMessages(customerId, 20)

    const messages = await getMemberAiMessages(customerId, 20)

    return NextResponse.json({
      message: safeReply,
      messages,
    })
  } catch (error) {
    console.error('[ai-chat] failed:', error)
    return NextResponse.json(
      { error: 'AI 客服忙碌中，請稍後再試或改聯繫官方 LINE/WhatsApp' },
      { status: 502 },
    )
  }
}
