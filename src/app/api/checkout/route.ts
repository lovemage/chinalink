import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, services, products, orderSelectedAddons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createPaymentFormHtml, formatECPayDate } from '@/lib/ecpay/ecpay'

function parseRelationID(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return null
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
    const { itemType = 'service', serviceId, productId, productVariantSKU, customerId, selectedAddons } = body

    const normalizedItemType: 'service' | 'product' = itemType === 'product' ? 'product' : 'service'
    const customerRelationID = parseRelationID(customerId)
    if (!customerRelationID) {
      return NextResponse.json({ error: 'Customer is required' }, { status: 400 })
    }

    let amount = 0
    let itemName = ''
    let resolvedServiceId: number | null = null
    let resolvedProductId: number | null = null
    let resolvedProductVariantSKU: string | null = null
    let resolvedProductVariantName: string | null = null

    if (normalizedItemType === 'product') {
      const productRelationID = parseRelationID(productId)
      if (!productRelationID) {
        return NextResponse.json({ error: 'Product is required' }, { status: 400 })
      }

      const product = await db.query.products.findFirst({
        where: eq(products.id, productRelationID),
        with: { variants: true },
      })

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
      resolvedProductId = productRelationID
      resolvedProductVariantSKU = selectedVariant.sku
      resolvedProductVariantName = selectedVariant.name
    } else {
      const serviceRelationID = parseRelationID(serviceId)
      if (!serviceRelationID) {
        return NextResponse.json({ error: 'Service is required' }, { status: 400 })
      }

      const service = await db.query.services.findFirst({
        where: eq(services.id, serviceRelationID),
        with: { addons: true },
      })

      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 })
      }

      if (service.pricingMode === 'fixed') {
        amount = service.price || 0
      } else if (service.pricingMode === 'addons') {
        amount = service.basePrice || 0
        if (selectedAddons && service.addons) {
          for (const addon of selectedAddons) {
            const found = service.addons.find((a) => a.name === addon.name)
            if (found) amount += found.price
          }
        }
      }

      itemName = service.title
      resolvedServiceId = serviceRelationID
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber: generateOrderNumber(),
        customerId: customerRelationID,
        amount,
        paymentStatus: 'pending',
        itemType: normalizedItemType,
        serviceId: resolvedServiceId,
        productId: resolvedProductId,
        productVariantSKU: resolvedProductVariantSKU,
        productVariantName: resolvedProductVariantName,
      })
      .returning()

    // Insert selected addons if service order
    if (normalizedItemType === 'service' && selectedAddons?.length) {
      await db.insert(orderSelectedAddons).values(
        selectedAddons.map((addon: { name: string; price: number }) => ({
          orderId: order.id,
          name: addon.name,
          price: addon.price,
        })),
      )
    }

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
