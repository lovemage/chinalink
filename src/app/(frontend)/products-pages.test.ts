import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('frontend has products list and detail pages backed by products collection', () => {
  const listPage = read('app/(frontend)/products/page.tsx')
  const detailPage = read('app/(frontend)/products/[slug]/page.tsx')

  assert.match(listPage, /collection:\s*'products'/)
  assert.match(detailPage, /collection:\s*'products'/)
  assert.match(detailPage, /params:\s*Promise<\{\s*slug:\s*string\s*\}>/)
})

test('navigation exposes products entry in navbar and footer', () => {
  const navbar = read('components/layout/Navbar.tsx')
  const footer = read('components/layout/Footer.tsx')

  assert.match(navbar, /href:\s*'\/products'/)
  assert.match(footer, /href:\s*'\/products'/)
})
