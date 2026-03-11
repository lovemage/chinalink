import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')

test('blog post cards use semantic surfaces and explicit focus styles', () => {
  const postCard = read('components/blog/PostCard.tsx')

  assert.doesNotMatch(postCard, /bg-white/)
  assert.match(postCard, /bg-card/)
  assert.match(postCard, /focus-visible:/)
})

test('category filter buttons use tokenized surfaces instead of plain white pills', () => {
  const filter = read('components/blog/CategoryFilter.tsx')

  assert.doesNotMatch(filter, /bg-white/)
  assert.match(filter, /bg-card|bg-background/)
  assert.match(filter, /focus-visible:/)
})

test('blog listing hero avoids mix-blend decorative layer', () => {
  const page = read('app/(frontend)/blog/page.tsx')

  assert.doesNotMatch(page, /mix-blend-multiply/)
})
