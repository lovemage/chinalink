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

    // Resolve service relationship
    const serviceId = typeof doc.service === 'object' ? doc.service.id : doc.service
    const service = await req.payload.findByID({
      collection: 'services',
      id: serviceId,
    })

    const variables = {
      customerName: customer.name as string,
      orderNumber: doc.orderNumber as string,
      serviceName: service.title as string,
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
