import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params
    const id = parseInt(orderId, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        customer: true,
        items: true,
        selectedAddons: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Fetch order error:', error)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
}
