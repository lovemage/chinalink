import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('mobile navigation controls meet touch target sizing', () => {
  const mobileNav = read('components/layout/MobileNav.tsx')

  assert.match(mobileNav, /size="icon-lg"/)
  assert.match(mobileNav, /className="rounded-lg px-3 py-3/)
  assert.match(mobileNav, /className="mt-2 inline-flex h-11/)
  assert.match(mobileNav, /className="mt-4 inline-flex h-11/)
})

test('hero mobile actions expand to full width before stacking back on larger screens', () => {
  const hero = read('components/home/HeroSection.tsx')

  assert.match(hero, /group relative inline-flex h-14 w-full[\s\S]*sm:w-auto/)
  assert.match(hero, /inline-flex h-14 w-full[\s\S]*sm:w-auto/)
})

test('hero floating badge adapts to mobile flow instead of overflowing the image', () => {
  const hero = read('components/home/HeroSection.tsx')

  assert.match(hero, /mt-6[\s\S]*sm:mt-0[\s\S]*sm:absolute/)
})
