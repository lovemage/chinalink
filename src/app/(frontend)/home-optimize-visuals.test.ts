import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('hero decorative layers avoid mix-blend and interactive blur blobs', () => {
  const hero = read('components/home/HeroSection.tsx')

  assert.doesNotMatch(hero, /mix-blend-multiply/)
  assert.doesNotMatch(hero, /hover:scale-105/)
})

test('homepage supporting surfaces avoid backdrop blur for non-critical decoration', () => {
  const trust = read('components/home/TrustSection.tsx')
  const latestPosts = read('components/home/LatestPosts.tsx')

  assert.doesNotMatch(trust, /backdrop-blur-md/)
  assert.doesNotMatch(latestPosts, /backdrop-blur-md/)
})
