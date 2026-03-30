// Stub for @payloadcms/richtext-lexical/react RichText component.
// TODO: Implement a proper Lexical JSON to HTML renderer, or install
// a lightweight Lexical renderer package if rich text rendering is needed.

import type { LexicalNode } from '@/lib/types'

interface RichTextProps {
  data?: LexicalNode | null
  className?: string
}

function renderNode(node: LexicalNode): string {
  if (!node) return ''

  if (node.type === 'text') {
    return node.text ? escapeHtml(String(node.text)) : ''
  }

  const children = (node.children || []).map(renderNode).join('')
  const rootChildren = node.root?.children ? node.root.children.map(renderNode).join('') : ''
  const content = children || rootChildren

  switch (node.type) {
    case 'root':
      return content
    case 'paragraph':
      return content ? `<p>${content}</p>` : ''
    case 'heading': {
      const level = (node as { tag?: string }).tag || 'h2'
      return `<${level}>${content}</${level}>`
    }
    case 'list': {
      const listType = (node as { listType?: string }).listType
      const tag = listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${content}</${tag}>`
    }
    case 'listitem':
      return `<li>${content}</li>`
    case 'quote':
      return `<blockquote>${content}</blockquote>`
    case 'link': {
      const url = (node as { url?: string }).url || '#'
      return `<a href="${escapeHtml(url)}">${content}</a>`
    }
    default:
      return content
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function RichText({ data, className }: RichTextProps) {
  if (!data) return null

  const html = renderNode(data)

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
