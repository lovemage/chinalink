import test from 'node:test'
import assert from 'node:assert/strict'
import { isValidSlug, resolveUniqueSlug, rewriteBlogLinks, titleToSlug } from './slug'
import { fromTaipeiInputValue, toTaipeiInputValue, formatDateline } from './time'
import { checkPost, type PostCheckInput } from './checks'
import { auditContent } from './tiptap'
import { extractJsonObject, parseAssistantDraft, AssistantFormatError } from './ai-assistant'
import { buildArticleJsonLd, serializeJsonLd } from './structured-data'

const doc = (...content: object[]) => ({ type: 'doc', content })
const para = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] })

const complete: PostCheckInput = {
  title: '標題',
  slug: 'biao-ti',
  excerpt: '摘要',
  content: doc(para('內文')),
  section: 'opinion',
  categoryId: 1,
  coverImageUrl: 'https://example.com/a.png',
  coverImageAlt: '封面',
  author: '懂陸姐',
  seoTitle: 'SEO',
  seoDescription: '描述',
  focusKeyword: '關鍵字',
  tagCount: 1,
  ogTitle: 'OG',
  ogDescription: 'OG 描述',
  sources: [],
  faq: [],
  relatedPostIds: [1],
}

test('title converts to toneless pinyin slug, per the proposal example', () => {
  assert.equal(titleToSlug('台灣市場觀察'), 'tai-wan-shi-chang-guan-cha')
})

test('slug keeps latin and digits, strips punctuation and collapses separators', () => {
  assert.equal(titleToSlug('懂陸姐 ChinaLink：2026，小紅書！'), 'dong-lu-jie-chinalink-2026-xiao-hong-shu')
  assert.equal(titleToSlug('  ---  '), '')
})

test('slug validity rejects Chinese, capitals and stray hyphens', () => {
  assert.equal(isValidSlug('tai-wan-2026'), true)
  for (const bad of ['台灣', 'Tai-wan', '-a', 'a-', 'a--b', 'a b', '']) {
    assert.equal(isValidSlug(bad), false, bad)
  }
})

test('duplicate slugs get -2, -3', async () => {
  const taken = new Set(['a', 'a-2'])
  assert.equal(await resolveUniqueSlug('a', async (s) => taken.has(s)), 'a-3')
  assert.equal(await resolveUniqueSlug('b', async (s) => taken.has(s)), 'b')
})

test('link rewrite does not touch longer slugs and handles encoded legacy slugs', () => {
  const body = JSON.stringify({ href: '/blog/old', b: '/blog/old-two', c: 'https://www.chinalink.tw/blog/old?x=1' })
  const out = rewriteBlogLinks(body, 'old', 'new')
  assert.match(out, /"\/blog\/new"/)
  assert.match(out, /\/blog\/old-two/)
  assert.match(out, /tw\/blog\/new\?x=1/)
  const encoded = JSON.stringify({ href: `/blog/${encodeURIComponent('台灣')}` })
  assert.match(rewriteBlogLinks(encoded, '台灣', 'tai-wan'), /\/blog\/tai-wan/)
})

test('schedule input is read as Taiwan time regardless of server timezone', () => {
  const date = fromTaipeiInputValue('2026-11-06T09:30')
  assert.equal(date?.toISOString(), '2026-11-06T01:30:00.000Z')
  assert.equal(toTaipeiInputValue(date), '2026-11-06T09:30')
  assert.equal(fromTaipeiInputValue('nonsense'), null)
  assert.equal(formatDateline(new Date('2026-11-05T16:30:00Z')), '2026.11.06')
})

test('complete post has no blocking issues', () => {
  const result = checkPost(complete)
  assert.deepEqual(result.required, [])
  assert.equal(result.completion, 100)
})

test('each required field blocks publishing', () => {
  const cases: [Partial<PostCheckInput>, string][] = [
    [{ title: ' ' }, 'title'],
    [{ slug: '' }, 'slug'],
    [{ excerpt: '' }, 'excerpt'],
    [{ content: doc() }, 'content'],
    [{ section: 'x' }, 'section'],
    [{ categoryId: null }, 'category'],
    [{ coverImageUrl: '' }, 'cover'],
    [{ coverImageAlt: '' }, 'cover'],
    [{ author: '' }, 'author'],
  ]
  for (const [patch, field] of cases) {
    const { required } = checkPost({ ...complete, ...patch })
    assert.ok(required.some((issue) => issue.field === field), field)
  }
})

test('sources are advisory only, and only for observation posts', () => {
  const observation = checkPost({ ...complete, section: 'observation' })
  assert.deepEqual(observation.required, [])
  assert.ok(observation.recommended.some((issue) => issue.field === 'sources'))
  assert.ok(!checkPost(complete).recommended.some((issue) => issue.field === 'sources'))
})

test('content audit flags missing alt unless decorative, H1 and skipped levels', () => {
  const image = (attrs: object) => ({ type: 'image', attrs })
  const heading = (level: number) => ({ type: 'heading', attrs: { level }, content: [{ type: 'text', text: 'h' }] })
  const audit = auditContent(
    doc(heading(1), heading(4), image({ src: 'a' }), image({ src: 'b', decorative: true }), image({ src: 'c', alt: 'ok' }))
  )
  assert.equal(audit.hasH1, true)
  assert.equal(audit.skippedHeadingLevel, true)
  assert.deepEqual(audit.imagesMissingAlt, ['a'])
  assert.equal(auditContent(doc(heading(2), heading(3), heading(2))).skippedHeadingLevel, false)
})

test('legacy block arrays count as content', () => {
  assert.equal(auditContent([{ blockType: 'richText' }]).hasText, true)
})

test('assistant JSON survives fences and rejects junk', () => {
  assert.deepEqual(extractJsonObject('```json\n{"a":1}\n```'), { a: 1 })
  assert.throws(() => extractJsonObject('沒有'), AssistantFormatError)
  assert.throws(() => extractJsonObject('{bad}'), AssistantFormatError)
})

test('assistant draft requires title and body', () => {
  assert.throws(() => parseAssistantDraft({ title: '只有標題' }, []), AssistantFormatError)
})

test('assistant draft drops anything it cannot verify and reports it', () => {
  const draft = parseAssistantDraft(
    {
      title: 'T',
      contentHtml: '<p>x</p>',
      section: 'news',
      categorySlug: '供應鏈推薦',
      sources: [
        { name: 'ok', url: 'https://a.tw/x' },
        { name: 'script', url: 'javascript:alert(1)' },
      ],
      faq: [{ question: 'Q', answer: 'A' }, { question: '', answer: 'A' }],
      suggestions: { relatedSlugs: ['real', 'invented'], tags: ['標籤', 1] },
    },
    ['real']
  )
  assert.equal(draft.categorySlug, null)
  assert.equal(draft.section, null)
  assert.deepEqual(draft.sources.map((s) => s.name), ['ok'])
  assert.equal(draft.faq.length, 1)
  assert.deepEqual(draft.suggestions.relatedSlugs, ['real'])
  assert.deepEqual(draft.suggestions.tags, ['標籤'])
  assert.ok(draft.reviewNotes.some((n) => n.field === 'category'))
  assert.ok(draft.reviewNotes.some((n) => n.field === 'section'))
})

test('structured data types follow the section and JSON-LD cannot break out of the script tag', () => {
  const base = {
    siteUrl: 'https://www.chinalink.tw',
    url: 'https://www.chinalink.tw/blog/a',
    title: '</script><b>',
    description: 'd',
    author: '懂陸姐',
    faq: [{ question: 'Q', answer: 'A' }],
  }
  const opinion = buildArticleJsonLd({ ...base, section: 'opinion' })
  const observation = buildArticleJsonLd({ ...base, section: 'observation' })
  assert.equal(opinion[0]['@type'], 'BlogPosting')
  assert.equal(observation[0]['@type'], 'NewsArticle')
  assert.equal(opinion[1]['@type'], 'BreadcrumbList')
  assert.equal(opinion[2]['@type'], 'FAQPage')
  assert.ok(!serializeJsonLd(opinion).includes('</script>'))
})
