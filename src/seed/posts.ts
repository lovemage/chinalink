import path from 'node:path'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { articleSeedSources, type ArticleSeedSource } from './articles'
import { parseArticleMarkdownFile, type ParsedArticle } from './articleParser'
import { buildPostContentBlocks } from './postBlocks'

export function buildSeedPostData(
  parsed: ParsedArticle,
  source: ArticleSeedSource,
  categoryId: number | string,
) {
  return {
    title: parsed.title,
    slug: parsed.slug,
    category: categoryId,
    excerpt: source.excerpt,
    author: '懂陸姐',
    status: 'draft' as const,
    seo: {
      metaTitle: source.seo.metaTitle,
      metaDescription: source.seo.metaDescription,
    },
    content: buildPostContentBlocks(parsed, source),
  }
}

async function ensureCategory(payload: Awaited<ReturnType<typeof getPayload>>, source: ArticleSeedSource) {
  const existing = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: source.category.slug,
      },
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    return existing.docs[0]
  }

  return payload.create({
    collection: 'categories',
    data: {
      name: source.category.name,
      slug: source.category.slug,
    },
  })
}

export async function seedPosts() {
  const payload = await getPayload({ config: configPromise })

  for (const source of articleSeedSources) {
    const articlePath = path.resolve(process.cwd(), source.sourceFile)
    const parsed = await parseArticleMarkdownFile(articlePath)
    const category = await ensureCategory(payload, source)

    const existing = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: parsed.slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`[seed] Post "${parsed.slug}" already exists, skipping.`)
      continue
    }

    await payload.create({
      collection: 'posts',
      data: buildSeedPostData(parsed, source, category.id) as never,
    })

    console.log(`[seed] Created post: ${parsed.slug}`)
  }

  console.log('[seed] Post seeding complete.')
}