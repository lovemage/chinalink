import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('homepage editorial section headers use aligned spacing rhythm', () => {
  const serviceOverview = read('components/home/ServiceOverview.tsx')
  const latestPosts = read('components/home/LatestPosts.tsx')

  assert.match(serviceOverview, /mb-14[\s\S]*gap-5/)
  assert.match(latestPosts, /mb-14[\s\S]*gap-5/)
})

test('secondary copy and focus offsets use consistent token-based values', () => {
  const hero = read('components/home/HeroSection.tsx')
  const latestPosts = read('components/home/LatestPosts.tsx')

  assert.match(hero, /text-brand-muted/)
  assert.doesNotMatch(hero, /text-brand-text\/80/)
  assert.doesNotMatch(latestPosts, /focus-visible:ring-offset-white/)
})
