import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('homepage avoids aggressive hover motion and overscaled interactions', () => {
  const files = [
    read('components/home/HeroSection.tsx'),
    read('components/home/ServiceOverview.tsx'),
    read('components/home/PainPoints.tsx'),
    read('components/home/TrustSection.tsx'),
    read('components/home/LatestPosts.tsx'),
    read('components/layout/Navbar.tsx'),
  ].join('\n')

  assert.doesNotMatch(files, /hover:-translate-y-2/)
  assert.doesNotMatch(files, /hover:scale-105/)
  assert.doesNotMatch(files, /group-hover:scale-110/)
})

test('service overview decorative numbering uses quieter scale', () => {
  const serviceOverview = read('components/home/ServiceOverview.tsx')

  assert.doesNotMatch(serviceOverview, /text-\[120px\]/)
})
