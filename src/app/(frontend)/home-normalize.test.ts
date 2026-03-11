import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('pain points headline uses token-based emphasis instead of gradient text', () => {
  const painPoints = read('components/home/PainPoints.tsx')

  assert.doesNotMatch(painPoints, /text-transparent/)
  assert.doesNotMatch(painPoints, /bg-clip-text/)
  assert.doesNotMatch(painPoints, /bg-gradient-to-r/)
})

test('homepage cards and image frames avoid one-off hex and white gradients', () => {
  const hero = read('components/home/HeroSection.tsx')
  const serviceOverview = read('components/home/ServiceOverview.tsx')

  assert.doesNotMatch(hero, /#F9F8F4/)
  assert.doesNotMatch(serviceOverview, /from-white|to-\[#F5F5F4\]|from-\[#FFF7ED\]|to-\[#FFEDD5\]/)
})

test('homepage sections use semantic surfaces instead of hard-coded white backgrounds', () => {
  const painPoints = read('components/home/PainPoints.tsx')
  const latestPosts = read('components/home/LatestPosts.tsx')

  assert.doesNotMatch(painPoints, /<section className="bg-white/)
  assert.doesNotMatch(latestPosts, /<section className="bg-white/)
  assert.match(painPoints, /bg-background|bg-card/)
  assert.match(latestPosts, /bg-background|bg-card/)
})
