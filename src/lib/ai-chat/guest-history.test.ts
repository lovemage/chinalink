import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeGuestHistory } from './guest-history'

test('normalizeGuestHistory keeps recent user and assistant messages only', () => {
  const rows = [
    { id: 1, role: 'system', content: 'hidden', createdAt: null },
    { id: 2, role: 'user', content: '  hi  ', createdAt: null },
    { id: 3, role: 'assistant', content: 'hello', createdAt: null },
    { id: 4, role: 'assistant', content: '', createdAt: null },
  ]

  assert.deepEqual(normalizeGuestHistory(rows, 2), [
    { id: 2, role: 'user', content: 'hi', createdAt: null },
    { id: 3, role: 'assistant', content: 'hello', createdAt: null },
  ])
})
