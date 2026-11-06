import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'

const dir = new URL('./', import.meta.url)

test('every exported server action verifies the admin before doing anything', () => {
  const files = readdirSync(dir).filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
  assert.ok(files.length >= 9)
  for (const file of files) {
    const source = readFileSync(new URL(file, dir), 'utf8')
    const parts = source.split(/(?=export async function )/).slice(1)
    for (const part of parts) {
      const name = /export async function (\w+)/.exec(part)?.[1]
      if (file === 'posts.ts' && name === 'savePost') {
        assert.match(part, /await requireAdmin\(\)/, name)
        continue
      }
      assert.match(part.slice(0, 500), /getAdminFromCookies\(\)|await requireAdmin\(\)/, `${file}: ${name}`)
    }
  }
})

test('middleware verifies the admin token signature, not just its presence', () => {
  const middleware = readFileSync(new URL('../../middleware.ts', import.meta.url), 'utf8')
  assert.match(middleware, /jwtVerify/)
})
