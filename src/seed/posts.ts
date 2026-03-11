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
  coverImageId: number | string,
) {
  return {
    title: parsed.title,
    slug: parsed.slug,
    category: categoryId,
    coverImage: coverImageId,
    excerpt: source.excerpt,
    author: '懂陸姐',
    status: 'draft' as const,
    seo: {
      metaTitle: source.seo.metaTitle,
      metaDescription: source.seo.metaDescription,
    },
    content: buildPostContentBlocks(parsed, source, coverImageId),
  }
}

async function ensureArticleCoverImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  index: number,
  slug: string,
) {
  const coverFilename = `article-${String(index + 1).padStart(2, '0')}-cover.png`

  const existing = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: coverFilename,
      },
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    return existing.docs[0]
  }

  const coverPath = path.resolve(process.cwd(), 'public', 'seed', 'articles', coverFilename)

  return payload.create({
    collection: 'media',
    data: {
      alt: `${slug} 封面圖`,
    },
    filePath: coverPath,
  })
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

  for (const [index, source] of articleSeedSources.entries()) {
    const articlePath = path.resolve(process.cwd(), source.sourceFile)
    const parsed = await parseArticleMarkdownFile(articlePath)
    const category = await ensureCategory(payload, source)
    const coverImage = await ensureArticleCoverImage(payload, index, parsed.slug)

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
      const existingPost = existing.docs[0]

      await payload.update({
        collection: 'posts',
        id: existingPost.id,
        data: {
          coverImage: coverImage.id,
        },
      })

      console.log(`[seed] Post "${parsed.slug}" already exists. Cover image ensured.`)

      continue
    }

    await payload.create({
      collection: 'posts',
      data: buildSeedPostData(parsed, source, category.id, coverImage.id) as never,
    })

    console.log(`[seed] Created post: ${parsed.slug}`)
  }

  console.log('[seed] Post seeding complete.')
}