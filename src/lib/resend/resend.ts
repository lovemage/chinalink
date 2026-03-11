import { Resend } from 'resend'
import { renderTemplate } from './renderTemplate'

function getRequiredEnv(name: 'RESEND_API_KEY' | 'RESEND_FROM_EMAIL'): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

function getResendClient() {
  return new Resend(getRequiredEnv('RESEND_API_KEY'))
}

export async function sendTemplateEmail(
  templateSlug: string,
  to: string,
  variables: Record<string, string>,
) {
  const fromEmail = getRequiredEnv('RESEND_FROM_EMAIL')

  const { subject, react } = await renderTemplate(templateSlug, variables)

  return getResendClient().emails.send({
    from: fromEmail,
    to,
    subject,
    react,
  })
}
