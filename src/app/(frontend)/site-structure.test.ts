import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('main navigation is the four columns, supply-chain recommendation stays outside it', () => {
  const navbar = read('components/layout/Navbar.tsx')
  const primary = navbar.slice(navbar.indexOf('primaryNav = ['), navbar.indexOf('secondaryNav = ['))
  for (const label of ['陸姐觀點', '供應鏈觀察', '問題與交流', '顧問服務']) assert.match(primary, new RegExp(label))
  assert.doesNotMatch(primary, /供應鏈推薦/)
  assert.match(navbar, /secondaryNav[\s\S]*供應鏈推薦/)
})

test('products and cart keep their entrances', () => {
  const navbar = read('components/layout/Navbar.tsx')
  const footer = read('components/layout/Footer.tsx')
  for (const source of [navbar, footer]) {
    assert.match(source, /\/products/)
    assert.match(source, /\/service-cart/)
  }
})

test('home sections follow the proposal order', () => {
  const home = read('app/(frontend)/page.tsx')
  const order = ['<h1', '陸姐觀點', '供應鏈觀察', '問題與交流', '顧問服務'].map((marker) =>
    home.indexOf(marker, home.indexOf('export default'))
  )
  assert.ok(order.every((position) => position >= 0))
  assert.deepEqual(order, [...order].sort((a, b) => a - b))
})

test('supply-chain recommendation is not an article category', () => {
  const sql = read('scripts/migrations/2026-11-redesign.sql')
  const seed = sql.slice(sql.indexOf('INSERT INTO categories'), sql.indexOf('ON CONFLICT'))
  assert.doesNotMatch(seed, /供應鏈推薦/)
  assert.equal((seed.match(/\('/g) ?? []).length, 4)
})

test('drafts are visible only to a verified admin, never by Host header', () => {
  const article = read('app/(frontend)/blog/[slug]/page.tsx')
  assert.match(article, /getAdminFromCookies/)
  assert.doesNotMatch(article, /headers\(\)/)
})

test('sitemap only lists public, indexable posts', () => {
  const sitemap = read('app/sitemap.ts')
  assert.match(sitemap, /eq\(posts\.status, 'published'\), eq\(posts\.noindex, false\)/)
})
