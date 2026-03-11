import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'

import { articleSeedSources } from './articles'
import { parseArticleMarkdownFile } from './articleParser'
import { buildSeedPostData } from './posts'

const sampleSourceFile = 'docs/articles/台灣人使用小紅書必知規則｜避免帳號限流與封號.md'

test('buildSeedPostData assembles the post payload shape', async () => {
  const source = articleSeedSources.find((entry) => entry.sourceFile === sampleSourceFile)
  assert.ok(source)

  const articlePath = path.resolve(process.cwd(), sampleSourceFile)
  const parsed = await parseArticleMarkdownFile(articlePath)
  const data = buildSeedPostData(parsed, source, 101, 202)

  assert.equal(data.title, parsed.title)
  assert.equal(data.slug, parsed.slug)
  assert.equal(data.category, 101)
  assert.equal(data.coverImage, 202)
  assert.equal(data.author, '懂陸姐')
  assert.equal(data.status, 'draft')
  assert.equal(data.seo.metaTitle, source.seo.metaTitle)
  assert.equal(data.content[0]?.blockType, 'hero-section')
  assert.equal(data.content.at(-1)?.blockType, 'cta')
})