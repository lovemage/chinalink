/**
 * Picks the articles most related to a question. Chinese has no word boundaries, so
 * titles and questions are compared by overlapping character pairs (bigrams), plus
 * whole Latin words such as "GIA" or "1688".
 */

const STOP_BIGRAMS = new Set([
  '什麼', '怎麼', '可以', '請問', '你們', '我們', '一下', '如何', '有沒', '沒有', '是不', '不是',
  '哪裡', '哪些', '需要', '想要', '知道', '現在', '這個', '那個', '台灣', '大陸', '懂陸', '陸姐',
])

const PARTICLES = /[的了嗎呢吧啊是在和與及或也都就要會能有]/

function normalize(text: string): string {
  return text.toLowerCase().replace(/[臺]/g, '台')
}

export function tokenize(text: string): Set<string> {
  const tokens = new Set<string>()
  const value = normalize(text)
  for (const run of value.match(/[一-鿿]+/g) ?? []) {
    for (let i = 0; i < run.length - 1; i++) {
      const pair = run.slice(i, i + 2)
      if (!STOP_BIGRAMS.has(pair) && !PARTICLES.test(pair)) tokens.add(pair)
    }
  }
  for (const word of value.match(/[a-z0-9]{2,}/g) ?? []) tokens.add(word)
  return tokens
}

export interface RankableDoc {
  id: number
  /** Weighted 3x: the strongest signal of what the article is about. */
  title: string
  /** Excerpt, keywords, tags, category. */
  summary: string
}

export function rankDocs<T extends RankableDoc>(query: string, docs: T[], limit = 3): T[] {
  const queryTokens = tokenize(query)
  if (queryTokens.size === 0) return []
  const scored = docs
    .map((doc) => {
      const titleTokens = tokenize(doc.title)
      const summaryTokens = tokenize(doc.summary)
      let score = 0
      for (const token of queryTokens) {
        if (titleTokens.has(token)) score += 3
        else if (summaryTokens.has(token)) score += 1
      }
      return { doc, score }
    })
    .filter((row) => row.score >= 1)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((row) => row.doc)
}
