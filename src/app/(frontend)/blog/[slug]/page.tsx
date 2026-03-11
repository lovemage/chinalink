export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { PostCard } from '@/components/blog/PostCard'
import type { Post, Category, Media } from '@/payload-types'
import type { ComponentProps } from 'react'

type BlockRendererBlocks = ComponentProps<typeof BlockRenderer>['blocks']

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  const post = result.docs[0] as Post | undefined
  if (!post) return { title: '找不到文章' }

  return {
    title: post.seo?.metaTitle || `${post.title} - 懂陸姐 ChinaLink`,
    description: post.seo?.metaDescription || post.excerpt || `懂陸姐 - ${post.title}`,
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
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
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0] as Post | undefined
  if (!post) notFound()

  const cover =
    typeof post.coverImage === 'object' && post.coverImage
      ? (post.coverImage as Media)
      : null
  const category =
    typeof post.category === 'object' && post.category
      ? (post.category as Category)
      : null

  // Fetch related posts from same category
  let relatedPosts: Post[] = []
  if (category) {
    const relatedResult = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
        category: { equals: category.id },
        id: { not_equals: post.id },
      },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    })
    relatedPosts = relatedResult.docs as Post[]
  }

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Cover image */}
        {cover?.url && (
          <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-2xl">
            <Image
              src={cover.sizes?.hero?.url || cover.url}
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
              : formatDate(post.createdAt)}
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
