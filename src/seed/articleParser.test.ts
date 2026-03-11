import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'

import { articleSeedSources } from './articles'
import { parseArticleMarkdownFile } from './articleParser'

const sampleSourceFile = 'docs/articles/台灣人使用小紅書必知規則｜避免帳號限流與封號.md'

test('article seed sources include the representative article metadata', () => {
  const source = articleSeedSources.find((entry) => entry.sourceFile === sampleSourceFile)

  assert.ok(source)
  assert.equal(source.category.slug, 'xiaohongshu-guides')
  assert.ok(source.excerpt.length >= 60)
  assert.equal(source.faq.length, 3)
  assert.equal(source.cta.buttonLink, '/contact')
})

test('parseArticleMarkdownFile extracts title slug prompts and content sections', async () => {
  const articlePath = path.resolve(process.cwd(), sampleSourceFile)
  const parsed = await parseArticleMarkdownFile(articlePath)

  assert.equal(parsed.title, '台灣人使用小紅書必知規則｜避免帳號限流與封號（2026完整指南）')
  assert.equal(parsed.slug, '台灣人使用小紅書必知規則-避免帳號限流與封號-2026完整指南')
  assert.equal(parsed.coverPromptSize, '1792x1024')
  assert.match(parsed.coverPrompt, /warning notification about account rules on screen/)
  assert.equal(parsed.inlinePrompts.length, 3)
  assert.equal(parsed.sections[0]?.heading, '一、為什麼需要了解小紅書規則？')
  assert.match(parsed.sections[0]?.markdown ?? '', /小紅書的定位是 \*\*內容社群平台\*\*/)
  assert.equal(parsed.sections.at(-1)?.heading, '結論')
})