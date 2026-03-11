import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const trustSection = readFileSync(new URL('../../components/home/TrustSection.tsx', import.meta.url), 'utf8')

test('trust section uses text-led contact details without icons or boxed cards', () => {
  assert.doesNotMatch(trustSection, /icons\/consulting\.png/)
  assert.doesNotMatch(trustSection, /icons\/account\.png/)
  assert.doesNotMatch(trustSection, /icons\/marketing\.png/)
  assert.doesNotMatch(trustSection, /rounded-3xl bg-white\/5 border border-white\/10/)
  assert.match(trustSection, /Line 官方客服/)
  assert.match(trustSection, /微信官方客服/)
  assert.match(trustSection, /YouTube 頻道/)
})
