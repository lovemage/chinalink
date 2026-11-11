import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rankDocs, tokenize } from './retrieval'
import { buildSystemPrompt, CORE_PROMPT } from '../services/openrouter'

const docs = [
  { id: 1, title: '培育鑽批發價一路下探，台灣店家和買家該重看哪些規格', summary: '培育鑽 GIA 價格' },
  { id: 2, title: '台灣進口的茶比自產還多，買茶時看哪裡才知道來源', summary: '溯源條碼 茶葉' },
  { id: 3, title: '東海水晶的礦早就停採了，貨從哪裡來', summary: '水晶 產業帶' },
]

test('tokenize drops filler bigrams and keeps Latin words', () => {
  const tokens = tokenize('請問 GIA 培育鑽')
  assert.ok(tokens.has('gia'))
  assert.ok(tokens.has('培育'))
  assert.ok(!tokens.has('請問'))
})

test('rankDocs puts the matching article first and skips unrelated questions', () => {
  assert.equal(rankDocs('培育鑽為什麼越來越便宜', docs)[0]?.id, 1)
  assert.equal(rankDocs('東海的水晶從哪裡進貨', docs)[0]?.id, 3)
  assert.deepEqual(rankDocs('你好', docs), [])
})

test('system prompt keeps the core rules ahead of admin notes', () => {
  const prompt = buildSystemPrompt({
    adminNotes: '代收驗證碼 380 台幣',
    userMessage: '',
    query: '台灣茶的溯源',
    context: {
      posts: [
        {
          id: 2,
          title: docs[1].title,
          url: 'https://www.chinalink.tw/blog/tai-wan-cha-su-yuan-ma',
          section: '供應鏈觀察',
          category: '零售與消費',
          date: '2026.11.06',
          excerpt: '摘要',
          sources: ['公視新聞'],
          summary: docs[1].summary,
          body: '內文',
          faq: [],
        },
      ],
      siteFaqs: [],
      services: [],
      products: [],
    },
  })
  assert.ok(prompt.startsWith(CORE_PROMPT))
  assert.ok(prompt.indexOf('企業顧問') < prompt.indexOf('代收驗證碼'))
  assert.match(prompt, /以上方規則為準/)
  assert.match(prompt, /【相關文章內容】[\s\S]*tai-wan-cha-su-yuan-ma/)
})
