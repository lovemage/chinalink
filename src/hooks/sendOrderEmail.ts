import type { CollectionAfterChangeHook } from 'payload'
import { sendTemplateEmail } from '@/lib/resend/resend'

export const sendOrderEmail: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  try {
    // Resolve customer relationship
    const customerId = typeof doc.customer === 'object' ? doc.customer.id : doc.customer
    const customer = await req.payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    let itemName = ''
    if (doc.itemType === 'product' && doc.product) {
      const productId = typeof doc.product === 'object' ? doc.product.id : doc.product
      const product = await req.payload.findByID({
        collection: 'products',
        id: productId,
      })
      itemName = [product.title, doc.productVariantName].filter(Boolean).join(' - ')
    } else if (doc.service) {
      const serviceId = typeof doc.service === 'object' ? doc.service.id : doc.service
      const service = await req.payload.findByID({
        collection: 'services',
        id: serviceId,
      })
      itemName = service.title as string
    }

    const variables = {
      customerName: customer.name as string,
      orderNumber: doc.orderNumber as string,
      serviceName: itemName,
      amount: String(doc.amount),
      paymentStatus: doc.paymentStatus as string,
      paymentMethod: (doc.paymentMethod as string) ?? '',
    }

    if (operation === 'create') {
      await sendTemplateEmail('order-created', customer.email as string, variables)
    } else if (operation === 'update') {
      const prevStatus = previousDoc?.paymentStatus
      const currStatus = doc.paymentStatus

      if (prevStatus !== currStatus) {
        if (currStatus === 'paid') {
          await sendTemplateEmail('order-paid', customer.email as string, variables)
        } else if (currStatus === 'failed') {
          await sendTemplateEmail('order-failed', customer.email as string, variables)
        }
      }
    }
  } catch (error) {
    console.error('[sendOrderEmail] Failed to send order email:', error)
  }

  return doc
}
