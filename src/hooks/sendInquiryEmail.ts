import type { CollectionAfterChangeHook } from 'payload'
import { sendTemplateEmail } from '@/lib/resend/resend'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@chinalink.com.tw'

export const sendInquiryEmail: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  try {
    let serviceName = ''
    if (doc.service) {
      const serviceId = typeof doc.service === 'object' ? doc.service.id : doc.service
      const service = await req.payload.findByID({
        collection: 'services',
        id: serviceId,
      })
      serviceName = service.title as string
    }

    await sendTemplateEmail('inquiry-received', ADMIN_EMAIL, {
      customerName: doc.name as string,
      contactMethod: doc.contactMethod as string,
      serviceName,
      message: doc.message as string,
    })
  } catch (error) {
    console.error('[sendInquiryEmail] Failed to send inquiry email:', error)
  }

  return doc
}
