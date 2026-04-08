import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createPaymentFormHtml, formatECPayDate } from '@/lib/ecpay/ecpay'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body as { orderId: number }

    if (!orderId) {
      return NextResponse.json({ error: '缺少訂單 ID' }, { status: 400 })
    }

    // Fetch the existing order
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: '訂單不存在' }, { status: 404 })
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ error: '此訂單已完成付款' }, { status: 400 })
    }

    if (order.amount <= 0) {
      return NextResponse.json({ error: '訂單金額無效' }, { status: 400 })
    }

    // Build ECPay ItemName from order items
    const items = order.items ?? []
    let itemName: string
    if (items.length > 0) {
      itemName = items
        .map((item) => {
          const name = item.itemType === 'product'
            ? [item.productName, item.variantName].filter(Boolean).join(' - ')
            : item.serviceName || '服務項目'
          return item.quantity > 1 ? `${name} x${item.quantity}` : name
        })
        .join('#')
    } else {
      // Fallback for legacy single-item orders
      itemName = '懂陸姐訂單'
    }

    // ECPay ItemName max 400 chars
    if (itemName.length > 400) {
      itemName = itemName.slice(0, 397) + '...'
    }

    const now = new Date()
    const params = {
      MerchantID: process.env.ECPAY_MERCHANT_ID!,
      MerchantTradeNo: order.orderNumber,
      MerchantTradeDate: formatECPayDate(now),
      PaymentType: 'aio',
      TotalAmount: Math.round(order.amount),
      TradeDesc: encodeURIComponent('懂陸姐線上購物'),
      ItemName: itemName,
      ReturnURL: process.env.ECPAY_RETURN_URL!,
      ClientBackURL: `${process.env.ECPAY_CLIENT_BACK_URL}?orderId=${order.id}`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
    }

    const formHtml = createPaymentFormHtml(params)

    return NextResponse.json({ orderId: order.id, formHtml })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: '系統錯誤，請稍後再試' }, { status: 500 })
  }
}
