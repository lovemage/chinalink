import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')

test('blog article page supports both block arrays and tiptap JSON content', () => {
  const articlePage = read('app/(frontend)/blog/[slug]/page.tsx')

  assert.match(articlePage, /Array\.isArray\(post\.content\)/)
  assert.match(articlePage, /contentType === 'tiptap'/)
  assert.match(articlePage, /<TiptapRenderer content=\{post\.content\} \/>/)
})

test('block renderer safely ignores non-array content payloads', () => {
  const blockRenderer = read('components/blocks/BlockRenderer.tsx')

  assert.match(blockRenderer, /Array\.isArray\(blocks\)/)
})
