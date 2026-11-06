import type { PostFaqItem } from '@/lib/db/schema'
import { POST_SECTIONS, SITE_NAME, type PostSection } from './constants'

export interface ArticleJsonLdInput {
  siteUrl: string
  url: string
  section: PostSection
  title: string
  description: string
  author: string
  imageUrl?: string | null
  publishedAt?: Date | null
  updatedAt?: Date | null
  categoryName?: string | null
  faq: PostFaqItem[]
}

function absolute(siteUrl: string, url: string): string {
  return /^https?:\/\//.test(url) ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Returns BlogPosting/NewsArticle, BreadcrumbList and, when present, FAQPage. */
export function buildArticleJsonLd(input: ArticleJsonLdInput): Record<string, unknown>[] {
  const { siteUrl, url, section, faq } = input
  const sectionInfo = POST_SECTIONS[section]
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': section === 'observation' ? 'NewsArticle' : 'BlogPosting',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: url,
    url,
    inLanguage: 'zh-Hant-TW',
    author: { '@type': 'Person', name: input.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/Chinalink_logo.png` },
    },
    articleSection: sectionInfo.label,
  }
  if (input.imageUrl) article.image = [absolute(siteUrl, input.imageUrl)]
  if (input.publishedAt) article.datePublished = input.publishedAt.toISOString()
  if (input.updatedAt) article.dateModified = input.updatedAt.toISOString()

  const crumbs = [
    { name: '首頁', item: siteUrl },
    { name: sectionInfo.label, item: `${siteUrl}${sectionInfo.href}` },
    { name: input.title, item: url },
  ]
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }

  const graphs: Record<string, unknown>[] = [article, breadcrumb]
  if (faq.length > 0) graphs.push(buildFaqJsonLd(faq))
  return graphs
}

export function buildFaqJsonLd(faq: PostFaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** Safe for <script type="application/ld+json">: keeps "</script>" out of the payload. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
