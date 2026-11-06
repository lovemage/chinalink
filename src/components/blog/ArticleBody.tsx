import { Fragment, type ReactNode } from 'react'
import type { TiptapMark, TiptapNode } from '@/lib/posts/tiptap'

function safeHref(value: unknown): string | null {
  const href = String(value ?? '').trim()
  if (!href) return null
  if (href.startsWith('/') || href.startsWith('#')) return href
  try {
    const { protocol } = new URL(href)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol) ? href : null
  } catch {
    return null
  }
}

function applyMark(mark: TiptapMark, children: ReactNode, key: number): ReactNode {
  switch (mark.type) {
    case 'bold':
      return <strong key={key}>{children}</strong>
    case 'italic':
      return <em key={key}>{children}</em>
    case 'strike':
      return <s key={key}>{children}</s>
    case 'underline':
      return <u key={key}>{children}</u>
    case 'code':
      return <code key={key}>{children}</code>
    case 'link': {
      const href = safeHref(mark.attrs?.href)
      if (!href) return children
      const external = /^https?:\/\//.test(href) && !href.includes('chinalink.tw')
      return (
        <a key={key} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    }
    default:
      return children
  }
}

function renderChildren(node: TiptapNode): ReactNode {
  return node.content?.map((child, index) => <Fragment key={index}>{renderNode(child)}</Fragment>)
}

function renderCell(node: TiptapNode, Tag: 'td' | 'th'): ReactNode {
  const colSpan = Number(node.attrs?.colspan ?? 1)
  const rowSpan = Number(node.attrs?.rowspan ?? 1)
  return (
    <Tag colSpan={colSpan > 1 ? colSpan : undefined} rowSpan={rowSpan > 1 ? rowSpan : undefined}>
      {renderChildren(node)}
    </Tag>
  )
}

function renderNode(node: TiptapNode): ReactNode {
  switch (node.type) {
    case 'text':
      return (node.marks ?? []).reduce<ReactNode>(
        (children, mark, index) => applyMark(mark, children, index),
        node.text ?? ''
      )
    case 'paragraph':
      return <p>{renderChildren(node)}</p>
    case 'heading': {
      // The page title is the only H1.
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 2), 4)
      const Tag = `h${level}` as 'h2' | 'h3' | 'h4'
      return <Tag>{renderChildren(node)}</Tag>
    }
    case 'bulletList':
      return <ul>{renderChildren(node)}</ul>
    case 'orderedList':
      return <ol>{renderChildren(node)}</ol>
    case 'listItem':
      return <li>{renderChildren(node)}</li>
    case 'blockquote':
      return <blockquote>{renderChildren(node)}</blockquote>
    case 'codeBlock':
      return (
        <pre>
          <code>{renderChildren(node)}</code>
        </pre>
      )
    case 'hardBreak':
      return <br />
    case 'horizontalRule':
      return <hr />
    case 'image': {
      const src = safeHref(node.attrs?.src)
      if (!src) return null
      const decorative = Boolean(node.attrs?.decorative)
      const caption = String(node.attrs?.caption ?? '').trim()
      const source = String(node.attrs?.source ?? '').trim()
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={decorative ? '' : String(node.attrs?.alt ?? '')} loading="lazy" />
          {(caption || source) && (
            <figcaption>
              {caption}
              {caption && source ? ' ' : ''}
              {source && `圖片來源：${source}`}
            </figcaption>
          )}
        </figure>
      )
    }
    case 'table':
      return (
        <div className="article-table">
          <table>
            <tbody>{renderChildren(node)}</tbody>
          </table>
        </div>
      )
    case 'tableRow':
      return <tr>{renderChildren(node)}</tr>
    case 'tableHeader':
      return renderCell(node, 'th')
    case 'tableCell':
      return renderCell(node, 'td')
    default:
      return renderChildren(node) ?? null
  }
}

/** Server-rendered, so the article text is in the HTML that crawlers receive. */
export function ArticleBody({ content }: { content: TiptapNode }) {
  return <div className="article-body">{renderChildren(content)}</div>
}
