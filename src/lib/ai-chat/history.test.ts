import test from 'node:test'
import assert from 'node:assert/strict'
import { keepNewestMessages } from './history'

test('keepNewestMessages removes older rows beyond 20', () => {
  const rows = Array.from({ length: 25 }, (_, i) => ({
    id: 100 - i,
  }))

  const { keepIds, removeIds } = keepNewestMessages(rows, 20)

  assert.equal(keepIds.length, 20)
  assert.equal(removeIds.length, 5)
  assert.deepEqual(keepIds, rows.slice(0, 20).map((r) => r.id))
  assert.deepEqual(removeIds, rows.slice(20).map((r) => r.id))
})

test('keepNewestMessages keeps all rows when under limit', () => {
  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
  }))
  const { keepIds, removeIds } = keepNewestMessages(rows, 20)
  assert.equal(keepIds.length, 10)
  assert.equal(removeIds.length, 0)
})

