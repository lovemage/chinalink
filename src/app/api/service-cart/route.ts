import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { customers, services, products, orders, orderItems, siteSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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

function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `CL${date}${rand}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerId, items } = body as { customerId: number; items: CartItemInput[] }

    if (!customerId || !items?.length) {
      return NextResponse.json({ error: '缺少必要資料' }, { status: 400 })
    }

    // Verify customer exists
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1)

    if (!customer.length) {
      return NextResponse.json({ error: '會員不存在' }, { status: 404 })
    }

    const orderItemsData: OrderItem[] = []
    let hasServices = false
    let hasProducts = false

    for (const item of items) {
      if (item.type === 'product' && item.productId) {
        // Handle product item
        const productResult = await db.query.products.findFirst({
          where: eq(products.id, item.productId),
          with: { variants: true },
        })

        if (!productResult) {
          return NextResponse.json({ error: `商品 ID ${item.productId} 不存在` }, { status: 404 })
        }

        const variant = (productResult.variants || []).find(
          (v) => v.sku === item.variantSKU && v.isActive !== false,
        )
        if (!variant) {
          return NextResponse.json(
            { error: `商品「${productResult.title}」的規格 ${item.variantSKU} 不存在或已停用` },
            { status: 404 },
          )
        }

        orderItemsData.push({
          itemType: 'product',
          productId: item.productId,
          productName: productResult.title,
          variantSKU: variant.sku,
          variantName: variant.name,
          unitPrice: variant.price,
          quantity: item.quantity,
          subtotal: variant.price * item.quantity,
        })
        hasProducts = true
      } else if (item.serviceId) {
        // Handle service item
        const service = await db
          .select()
          .from(services)
          .where(eq(services.id, item.serviceId))
          .limit(1)

        if (!service.length) {
          return NextResponse.json({ error: `服務 ID ${item.serviceId} 不存在` }, { status: 404 })
        }

        const svc = service[0]
        let unitPrice = 0
        if (svc.pricingMode === 'fixed') {
          unitPrice = svc.price ?? 0
        } else if (svc.pricingMode === 'addons') {
          unitPrice = svc.basePrice ?? 0
        }

        orderItemsData.push({
          itemType: 'service',
          serviceId: item.serviceId,
          serviceName: svc.title,
          unitPrice,
          quantity: item.quantity,
          subtotal: unitPrice * item.quantity,
        })
        hasServices = true
      }
    }

    const totalAmount = orderItemsData.reduce((sum, i) => sum + i.subtotal, 0)

    // Determine order itemType based on contents
    const orderItemType = hasProducts && !hasServices ? 'product' : 'service'

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        itemType: orderItemType,
        orderNumber: generateOrderNumber(),
        customerId,
        amount: totalAmount,
        orderStatus: 'pending',
        paymentStatus: 'pending',
      })
      .returning()

    // Insert order items
    if (orderItemsData.length > 0) {
      await db.insert(orderItems).values(
        orderItemsData.map((oi) => ({
          orderId: order.id,
          itemType: oi.itemType,
          serviceId: oi.serviceId,
          serviceName: oi.serviceName,
          productId: oi.productId,
          productName: oi.productName,
          variantSKU: oi.variantSKU,
          variantName: oi.variantName,
          unitPrice: oi.unitPrice,
          quantity: oi.quantity,
          subtotal: oi.subtotal,
        })),
      )
    }

    // Fetch LINE URL from site settings
    const lineUrlRow = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'lineOfficialUrl'))
      .limit(1)

    const lineIdRow = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'lineOfficialId'))
      .limit(1)

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount,
      lineUrl: lineUrlRow[0]?.value || '',
      lineId: lineIdRow[0]?.value || '',
    })
  } catch (error) {
    console.error('[service-cart] Order creation failed:', error)
    return NextResponse.json({ error: '訂單建立失敗，請稍後再試' }, { status: 500 })
  }
}
