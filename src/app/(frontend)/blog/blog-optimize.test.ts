import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')

test('blog listing and article pages use timed revalidation instead of forced dynamic rendering', () => {
  const listPage = read('app/(frontend)/blog/page.tsx')
  const articlePage = read('app/(frontend)/blog/[slug]/page.tsx')

  assert.doesNotMatch(listPage, /force-dynamic/)
  assert.doesNotMatch(articlePage, /force-dynamic/)
  assert.match(listPage, /export const revalidate = \d+/)
  assert.match(articlePage, /export const revalidate = \d+/)
})
