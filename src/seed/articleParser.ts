import { readFile } from 'node:fs/promises'

export type ParsedPrompt = {
  name: string
  prompt: string
}

export type ParsedSection = {
  heading: string
  markdown: string
}

export type ParsedArticle = {
  title: string
  slug: string
  introMarkdown: string
  heroSubheading: string
  coverPrompt: string
  coverPromptSize: string
  inlinePrompts: ParsedPrompt[]
  sections: ParsedSection[]
}

type HeadingMatch = {
  level: number
  text: string
  index: number
}

const headingPattern = /^#{1,6}\s+(.+)$/gm
const coverPromptPattern = /首圖\s*AI(?:\s*生成)?\s*Prompt/i
const inlinePromptPattern = /文中圖\s*Prompt(?:\s*\d+)?/i

function normalizeWhitespace(value: string): string {
  return value.replace(/\r/g, '').replace(/\u00a0/g, ' ').trim()
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getHeadingMatches(markdown: string): HeadingMatch[] {
  const matches: HeadingMatch[] = []

  for (const match of markdown.matchAll(headingPattern)) {
    const raw = match[0] ?? ''
    const text = normalizeWhitespace(match[1] ?? '')
    const level = raw.match(/^#+/)?.[0].length ?? 1

    matches.push({
      level,
      text,
      index: match.index ?? 0,
    })
  }

  return matches
}

function extractCodeBlock(segment: string): string {
  const match = segment.match(/```[^\n]*\n([\s\S]*?)```/i)
  return normalizeWhitespace(match?.[1] ?? '')
}

function extractPromptLabel(headingText: string, fallbackPrefix: string, index: number): string {
  const labelMatch = headingText.match(/（(.+?)）/)
  const label = normalizeWhitespace(labelMatch?.[1] ?? '')

  if (label) {
    return slugifyTitle(label)
  }

  return `${fallbackPrefix}-${index + 1}`
}

function removePromptBlocks(segment: string): string {
  return segment
    .replace(/^#{1,6}\s*首圖\s*AI(?:\s*生成)?\s*Prompt.*?(?=^#{1,6}\s|\Z)/gms, '')
    .replace(/^#{1,6}\s*文中圖\s*Prompt(?:\s*\d+)? .*?(?=^#{1,6}\s|\Z)/gms, '')
    .replace(/^#{1,6}\s*文中圖\s*Prompt(?:\s*\d+)?.*?(?=^#{1,6}\s|\Z)/gms, '')
    .replace(/^---\s*$/gm, '')
    .trim()
}

function extractHeroSubheading(introMarkdown: string): string {
  const paragraphs = introMarkdown
    .split(/\n{2,}/)
    .map((paragraph) => normalizeWhitespace(paragraph.replace(/\*\*/g, '').replace(/^[-*]\s+/gm, '')))
    .filter(Boolean)

  return paragraphs.slice(0, 2).join(' ').slice(0, 140)
}

function extractCoverPromptSize(segment: string): string {
  const match = segment.match(/建議尺寸[:：]?\s*\**\s*(\d+)\s*[×xX]\s*(\d+)/)

  if (!match) {
    return '1792x1024'
  }

  return `${match[1]}x${match[2]}`
}

export async function parseArticleMarkdownFile(filePath: string): Promise<ParsedArticle> {
  const markdown = normalizeWhitespace(await readFile(filePath, 'utf8'))
  const headings = getHeadingMatches(markdown)
  const titleHeading = headings.find((heading) => !coverPromptPattern.test(heading.text) && !inlinePromptPattern.test(heading.text))

  if (!titleHeading) {
    throw new Error(`Unable to find article title heading in ${filePath}`)
  }

  const articleMarkdown = markdown.slice(titleHeading.index)
  const articleHeadings = getHeadingMatches(articleMarkdown)
  const title = articleHeadings[0]?.text

  if (!title) {
    throw new Error(`Unable to parse article title in ${filePath}`)
  }

  const bodyHeadings = articleHeadings.filter((heading) => heading.index > 0)
  const coverHeading = bodyHeadings.find((heading) => coverPromptPattern.test(heading.text))

  if (!coverHeading) {
    throw new Error(`Unable to find cover prompt heading in ${filePath}`)
  }

  const coverHeadingIndex = bodyHeadings.indexOf(coverHeading)
  const coverSegmentEnd = bodyHeadings[coverHeadingIndex + 1]?.index ?? articleMarkdown.length
  const coverSegment = articleMarkdown.slice(coverHeading.index, coverSegmentEnd)
  const coverPrompt = extractCodeBlock(coverSegment)
  const coverPromptSize = extractCoverPromptSize(coverSegment)

  const inlinePrompts = bodyHeadings
    .filter((heading) => inlinePromptPattern.test(heading.text))
    .map((heading, index, promptHeadings) => {
      const currentIndex = articleMarkdown.indexOf(`#`.repeat(heading.level) + ` ${heading.text}`, heading.index)
      const nextHeadingIndex = promptHeadings[index + 1]?.index
      const nextTopLevelIndex = bodyHeadings.find((candidate) => candidate.index > heading.index && candidate.level <= heading.level)?.index
      const endIndex = nextTopLevelIndex ?? nextHeadingIndex ?? articleMarkdown.length
      const segment = articleMarkdown.slice(currentIndex, endIndex)

      return {
        name: extractPromptLabel(heading.text, 'inline-prompt', index),
        prompt: extractCodeBlock(segment),
      }
    })
    .filter((entry) => entry.prompt)

  const mainSections = bodyHeadings.filter(
    (heading) =>
      heading.level === 1 &&
      heading.text !== title &&
      !coverPromptPattern.test(heading.text) &&
      !inlinePromptPattern.test(heading.text),
  )

  const introStart = articleHeadings[0]?.index ?? 0
  const introEnd = mainSections[0]?.index ?? articleMarkdown.length
  const introMarkdown = removePromptBlocks(
    articleMarkdown
      .slice(introStart + `# ${title}`.length, introEnd)
      .trim(),
  )

  const sections = mainSections
    .map((heading, index) => {
      const nextSectionStart = mainSections[index + 1]?.index ?? articleMarkdown.length
      const sectionMarkdown = removePromptBlocks(
        articleMarkdown
          .slice(heading.index + `# ${heading.text}`.length, nextSectionStart)
          .trim(),
      )

      return {
        heading: heading.text,
        markdown: sectionMarkdown,
      }
    })
    .filter((section) => section.markdown)

  return {
    title,
    slug: slugifyTitle(title),
    introMarkdown,
    heroSubheading: extractHeroSubheading(introMarkdown),
    coverPrompt,
    coverPromptSize,
    inlinePrompts,
    sections,
  }
}