import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, contactMethod, message, serviceId, productId, itemType = 'service' } = body

    if (!name || !contactMethod || !message) {
      return NextResponse.json(
        { success: false, error: '請填寫所有必填欄位' },
        { status: 400 },
      )
    }

    const [inquiry] = await db
      .insert(inquiries)
      .values({
        name,
        contactMethod,
        message,
        itemType,
        serviceId: serviceId || undefined,
        productId: productId || undefined,
        status: 'new',
      })
      .returning({ id: inquiries.id })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (error) {
    console.error('Failed to create inquiry:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤，請稍後再試' },
      { status: 500 },
    )
  }
}
