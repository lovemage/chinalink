import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params
    const payload = await getPayload({ config: configPromise })

    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 1,
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
