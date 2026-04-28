import test from 'node:test'
import assert from 'node:assert/strict'
import { shouldShowAiChat } from './visibility'

test('AI chat is hidden on checkout routes', () => {
  assert.equal(shouldShowAiChat('/checkout/123'), false)
  assert.equal(shouldShowAiChat('/checkout/success'), false)
})

test('AI chat is shown on non-checkout routes', () => {
  assert.equal(shouldShowAiChat('/'), true)
  assert.equal(shouldShowAiChat('/services'), true)
  assert.equal(shouldShowAiChat('/products/abc'), true)
})

