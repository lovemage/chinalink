import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check if customer exists? Not strictly necessary since we allow signup via OTP
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
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@chinalink.com'

    await resend.emails.send({
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
