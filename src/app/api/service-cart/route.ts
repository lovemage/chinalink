import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

interface CartItemInput {
  type: 'service' | 'product'
  serviceId?: number
  productId?: number
  variantSKU?: string
  quantity: number
}

interface OrderItem {
  itemType: 'service' | 'product'
  serviceId?: number
  serviceName?: string
  productId?: number
  productName?: string
  variantSKU?: string
  variantName?: string
  unitPrice: number
  quantity: number
  subtotal: number
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

    const orderItems: OrderItem[] = []
    let hasServices = false
    let hasProducts = false

    for (const item of items) {
      if (item.type === 'product' && item.productId) {
        // Handle product item
        const product = await payload
          .findByID({ collection: 'products', id: item.productId })
          .catch(() => null)
        if (!product) {
          return NextResponse.json({ error: `商品 ID ${item.productId} 不存在` }, { status: 404 })
        }

        const variant = (product.variants || []).find(
          (v) => v.sku === item.variantSKU && v.isActive !== false,
        )
        if (!variant) {
          return NextResponse.json(
            { error: `商品「${product.title}」的規格 ${item.variantSKU} 不存在或已停用` },
            { status: 404 },
          )
        }

        orderItems.push({
          itemType: 'product',
          productId: item.productId,
          productName: product.title,
          variantSKU: variant.sku,
          variantName: variant.name,
          unitPrice: variant.price,
          quantity: item.quantity,
          subtotal: variant.price * item.quantity,
        })
        hasProducts = true
      } else if (item.serviceId) {
        // Handle service item
        const service = await payload
          .findByID({ collection: 'services', id: item.serviceId })
          .catch(() => null)
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
          itemType: 'service',
          serviceId: item.serviceId,
          serviceName: service.title,
          unitPrice,
          quantity: item.quantity,
          subtotal: unitPrice * item.quantity,
        })
        hasServices = true
      }
    }

    const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0)

    // Determine order itemType based on contents
    const orderItemType = hasProducts && !hasServices ? 'product' : 'service'

    // Create order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order: any = await payload.create({
      collection: 'orders',
      draft: false,
      data: {
        itemType: orderItemType,
        orderNumber: '',
        customer: customerId,
        amount: totalAmount,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        items: orderItems,
      } as any,
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
