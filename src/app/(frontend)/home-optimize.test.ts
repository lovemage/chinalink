import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('homepage uses forced dynamic rendering for Payload-backed sections', () => {
  const page = read('app/(frontend)/page.tsx')

  assert.match(page, /export const dynamic = 'force-dynamic'/)
  assert.doesNotMatch(page, /export const revalidate = \d+/)
})
