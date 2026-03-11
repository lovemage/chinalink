import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('homepage uses timed revalidation instead of forced dynamic rendering', () => {
  const page = read('app/(frontend)/page.tsx')

  assert.doesNotMatch(page, /force-dynamic/)
  assert.match(page, /export const revalidate = \d+/)
})
