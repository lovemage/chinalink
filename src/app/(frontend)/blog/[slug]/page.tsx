export const dynamic = 'force-dynamic'

import { cache, type ComponentProps } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { PostCard } from '@/components/blog/PostCard'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { FaqList } from '@/components/site/FaqList'
import { JsonLd } from '@/components/site/JsonLd'
import { getAdminFromCookies } from '@/lib/auth-admin'
import { getSiteUrl, isPostSection, POST_SECTIONS, POST_STATUS_LABELS, SITE_NAME } from '@/lib/posts/constants'
import { buildArticleJsonLd } from '@/lib/posts/structured-data'
import { formatDateline } from '@/lib/posts/time'
import { isTiptapDoc } from '@/lib/posts/tiptap'
import { getPostByCandidateSlugs, getRelatedPostsFor, getSlugRedirectTarget } from '@/lib/queries/posts'

type BlockRendererBlocks = ComponentProps<typeof BlockRenderer>['blocks']

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

const loadPost = cache(async (slug: string) => {
  const candidates = buildSlugCandidates(slug)
  const post = await getPostByCandidateSlugs(candidates)
  return { post, candidates }
})

/** Only a signed-in admin can read drafts and scheduled posts, for preview. */
async function canPreview() {
  return Boolean(await getAdminFromCookies())
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { post } = await loadPost(slug)

  if (!post || (post.status !== 'published' && !(await canPreview()))) {
    return { title: '找不到文章' }
  }

  const path = `/blog/${encodeURI(post.slug)}`
  const title = post.seoTitle || `${post.title}｜${SITE_NAME}`
  const description = post.seoDescription || post.excerpt || undefined
  const image = post.ogImageUrl || post.coverImage?.url
  const isPublic = post.status === 'published'

  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl || path },
    robots: post.noindex || !isPublic ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      url: path,
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: image ? [{ url: image, alt: post.coverImageAlt || post.title }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { post, candidates } = await loadPost(slug)

  if (!post) {
    const target = await getSlugRedirectTarget(candidates)
    if (target) permanentRedirect(`/blog/${encodeURI(target)}`)
    notFound()
  }
  const isPublic = post.status === 'published'
  if (!isPublic && !(await canPreview())) notFound()

  const section = isPostSection(post.section) ? post.section : 'opinion'
  const sectionInfo = POST_SECTIONS[section]
  const cover = post.coverImage
  const category = post.category
  const tags = (post.tagRelations || []).map((rel) => rel.tag).filter(Boolean)
  const relatedPosts = await getRelatedPostsFor(post)
  const date = post.publishedAt ?? post.createdAt
  const updated =
    post.updatedAt && formatDateline(post.updatedAt) !== formatDateline(date) ? formatDateline(post.updatedAt) : null
  const siteUrl = getSiteUrl()
  const primarySource = post.sources?.[0]

  return (
    <article>
      {isPublic && (
        <JsonLd
          data={buildArticleJsonLd({
            siteUrl,
            url: post.canonicalUrl || `${siteUrl}/blog/${encodeURI(post.slug)}`,
            section,
            title: post.title,
            description: post.seoDescription || post.excerpt || '',
            author: post.author || '懂陸姐',
            imageUrl: cover?.url,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            categoryName: category?.name,
            faq: post.faq ?? [],
          })}
        />
      )}

      {!isPublic && (
        <p className="bg-brand-tint px-4 py-2.5 text-center text-sm font-medium">
          預覽模式：這篇文章目前為「{POST_STATUS_LABELS[post.status] ?? post.status}」，尚未公開
        </p>
      )}

      {/* The wire's dateline opens observation pieces; opinion pieces open with the byline. */}
      {section === 'observation' && (
        <div className="bg-brand-deep text-brand-raised">
          <div className="dateline mx-auto flex max-w-[1200px] flex-wrap gap-x-6 gap-y-1 px-4 py-3 text-sm sm:px-6">
            <span className="font-bold">{sectionInfo.label}</span>
            <time>{formatDateline(date)}</time>
            {primarySource && <span>來源：{primarySource.name}</span>}
          </div>
        </div>
      )}

      <header className="mx-auto max-w-[760px] px-4 pt-8 sm:px-6 lg:pt-12">
        <nav aria-label="麵包屑" className="flex flex-wrap gap-x-2 text-[13px] text-brand-muted">
          <Link href={sectionInfo.href} className="hover:text-brand-text">
            {sectionInfo.label}
          </Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/category/${category.slug}`} className="hover:text-brand-text">
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <h1 className="mt-4 font-serif text-[1.875rem] font-bold leading-[1.4] text-balance sm:text-[2.5rem]">{post.title}</h1>

        <p className="dateline mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted">
          <span>文／{post.author || '懂陸姐'}</span>
          <time dateTime={date?.toISOString()}>{formatDateline(date)}</time>
          {updated && <span>更新於 {updated}</span>}
        </p>
      </header>

      {cover?.url && (
        <div className="mx-auto mt-8 max-w-[1000px] sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden bg-brand-tint">
            <Image
              src={cover.heroUrl || cover.url}
              alt={post.coverImageAlt || cover.alt || post.title}
              fill
              sizes="(max-width: 1000px) 100vw, 1000px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[760px] px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
        {Array.isArray(post.content) && <BlockRenderer blocks={post.content as BlockRendererBlocks} />}
        {isTiptapDoc(post.content) && <ArticleBody content={post.content} />}

        {post.sources?.length > 0 && (
          <section className="mt-12 border-t border-brand-text pt-5">
            <h2 className="font-serif text-lg font-bold">資料來源</h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-7">
              {post.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="text-link">
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {post.faq?.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-serif text-[1.375rem] font-bold">常見問題</h2>
            <FaqList items={post.faq} />
          </section>
        )}

        {tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.id} className="border border-brand-rule px-2.5 py-1 text-[13px] text-brand-muted">
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <section className="border-t border-brand-rule">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
            <h2 className="font-serif text-[1.625rem] font-bold">相關文章</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} showSection />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
