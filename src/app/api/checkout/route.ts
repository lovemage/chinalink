import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { createPaymentFormHtml, formatECPayDate } from '@/lib/ecpay/ecpay'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { serviceId, customerId, selectedAddons } = body

    const payload = await getPayload({ config: configPromise })

    // Fetch service
    const service = await payload.findByID({ collection: 'services', id: serviceId })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Calculate amount
    let amount = 0
    if (service.pricingMode === 'fixed') {
      amount = service.price || 0
    } else if (service.pricingMode === 'addons') {
      amount = service.basePrice || 0
      if (selectedAddons && service.addons) {
        for (const addon of selectedAddons) {
          const found = (service.addons as { name: string; price: number }[]).find(
            (a) => a.name === addon.name,
          )
          if (found) amount += found.price
        }
      }
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Create order
    const order = await payload.create({
      collection: 'orders',
      draft: false,
      data: {
        orderNumber: '',
        customer: customerId,
        service: serviceId,
        selectedAddons: selectedAddons || [],
        amount,
        paymentStatus: 'pending',
      },
    })

    // Generate ECPay params
    const now = new Date()
    const params = {
      MerchantID: process.env.ECPAY_MERCHANT_ID!,
      MerchantTradeNo: order.orderNumber,
      MerchantTradeDate: formatECPayDate(now),
      PaymentType: 'aio',
      TotalAmount: Math.round(amount),
      TradeDesc: encodeURIComponent('懂陸姐服務'),
      ItemName: service.title,
      ReturnURL: process.env.ECPAY_RETURN_URL!,
      ClientBackURL: `${process.env.ECPAY_CLIENT_BACK_URL}?orderId=${order.id}`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
    }

    const formHtml = createPaymentFormHtml(params)

    return NextResponse.json({ orderId: order.id, formHtml })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
