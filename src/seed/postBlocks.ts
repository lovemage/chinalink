import type { ArticleSeedSource } from './articles'
import type { ParsedArticle } from './articleParser'

type LexicalTextNode = {
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  type: 'text'
  version: 1
}

type LexicalRootNode = {
  root: {
    children: Array<Record<string, unknown>>
    direction: 'ltr'
    format: ''
    indent: 0
    type: 'root'
    version: 1
  }
}

function createTextNode(text: string): LexicalTextNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function createParagraphNode(text: string) {
  return {
    children: [createTextNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph',
    version: 1 as const,
  }
}

function createHeadingNode(text: string, tag: 'h2' | 'h3' | 'h4' = 'h2') {
  return {
    children: [createTextNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    type: 'heading',
    version: 1 as const,
  }
}

function createListNode(items: string[], listType: 'bullet' | 'number') {
  return {
    children: items.map((item, index) => ({
      children: [createParagraphNode(item)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'listitem',
      value: index + 1,
      version: 1 as const,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    listType,
    start: 1,
    tag: listType === 'number' ? 'ol' : 'ul',
    type: 'list',
    version: 1 as const,
  }
}

function normalizeInlineMarkdown(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

export function buildRichTextDoc(markdown: string, heading?: string): LexicalRootNode {
  const nodes: Array<Record<string, unknown>> = []

  if (heading) {
    nodes.push(createHeadingNode(heading, 'h2'))
  }

  const lines = markdown.replace(/\r/g, '').split('\n')
  let index = 0

  while (index < lines.length) {
    const currentLine = lines[index]?.trim() ?? ''

    if (!currentLine || currentLine === '---') {
      index += 1
      continue
    }

    if (/^###\s+/.test(currentLine)) {
      nodes.push(createHeadingNode(normalizeInlineMarkdown(currentLine.replace(/^###\s+/, '')), 'h3'))
      index += 1
      continue
    }

    if (/^##\s+/.test(currentLine)) {
      nodes.push(createHeadingNode(normalizeInlineMarkdown(currentLine.replace(/^##\s+/, '')), 'h3'))
      index += 1
      continue
    }

    if (/^\*\s+/.test(currentLine)) {
      const items: string[] = []

      while (index < lines.length && /^\*\s+/.test(lines[index]?.trim() ?? '')) {
        items.push(normalizeInlineMarkdown((lines[index] ?? '').trim().replace(/^\*\s+/, '')))
        index += 1
      }

      nodes.push(createListNode(items, 'bullet'))
      continue
    }

    if (/^\d+\.\s+/.test(currentLine)) {
      const items: string[] = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index]?.trim() ?? '')) {
        items.push(normalizeInlineMarkdown((lines[index] ?? '').trim().replace(/^\d+\.\s+/, '')))
        index += 1
      }

      nodes.push(createListNode(items, 'number'))
      continue
    }

    const paragraphLines: string[] = []

    while (index < lines.length) {
      const line = lines[index]?.trim() ?? ''

      if (!line || line === '---' || /^#{2,3}\s+/.test(line) || /^\*\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        break
      }

      if (line.startsWith('|')) {
        paragraphLines.push(line.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim())
      } else {
        paragraphLines.push(line)
      }

      index += 1
    }

    const paragraphText = normalizeInlineMarkdown(paragraphLines.join(' '))

    if (paragraphText) {
      nodes.push(createParagraphNode(paragraphText))
    }
  }

  return {
    root: {
      children: nodes,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

export function buildPostContentBlocks(
  parsed: ParsedArticle,
  source: ArticleSeedSource,
  coverImageId: number | string,
) {
  const blocks: Array<Record<string, unknown>> = [
    {
      blockType: 'hero-section',
      heading: parsed.title,
      subheading: parsed.heroSubheading,
      backgroundImage: coverImageId,
    },
  ]

  if (parsed.introMarkdown) {
    blocks.push({
      blockType: 'rich-text',
      content: buildRichTextDoc(parsed.introMarkdown),
    })
  }

  for (const section of parsed.sections) {
    blocks.push({
      blockType: 'rich-text',
      content: buildRichTextDoc(section.markdown, section.heading),
    })
  }

  blocks.push({
    blockType: 'faq',
    items: source.faq.map((item) => ({
      question: item.question,
      answer: buildRichTextDoc(item.answer),
    })),
  })

  blocks.push({
    blockType: 'cta',
    heading: source.cta.heading,
    description: source.cta.description,
    buttonText: source.cta.buttonText,
    buttonLink: source.cta.buttonLink,
  })

  return blocks
}