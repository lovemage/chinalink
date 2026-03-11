import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, contactMethod, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: '請填寫所有必填欄位' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        name,
        contactMethod: contactMethod || email,
        message,
        status: 'new',
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (error) {
    console.error('Failed to create contact inquiry:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤，請稍後再試' },
      { status: 500 },
    )
  }
}
