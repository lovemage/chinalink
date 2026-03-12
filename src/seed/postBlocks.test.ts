import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'

import { articleSeedSources } from './articles'
import { parseArticleMarkdownFile } from './articleParser'
import { buildPostContentBlocks } from './postBlocks'

const sampleSourceFile = 'docs/articles/台灣人使用小紅書必知規則｜避免帳號限流與封號.md'

test('buildPostContentBlocks creates hero rich-text faq and cta blocks', async () => {
  const source = articleSeedSources.find((entry) => entry.sourceFile === sampleSourceFile)
  assert.ok(source)

  const articlePath = path.resolve(process.cwd(), sampleSourceFile)
  const parsed = await parseArticleMarkdownFile(articlePath)
  const blocks = buildPostContentBlocks(parsed, source, 1)

  assert.equal(blocks[0]?.blockType, 'hero-section')
  assert.equal(blocks[0]?.heading, parsed.title)
  assert.equal(blocks[1]?.blockType, 'rich-text')
  assert.equal(blocks.at(-2)?.blockType, 'faq')
  assert.equal(blocks.at(-1)?.blockType, 'cta')

  const richTextBlocks = blocks.filter((block) => block.blockType === 'rich-text')
  assert.ok(richTextBlocks.length >= 2)

  const faqBlock = blocks.find((block) => block.blockType === 'faq')
  assert.ok(Array.isArray(faqBlock?.items))
  assert.equal(faqBlock.items.length, 3)

  const ctaBlock = blocks.find((block) => block.blockType === 'cta')
  assert.equal(ctaBlock?.buttonLink, '/contact')
})
