import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/posts/constants'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        '/account',
        '/checkout',
        '/service-cart',
        '/login',
        '/website-repositioning-survey',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
