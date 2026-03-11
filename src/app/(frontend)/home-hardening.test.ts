import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('global link styles preserve visible focus treatment', () => {
  const styles = read('app/(frontend)/styles.css')

  assert.match(styles, /&:focus-visible\s*\{/)
  assert.doesNotMatch(styles, /&:focus\s*\{[\s\S]*outline:\s*none;/)
})

test('homepage primary CTAs use dark foreground text on warm brand surfaces', () => {
  const hero = read('components/home/HeroSection.tsx')
  const navbar = read('components/layout/Navbar.tsx')
  const trust = read('components/home/TrustSection.tsx')

  assert.match(hero, /bg-brand-primary[\s\S]*text-brand-text/)
  assert.match(navbar, /bg-brand-primary[\s\S]*text-brand-text/)
  assert.match(trust, /bg-brand-primary[\s\S]*text-brand-text/)
})

test('homepage critical links expose explicit focus-visible styles', () => {
  const hero = read('components/home/HeroSection.tsx')
  const serviceOverview = read('components/home/ServiceOverview.tsx')
  const latestPosts = read('components/home/LatestPosts.tsx')
  const trust = read('components/home/TrustSection.tsx')

  assert.match(hero, /focus-visible:/)
  assert.match(serviceOverview, /focus-visible:/)
  assert.match(latestPosts, /focus-visible:/)
  assert.match(trust, /focus-visible:/)
})

test('decorative homepage icons use empty alt text', () => {
  const serviceOverview = read('components/home/ServiceOverview.tsx')
  const painPoints = read('components/home/PainPoints.tsx')
  const trust = read('components/home/TrustSection.tsx')

  assert.match(serviceOverview, /alt="" fill sizes="80px"/)
  assert.match(painPoints, /alt="" fill sizes="80px"/)
  assert.match(trust, /alt="" fill sizes="80px"/)
})
