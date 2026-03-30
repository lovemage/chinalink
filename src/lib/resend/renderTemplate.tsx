// TODO: Email block rendering system was removed as part of Payload CMS migration.
// The email templates are stored in the email_templates table in the database,
// but the React email block renderer (Layout, EmailBlockRenderer) needs to be
// rebuilt as part of the new admin system if rich email templates are required.
// For now, this module stubs out the renderTemplate function.

import { db } from '@/lib/db'
import { emailTemplates } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function replaceVariables(text: string, variables: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? `{{${key}}}`)
}

export async function renderTemplate(
  templateSlug: string,
  variables: Record<string, string>,
): Promise<{ subject: string; html: string }> {
  const result = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.slug, templateSlug))
    .limit(1)

  if (!result.length) {
    throw new Error(`Email template not found: ${templateSlug}`)
  }

  const template = result[0]
  const subject = replaceVariables(template.subject, variables)

  // TODO: Render content blocks to HTML. For now, return a simple fallback.
  const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>${subject}</h2>
    <p>此郵件由系統自動發送。</p>
  </div>`

  return { subject, html }
}
