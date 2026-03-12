import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { createPaymentFormHtml, formatECPayDate } from '@/lib/ecpay/ecpay'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { itemType = 'service', serviceId, productId, productVariantSKU, customerId, selectedAddons } = body

    const payload = await getPayload({ config: configPromise })

    let amount = 0
    let itemName = ''
    let orderData: Record<string, unknown> = {
      orderNumber: '',
      customer: customerId,
      amount: 0,
      paymentStatus: 'pending',
      itemType,
    }

    if (itemType === 'product') {
      const product = await payload.findByID({ collection: 'products', id: productId })
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const variants = product.variants ?? []
      const selectedVariant =
        variants.find((variant) => variant.sku === productVariantSKU && variant.isActive !== false) ||
        variants.find((variant) => variant.isDefault) ||
        variants.find((variant) => variant.isActive !== false)

      if (!selectedVariant) {
        return NextResponse.json({ error: 'Product variant not found' }, { status: 404 })
      }

      amount = selectedVariant.price || 0
      itemName = [product.title, selectedVariant.name].filter(Boolean).join(' - ')
      orderData = {
        ...orderData,
        amount,
        product: productId,
        productVariantSKU: selectedVariant.sku,
        productVariantName: selectedVariant.name,
        selectedAddons: [],
      }
    } else {
      const service = await payload.findByID({ collection: 'services', id: serviceId })
      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 })
      }

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

      itemName = service.title
      orderData = {
        ...orderData,
        amount,
        service: serviceId,
        selectedAddons: selectedAddons || [],
      }
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const order = await payload.create({
      collection: 'orders',
      draft: false,
      data: orderData,
    })

    // Generate ECPay params
    const now = new Date()
    const params = {
      MerchantID: process.env.ECPAY_MERCHANT_ID!,
      MerchantTradeNo: order.orderNumber,
      MerchantTradeDate: formatECPayDate(now),
      PaymentType: 'aio',
      TotalAmount: Math.round(amount),
      TradeDesc: encodeURIComponent(itemType === 'product' ? '懂陸姐商品' : '懂陸姐服務'),
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
