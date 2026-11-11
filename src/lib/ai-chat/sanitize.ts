interface LinkContext {
  posts: Array<{ url: string }>
  services: Array<{ url: string }>
  products: Array<{ url: string }>
}

interface LinkConfig {
  lineOfficialUrl?: string
  whatsappUrl?: string
  /** Site pages and partner sites the prompt lists. */
  extraUrls?: string[]
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

function safeParseUrl(url: string): URL | null {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export function buildAllowedLinks(
  context: LinkContext,
  config: LinkConfig,
  siteUrl: string,
): Set<string> {
  const base = normalizeUrl(siteUrl)
  const allow = new Set<string>([base, `${base}/products`, `${base}/services`, `${base}/blog`, `${base}/contact`])
  for (const row of [...context.posts, ...context.services, ...context.products]) allow.add(normalizeUrl(row.url))
  for (const url of config.extraUrls ?? []) allow.add(normalizeUrl(url))
  if (config.lineOfficialUrl) allow.add(normalizeUrl(config.lineOfficialUrl))
  if (config.whatsappUrl) allow.add(normalizeUrl(config.whatsappUrl))
  return allow
}

export function sanitizeAssistantLinks(
  content: string,
  allowedLinks: Set<string>,
  siteUrl: string,
): string {
  const base = normalizeUrl(siteUrl)
  const baseUrl = safeParseUrl(base)
  const baseHost = baseUrl?.host ?? ''
  const urlRegex = /https?:\/\/[^\s<>"')]+/g

  return content.replace(urlRegex, (raw) => {
    const trimmed = raw.replace(/[.,!?;:]+$/g, '')
    const parsed = safeParseUrl(trimmed)
    if (!parsed) return trimmed

    const normalized = normalizeUrl(trimmed)
    if (allowedLinks.has(normalized)) return trimmed

    if (parsed.host === baseHost) {
      if (parsed.pathname.startsWith('/products/')) return `${base}/products`
      if (parsed.pathname.startsWith('/services/')) return `${base}/services`
      if (parsed.pathname.startsWith('/blog/')) return `${base}/blog`
      return base
    }

    return trimmed
  })
}

