import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { verifyCheckMacValue } from '@/lib/ecpay/ecpay'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const body: Record<string, string> = {}
    formData.forEach((value, key) => {
      body[key] = value.toString()
    })

    // Verify CheckMacValue
    if (!verifyCheckMacValue(body)) {
      return new NextResponse('0|ErrorMessage', { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Find order by MerchantTradeNo
    const result = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: body.MerchantTradeNo } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return new NextResponse('0|OrderNotFound', { status: 404 })
    }

    const order = result.docs[0]

    // Update payment status
    const rtnCode = body.RtnCode
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paymentStatus: rtnCode === '1' ? 'paid' : 'failed',
        ecpayTradeNo: body.TradeNo || '',
        paymentMethod: mapPaymentMethod(body.PaymentType),
      },
    })

    // ECPay expects "1|OK" as success response
    return new NextResponse('1|OK')
  } catch (error) {
    console.error('ECPay notify error:', error)
    return new NextResponse('0|Error', { status: 500 })
  }
}

function mapPaymentMethod(paymentType: string): 'credit_card' | 'atm' | 'cvs' {
  if (paymentType?.includes('Credit')) return 'credit_card'
  if (paymentType?.includes('ATM')) return 'atm'
  if (paymentType?.includes('CVS')) return 'cvs'
  return 'credit_card'
}
