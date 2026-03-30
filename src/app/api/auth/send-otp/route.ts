import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verificationCodes } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
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

    const now = new Date()

    const latestResult = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.email, email))
      .orderBy(desc(verificationCodes.createdAt))
      .limit(1)

    const { startIso, endIso } = getTaipeiDayRange(now)

    const sentTodayResult = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          gte(verificationCodes.createdAt, new Date(startIso)),
          lte(verificationCodes.createdAt, new Date(endIso)),
        ),
      )
      .limit(1)

    const eligibility = evaluateSendOtpEligibility({
      now,
      lastSentAt: latestResult[0]?.createdAt?.toISOString(),
      sentToday: sentTodayResult.length,
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

    // Store in DB
    await db.insert(verificationCodes).values({
      email,
      code,
      expiresAt,
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
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
