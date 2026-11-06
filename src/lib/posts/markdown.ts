import type { TiptapMark, TiptapNode } from './tiptap'

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

function inline(text: string): TiptapNode[] {
  const nodes: TiptapNode[] = []
  let cursor = 0
  for (const match of text.matchAll(INLINE)) {
    if (match.index > cursor) nodes.push({ type: 'text', text: text.slice(cursor, match.index) })
    const marks: TiptapMark[] = match[1]
      ? [{ type: 'bold' }]
      : [{ type: 'link', attrs: { href: match[3] } }]
    nodes.push({ type: 'text', text: match[1] ?? match[2], marks })
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) nodes.push({ type: 'text', text: text.slice(cursor) })
  return nodes
}

function paragraph(text: string): TiptapNode {
  return { type: 'paragraph', content: inline(text) }
}

function tableRow(line: string, cellType: 'tableHeader' | 'tableCell'): TiptapNode {
  const cells = line.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())
  return {
    type: 'tableRow',
    content: cells.map((cell) => ({ type: cellType, content: [paragraph(cell)] })),
  }
}

/** The subset used by the article manuscripts: headings, paragraphs, lists, tables, bold, links. */
export function markdownToTiptap(markdown: string): TiptapNode {
  const content: TiptapNode[] = []
  const blocks = markdown.trim().split(/\n\s*\n/)
  for (const block of blocks) {
    const lines = block.split('\n').map((line) => line.trim())
    const heading = /^(#{2,3})\s+(.+)$/.exec(lines[0])
    if (heading) {
      content.push({ type: 'heading', attrs: { level: heading[1].length }, content: inline(heading[2]) })
    } else if (lines.every((line) => line.startsWith('- '))) {
      content.push({
        type: 'bulletList',
        content: lines.map((line) => ({ type: 'listItem', content: [paragraph(line.slice(2))] })),
      })
    } else if (lines[0].startsWith('|') && lines[1]?.startsWith('|')) {
      content.push({
        type: 'table',
        content: [tableRow(lines[0], 'tableHeader'), ...lines.slice(2).map((line) => tableRow(line, 'tableCell'))],
      })
    } else {
      content.push(paragraph(lines.join('')))
    }
  }
  return { type: 'doc', content }
}

export function parseManuscript(raw: string): { meta: Record<string, unknown>; body: string } {
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/.exec(raw)
  if (!match) throw new Error('Manuscript needs a JSON header between --- lines')
  return { meta: JSON.parse(match[1]) as Record<string, unknown>, body: match[2] }
}
