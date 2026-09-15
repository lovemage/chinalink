import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createHash } from 'node:crypto'
import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import {
  isProposalAccessTokenValid,
  PROPOSAL_ACCESS_COOKIE,
} from '@/lib/proposal/access'
import { proposalSections, exclusiveOption } from '@/lib/proposal/questionnaire'

type SubmissionBody = {
  respondent?: {
    name?: unknown
    role?: unknown
    contact?: unknown
  }
  selections?: Record<string, unknown>
  notes?: Record<string, unknown>
  overallNote?: unknown
  others?: Record<string, unknown>
  decisions?: Record<string, unknown>
  priorities?: Record<string, unknown>
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value === 'string' && value.length > maxLength) throw new Error('填寫內容超過字數限制，請縮短後再送出。')
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(PROPOSAL_ACCESS_COOKIE)?.value

  if (!isProposalAccessTokenValid(token)) {
    return NextResponse.json(
      { success: false, error: '登入狀態已失效，請重新輸入密碼。' },
      { status: 401 },
    )
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 500_000) {
    return NextResponse.json(
      { success: false, error: '填寫內容過長，請刪減加註後再送出。' },
      { status: 413 },
    )
  }

  try {
    const body = (await request.json()) as SubmissionBody
    const respondentName = cleanText(body.respondent?.name, 100)

    if (!respondentName) {
      return NextResponse.json(
        { success: false, error: '請填寫您的姓名。' },
        { status: 400 },
      )
    }

    const selections = body.selections || {}
    const notes = body.notes || {}

    const completedSections = proposalSections.map((section) => ({
      id: section.id,
      title: section.title,
      summary: section.summary,
      recommendations: section.recommendations,
      decision: cleanText(body.decisions?.[section.id], 100),
      priority: cleanText(body.priorities?.[section.id], 100),
      note: cleanText(notes[section.id], 8_000),
      questions: section.questions.map((question) => {
        const submittedValue = selections[question.id]
        const submitted: unknown[] = Array.isArray(submittedValue)
          ? submittedValue
          : []
        let selectedOptions = [...new Set(submitted
          .filter((value): value is string => typeof value === 'string')
          .filter((value) => question.options.includes(value)))]
        if (selectedOptions.some(exclusiveOption) && selectedOptions.length > 1) throw new Error('選項互相衝突，請取消「尚未決定」或否定選項後再送出。')
        if (question.id === 'first-priority') selectedOptions = selectedOptions.slice(0, 1)

        return {
          id: question.id,
          question: question.prompt,
          selectedOptions,
          other: cleanText(body.others?.[question.id], 2000),
        }
      }),
    }))

    const answeredQuestions = completedSections.reduce(
      (total, section) =>
        total + section.questions.filter((question) => question.selectedOptions.length > 0 || question.other).length,
      0,
    )

    if (answeredQuestions === 0) {
      return NextResponse.json(
        { success: false, error: '請至少回答一題後再送出。' },
        { status: 400 },
      )
    }

    const submittedAt = new Date().toISOString()
    const submission = {
      form: '懂陸姐網站重新定位建議書問卷',
      version: '2026-09-15',
      submittedAt,
      respondent: {
        name: respondentName,
        role: cleanText(body.respondent?.role, 100),
        contact: cleanText(body.respondent?.contact, 200),
      },
      progress: {
        answeredQuestions,
        totalQuestions: completedSections.reduce(
          (total, section) => total + section.questions.length,
          0,
        ),
      },
      sections: completedSections,
      overallNote: cleanText(body.overallNote, 12_000),
    }

    const submissionId = createHash('sha256').update(JSON.stringify({ ...submission, submittedAt: undefined })).digest('hex')
    const json = JSON.stringify({ submissionId, ...submission }, null, 2)
    if (Buffer.byteLength(json, 'utf8') > 450_000) {
      return NextResponse.json(
        { success: false, error: '填寫內容過長，請刪減加註後再送出。' },
        { status: 413 },
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !from) {
      throw new Error('Resend is not configured')
    }

    const resend = new Resend(apiKey)
    const recipient = process.env.PROPOSAL_RECIPIENT_EMAIL || 'lovemage@gmail.com'
    const safeName = escapeHtml(respondentName)
    const safeJson = escapeHtml(json)
    const [record] = await db.insert(inquiries).values({ name: respondentName, contactMethod: cleanText(body.respondent?.contact, 200) || recipient, message: json, status: 'proposal_pending' }).returning({ id: inquiries.id })
    const { error, data } = await resend.emails.send({
      from,
      to: recipient,
      subject: `懂陸姐網站建議書問卷回覆｜${respondentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #28231f; line-height: 1.7; max-width: 760px; margin: 0 auto;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">懂陸姐網站建議書問卷回覆</h1>
          <p style="margin-top: 0; color: #6e6259;">填寫人：${safeName}｜已回答 ${answeredQuestions} 題</p>
          <p>完整 JSON 已附於本信，也可在下方直接檢視。</p>
          <pre style="white-space: pre-wrap; overflow-wrap: anywhere; background: #f6f0e7; border: 1px solid #dfd4c7; padding: 20px; font-size: 12px; line-height: 1.55;">${safeJson}</pre>
        </div>
      `,
      attachments: [
        {
          filename: `chinalink-proposal-${submittedAt.slice(0, 10)}.json`,
          content: Buffer.from(json, 'utf8'),
        },
      ],
    }, { idempotencyKey: `proposal-${submissionId}` })

    if (error) {
      console.error('Failed to send proposal submission:', error)
      throw new Error('Failed to send proposal submission')
    }

    await db.update(inquiries).set({ status: 'proposal_sent', message: JSON.stringify({ submissionId, emailId: data?.id, deliveryStatus: 'accepted', submission }, null, 2) }).where(eq(inquiries.id, record.id))
    return NextResponse.json({ success: true, submittedAt, submissionId })
  } catch (error) {
    if (error instanceof Error && /字數限制|選項互相衝突/.test(error.message)) return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    console.error('Proposal submission failed:', error)
    return NextResponse.json(
      { success: false, error: '目前無法寄出問卷，您的草稿仍保留在這台裝置，請稍後再試。' },
      { status: 500 },
    )
  }
}
