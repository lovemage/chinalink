import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('service-related views use MaterialSymbol instead of custom png icons', () => {
  const overview = read('components/home/ServiceOverview.tsx')
  const card = read('components/services/ServiceCard.tsx')
  const detail = read('app/(frontend)/services/[slug]/page.tsx')

  // Verify service overview uses Drizzle (not Payload) and MaterialSymbol icons
  assert.doesNotMatch(overview, /getPayload/)
  assert.match(overview, /MaterialSymbol/)
  assert.match(card, /MaterialSymbol/)
  assert.match(detail, /MaterialSymbol/)

  assert.doesNotMatch(overview, /const services = \[/)
  assert.doesNotMatch(overview, /\/icons\/(account|procurement|company|marketing)\.png/)
  assert.doesNotMatch(card, /\/icons\/consulting\.png/)
  assert.doesNotMatch(detail, /\/icons\/consulting\.png/)
})
