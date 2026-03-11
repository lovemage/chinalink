import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Layout } from '@/emails/Layout'
import { EmailBlockRenderer } from '@/emails/components/EmailBlockRenderer'
import type { EmailBlock } from '@/emails/types'

function replaceVariables(text: string, variables: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? `{{${key}}}`)
}

function replaceBlockVariables(
  blocks: EmailBlock[],
  variables: Record<string, string>,
): EmailBlock[] {
  return blocks.map((block) => {
    const replaced = { ...block }

    if (replaced.text) {
      replaced.text = replaceVariables(replaced.text, variables)
    }
    if (replaced.url) {
      replaced.url = replaceVariables(replaced.url, variables)
    }
    if (replaced.note) {
      replaced.note = replaceVariables(replaced.note, variables)
    }

    return replaced
  })
}

export async function renderTemplate(
  templateSlug: string,
  variables: Record<string, string>,
): Promise<{ subject: string; react: React.ReactElement }> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'email-templates',
    where: { slug: { equals: templateSlug } },
    limit: 1,
    depth: 1,
  })

  if (!result.docs.length) {
    throw new Error(`Email template not found: ${templateSlug}`)
  }

  const template = result.docs[0]
  const subject = replaceVariables(template.subject as string, variables)
  const rawBlocks = (template.content ?? []) as EmailBlock[]
  const blocks = replaceBlockVariables(rawBlocks, variables)

  const react = (
    <Layout preview={subject}>
      <EmailBlockRenderer blocks={blocks} variables={variables} />
    </Layout>
  )

  return { subject, react }
}
