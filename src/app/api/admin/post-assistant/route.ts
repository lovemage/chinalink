import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { aiAssistantLogs } from '@/lib/db/schema'
import { getAdminFromCookies } from '@/lib/auth-admin'
import { getSettings } from '@/lib/queries/settings'
import { getPublishedPostRefs } from '@/lib/queries/posts'
import {
  AssistantFormatError,
  buildFaqPrompt,
  buildOrganizePrompt,
  buildUserMessage,
  extractJsonObject,
  parseAssistantDraft,
  parseFaq,
} from '@/lib/posts/ai-assistant'

const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1/chat/completions'
const MAX_INPUT_CHARS = 60_000
const REQUEST_TIMEOUT_MS = 180_000

type AssistantAction = 'organize' | 'faq'

class AssistantConfigError extends Error {}

async function callModel(apiKey: string, model: string, system: string, user: string) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chinalink.tw',
      'X-Title': 'ChinaLink Post Assistant',
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`AI 服務回應錯誤（${response.status}）`)
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new AssistantFormatError('AI 沒有回傳內容')
  return content
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies()
  if (!admin) return NextResponse.json({ error: '請重新登入' }, { status: 401 })

  const startedAt = Date.now()
  let action: AssistantAction = 'organize'
  let model: string | null = null

  const log = (status: string, error?: string) =>
    db
      .insert(aiAssistantLogs)
      .values({
        username: admin.username,
        action,
        model,
        status,
        error: error ?? null,
        durationMs: Date.now() - startedAt,
      })
      .catch((logError) => console.error('[post-assistant] log failed:', logError))

  try {
    const body = (await request.json()) as {
      action?: string
      text?: string
      title?: string
      sourceUrl?: string
      notes?: string
    }
    action = body.action === 'faq' ? 'faq' : 'organize'
    const input = {
      text: String(body.text ?? '').trim(),
      title: String(body.title ?? '').trim(),
      sourceUrl: String(body.sourceUrl ?? '').trim(),
      notes: String(body.notes ?? '').trim(),
    }
    if (!input.text && !input.title) {
      return NextResponse.json({ error: '請先貼上標題、重點或原稿' }, { status: 400 })
    }
    if (input.text.length > MAX_INPUT_CHARS) {
      return NextResponse.json({ error: '內容太長，請分段整理' }, { status: 400 })
    }

    const settings = await getSettings()
    model = settings.openrouterModel
    if (!settings.openrouterApiKey) {
      throw new AssistantConfigError('尚未設定 AI 金鑰，請到「站台設定」填寫 OpenRouter API Key')
    }

    const user = buildUserMessage(input)
    if (action === 'faq') {
      const raw = await callModel(settings.openrouterApiKey, model, buildFaqPrompt(), user)
      const faq = parseFaq((extractJsonObject(raw) as { faq?: unknown }).faq)
      if (faq.length === 0) throw new AssistantFormatError('AI 沒有產生可用的問答')
      await log('success')
      return NextResponse.json({ faq })
    }

    const refs = await getPublishedPostRefs()
    const raw = await callModel(settings.openrouterApiKey, model, buildOrganizePrompt(refs), user)
    const draft = parseAssistantDraft(
      extractJsonObject(raw),
      refs.map((ref) => ref.slug)
    )
    const relatedPosts = refs
      .filter((ref) => draft.suggestions.relatedSlugs.includes(ref.slug))
      .map((ref) => ({ id: ref.id, title: ref.title }))
    await log('success')
    return NextResponse.json({ draft, relatedPosts })
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    const known = error instanceof AssistantFormatError || error instanceof AssistantConfigError
    const message = timedOut
      ? 'AI 回應逾時，請再試一次'
      : known || (error instanceof Error && error.message.startsWith('AI 服務'))
        ? (error as Error).message
        : 'AI 整理失敗，請再試一次'
    console.error('[post-assistant]', error)
    await log(error instanceof AssistantFormatError ? 'invalid_format' : 'error', (error as Error)?.message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
