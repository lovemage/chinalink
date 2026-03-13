import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Resend } from 'resend'
import { getSendOtpMailerConfig } from '@/lib/auth/sendOtpMailerConfig'
import { evaluateSendOtpEligibility, getTaipeiDayRange } from '@/lib/auth/otpPolicy'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email is invalid' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const now = new Date()

    const latestResult = await payload.find({
      collection: 'verification-codes',
      where: {
        email: { equals: email },
      },
      sort: '-createdAt',
      limit: 1,
    })

    const { startIso, endIso } = getTaipeiDayRange(now)
    const sentTodayResult = await payload.find({
      collection: 'verification-codes',
      where: {
        and: [
          { email: { equals: email } },
          { createdAt: { greater_than_equal: startIso } },
          { createdAt: { less_than: endIso } },
        ],
      },
      limit: 1,
    })

    const eligibility = evaluateSendOtpEligibility({
      now,
      lastSentAt: latestResult.docs[0]?.createdAt,
      sentToday: sentTodayResult.totalDocs,
    })

    if (!eligibility.allowed) {
      if (eligibility.reason === 'cooldown') {
        return NextResponse.json(
          {
            error: `請在 ${eligibility.retryAfter} 秒後再試`,
            retryAfter: eligibility.retryAfter,
          },
          { status: 429 },
        )
      }

      return NextResponse.json(
        {
          error: '今日驗證碼發送次數已達上限（3 次）',
          remainingDailyAttempts: 0,
        },
        { status: 429 },
      )
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Expire in 10 minutes
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Store in Payload
    await payload.create({
      collection: 'verification-codes',
      data: {
        email,
        code,
        expiresAt: expiresAt.toISOString(),
      },
    })

    // Send email using Resend
    const { apiKey, fromEmail } = getSendOtpMailerConfig()
    const resend = new Resend(apiKey)

    const res = await resend.emails.send({
      from: `懂陸姐 <${fromEmail}>`,
      to: email,
      subject: '您的登入驗證碼',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>登入懂陸姐</h2>
          <p>您的登入驗證碼為：<strong style="font-size: 24px; color: #E63946;">${code}</strong></p>
          <p>驗證碼將在 10 分鐘後過期。如果這不是您的操作，請忽略此郵件。</p>
        </div>
      `,
    })

    if (res.error) {
      console.error('Resend API error:', res.error)
      return NextResponse.json({ error: '發送郵件失敗', details: res.error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      retryAfter: eligibility.retryAfter,
      remainingDailyAttempts: eligibility.remainingDailyAttempts,
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send OTP', 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
}
