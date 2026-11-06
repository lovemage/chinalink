export const POST_SECTIONS = {
  opinion: {
    label: '陸姐觀點',
    shortLabel: '觀點',
    href: '/blog',
    description: 'Tina 對大陸市場的觀察、經驗與判斷。',
  },
  observation: {
    label: '供應鏈觀察',
    shortLabel: '觀察',
    href: '/observations',
    description: '市場、產業帶與供應鏈的動態，附來源與觀察。',
  },
} as const

export type PostSection = keyof typeof POST_SECTIONS

export function isPostSection(value: unknown): value is PostSection {
  return value === 'opinion' || value === 'observation'
}

export const ARTICLE_CATEGORY_SLUGS = [
  'ecommerce-platforms',
  'retail-consumer',
  'b2b-supply-chain',
  'new-media-traffic',
] as const

export type PostStatus = 'draft' | 'scheduled' | 'published'

export const POST_STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  scheduled: '已排程',
  published: '已發布',
}

export const SITE_NAME = '懂陸姐 ChinaLink'

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chinalink.tw').replace(/\/$/, '')
}
