import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { createPaymentFormHtml, formatECPayDate } from '@/lib/ecpay/ecpay'
import type { Order } from '@/payload-types'

type CreateOrderData = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>

function parseRelationID(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { itemType = 'service', serviceId, productId, productVariantSKU, customerId, selectedAddons } = body

    const payload = await getPayload({ config: configPromise })
    const normalizedItemType: Order['itemType'] = itemType === 'product' ? 'product' : 'service'
    const customerRelationID = parseRelationID(customerId)
    if (!customerRelationID) {
      return NextResponse.json({ error: 'Customer is required' }, { status: 400 })
    }

    let amount = 0
    let itemName = ''
    let orderData: CreateOrderData = {
      orderNumber: '',
      customer: customerRelationID,
      amount: 0,
      paymentStatus: 'pending',
      itemType: normalizedItemType,
    }

    if (normalizedItemType === 'product') {
      const productRelationID = parseRelationID(productId)
      if (!productRelationID) {
        return NextResponse.json({ error: 'Product is required' }, { status: 400 })
      }

      const product = await payload.findByID({ collection: 'products', id: productRelationID })
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
        product: productRelationID,
        productVariantSKU: selectedVariant.sku,
        productVariantName: selectedVariant.name,
        selectedAddons: [],
      }
    } else {
      const serviceRelationID = parseRelationID(serviceId)
      if (!serviceRelationID) {
        return NextResponse.json({ error: 'Service is required' }, { status: 400 })
      }

      const service = await payload.findByID({ collection: 'services', id: serviceRelationID })
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
        service: serviceRelationID,
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
      TradeDesc: encodeURIComponent(normalizedItemType === 'product' ? '懂陸姐商品' : '懂陸姐服務'),
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
