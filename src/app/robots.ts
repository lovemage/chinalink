import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/posts/constants'

// AI 搜尋與助理：允許讀取，內容可被引用、導流。
const AI_SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-CloudVertexBot',
  'Applebot',
  'DuckDuckBot',
]

// 純訓練用爬蟲：不開放內容餵模型。
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'meta-externalagent',
  'cohere-ai',
  'Diffbot',
  'omgili',
  'MistralAI-Training',
  'KimiBot',
]

const PRIVATE_PATHS = [
  '/admin',
  '/api/',
  '/account',
  '/checkout',
  '/service-cart',
  '/login',
  '/website-repositioning-survey',
]

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: AI_SEARCH_BOTS,
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
