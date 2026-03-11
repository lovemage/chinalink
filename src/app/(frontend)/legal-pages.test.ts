import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('footer includes privacy policy and terms links', () => {
  const footer = read('components/layout/Footer.tsx')

  assert.match(footer, /隱私權政策/)
  assert.match(footer, /服務條款/)
  assert.match(footer, /href: '\/privacy-policy'/)
  assert.match(footer, /href: '\/terms-of-service'/)
})

test('privacy policy page includes core privacy sections', () => {
  const privacyPage = read('app/(frontend)/privacy-policy/page.tsx')

  assert.match(privacyPage, /隱私權政策/)
  assert.match(privacyPage, /我們會蒐集哪些資料/)
  assert.match(privacyPage, /我們如何使用這些資料/)
  assert.match(privacyPage, /如需查詢、更正或刪除個人資料/)
})

test('terms of service page includes core service terms sections', () => {
  const termsPage = read('app/(frontend)/terms-of-service/page.tsx')

  assert.match(termsPage, /服務條款/)
  assert.match(termsPage, /服務內容與範圍/)
  assert.match(termsPage, /費用與付款/)
  assert.match(termsPage, /免責聲明/)
})
