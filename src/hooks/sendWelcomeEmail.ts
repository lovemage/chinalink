import type { CollectionAfterChangeHook } from 'payload'
import { sendTemplateEmail } from '@/lib/resend/resend'

export const sendWelcomeEmail: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  if (operation !== 'create') return doc

  try {
    await sendTemplateEmail('welcome', doc.email, {
      customerName: doc.name,
    })
  } catch (error) {
    console.error('[sendWelcomeEmail] Failed to send welcome email:', error)
  }

  return doc
}
