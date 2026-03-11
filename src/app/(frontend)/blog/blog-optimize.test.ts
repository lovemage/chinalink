import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')

test('blog listing and article pages use forced dynamic rendering for Payload data', () => {
  const listPage = read('app/(frontend)/blog/page.tsx')
  const articlePage = read('app/(frontend)/blog/[slug]/page.tsx')

  assert.match(listPage, /export const dynamic = 'force-dynamic'/)
  assert.match(articlePage, /export const dynamic = 'force-dynamic'/)
  assert.doesNotMatch(listPage, /export const revalidate = \d+/)
  assert.doesNotMatch(articlePage, /export const revalidate = \d+/)
})
