import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

interface CartItemInput {
  serviceId: number
  quantity: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerId, items } = body as { customerId: number; items: CartItemInput[] }

    if (!customerId || !items?.length) {
      return NextResponse.json({ error: '缺少必要資料' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Verify customer exists
    const customer = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
    if (!customer) {
      return NextResponse.json({ error: '會員不存在' }, { status: 404 })
    }

    // Resolve services and calculate totals
    const orderItems: {
      serviceId: number
      serviceName: string
      unitPrice: number
      quantity: number
      subtotal: number
    }[] = []

    for (const item of items) {
      const service = await payload.findByID({ collection: 'services', id: item.serviceId }).catch(() => null)
      if (!service) {
        return NextResponse.json({ error: `服務 ID ${item.serviceId} 不存在` }, { status: 404 })
      }

      let unitPrice = 0
      if (service.pricingMode === 'fixed') {
        unitPrice = service.price ?? 0
      } else if (service.pricingMode === 'addons') {
        unitPrice = service.basePrice ?? 0
      }

      orderItems.push({
        serviceId: item.serviceId,
        serviceName: service.title,
        unitPrice,
        quantity: item.quantity,
        subtotal: unitPrice * item.quantity,
      })
    }

    const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0)

    // Create order
    const order = await payload.create({
      collection: 'orders',
      draft: false,
      data: {
        itemType: 'service',
        orderNumber: '',
        customer: customerId,
        amount: totalAmount,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        items: orderItems,
      },
    })

    // Fetch LINE URL from site settings
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount,
      lineUrl: siteSettings?.lineOfficialUrl || '',
      lineId: siteSettings?.lineOfficialId || '',
    })
  } catch (error) {
    console.error('[service-cart] Order creation failed:', error)
    return NextResponse.json({ error: '訂單建立失敗，請稍後再試' }, { status: 500 })
  }
}
