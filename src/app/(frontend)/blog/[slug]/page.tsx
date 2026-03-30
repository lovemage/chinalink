export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PostCard } from '@/components/blog/PostCard'
import type { ComponentProps } from 'react'
import { getPostByCandidateSlugs, getRelatedPosts } from '@/lib/queries/posts'

type BlockRendererBlocks = ComponentProps<typeof BlockRenderer>['blocks']

async function canViewDraftPosts() {
  if (process.env.NODE_ENV === 'development') return true

  const host = (await headers()).get('host') || ''
  return host.startsWith('localhost') || host.startsWith('127.0.0.1')
}

function buildSlugCandidates(input: string) {
  const candidates = new Set<string>()
  const raw = input.trim()

  if (raw) {
    candidates.add(raw)
    candidates.add(raw.normalize('NFC'))
    candidates.add(raw.normalize('NFKC'))
  }

  try {
    const decoded = decodeURIComponent(raw)
    if (decoded) {
      candidates.add(decoded)
      candidates.add(decoded.normalize('NFC'))
      candidates.add(decoded.normalize('NFKC'))
    }
  } catch {
    // Keep raw candidates only if slug is not URI-encoded.
  }

  return [...candidates]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const slugCandidates = buildSlugCandidates(slug)
  const post = await getPostByCandidateSlugs(slugCandidates)
  const allowDraft = await canViewDraftPosts()

  if (!post || (!allowDraft && post.status !== 'published')) {
    return { title: '找不到文章' }
  }

  return {
    title: post.seoTitle || `${post.title} - 懂陸姐 ChinaLink`,
    description: post.seoDescription || post.excerpt || `懂陸姐 - ${post.title}`,
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const allowDraft = await canViewDraftPosts()
  const slugCandidates = buildSlugCandidates(slug)

  const post = await getPostByCandidateSlugs(slugCandidates)
  if (!post || (!allowDraft && post.status !== 'published')) notFound()

  const cover = post.coverImage
  const category = post.category

  // Fetch related posts from same category
  const relatedPosts = category
    ? await getRelatedPosts(category.id, post.id, 3)
    : []

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Cover image */}
        {cover?.url && (
          <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-2xl">
            <Image
              src={cover.heroUrl || cover.url}
              alt={cover.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Category badge */}
        {category && (
          <Link
            href={`/blog?category=${category.slug}`}
            className="mb-3 inline-block rounded-full bg-brand-primary/10 px-4 py-1 text-sm font-medium text-brand-primary hover:bg-brand-primary/20 transition-colors"
          >
            {category.name}
          </Link>
        )}

        <h1 className="text-3xl font-bold text-brand-text sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-brand-muted">
          {post.author && <span>{post.author}</span>}
          <time>
            {post.publishedAt
              ? formatDate(post.publishedAt)
              : post.createdAt
                ? formatDate(post.createdAt)
                : ''}
          </time>
        </div>

        {/* Content blocks */}
        <div className="mt-10">
          {post.content && (
            <BlockRenderer blocks={post.content as BlockRendererBlocks} />
          )}
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-brand-primary/10 pt-10">
            <h2 className="text-2xl font-bold text-brand-text">相關文章</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
