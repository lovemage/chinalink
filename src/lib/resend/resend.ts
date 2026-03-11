import { Resend } from 'resend'
import { renderTemplate } from './renderTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTemplateEmail(
  templateSlug: string,
  to: string,
  variables: Record<string, string>,
) {
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL is not configured')

  const { subject, react } = await renderTemplate(templateSlug, variables)

  return resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react,
  })
}
