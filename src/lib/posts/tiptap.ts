export interface TiptapMark {
  type: string
  attrs?: Record<string, unknown>
}

export interface TiptapNode {
  type?: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: TiptapMark[]
  content?: TiptapNode[]
}

export function isTiptapDoc(content: unknown): content is TiptapNode {
  return (
    !!content &&
    typeof content === 'object' &&
    !Array.isArray(content) &&
    (content as TiptapNode).type === 'doc'
  )
}

function walk(node: TiptapNode, visit: (node: TiptapNode) => void) {
  visit(node)
  node.content?.forEach((child) => walk(child, visit))
}

export function tiptapPlainText(content: unknown): string {
  if (!isTiptapDoc(content)) return ''
  const parts: string[] = []
  walk(content, (node) => {
    if (node.type === 'text' && node.text) parts.push(node.text)
  })
  return parts.join('').trim()
}

export interface ContentAudit {
  hasText: boolean
  headingLevels: number[]
  hasH1: boolean
  /** e.g. an H3 directly after an H1 or a jump from H2 to H4 */
  skippedHeadingLevel: boolean
  imagesMissingAlt: string[]
}

export function auditContent(content: unknown): ContentAudit {
  const audit: ContentAudit = {
    hasText: false,
    headingLevels: [],
    hasH1: false,
    skippedHeadingLevel: false,
    imagesMissingAlt: [],
  }
  if (Array.isArray(content)) {
    // Legacy block format is kept readable but not re-audited.
    audit.hasText = content.length > 0
    return audit
  }
  if (!isTiptapDoc(content)) return audit

  audit.hasText = tiptapPlainText(content).length > 0
  walk(content, (node) => {
    if (node.type === 'heading') {
      audit.headingLevels.push(Number(node.attrs?.level ?? 2))
    }
    if (node.type === 'image') {
      const alt = String(node.attrs?.alt ?? '').trim()
      if (!alt && !node.attrs?.decorative) {
        audit.imagesMissingAlt.push(String(node.attrs?.src ?? ''))
      }
    }
  })
  audit.hasH1 = audit.headingLevels.includes(1)
  let previous = 1
  for (const level of audit.headingLevels) {
    if (level > previous + 1) audit.skippedHeadingLevel = true
    previous = level
  }
  return audit
}
