import Image from 'next/image'
import Link from 'next/link'
import { formatDateline } from '@/lib/posts/time'
import { POST_SECTIONS, isPostSection } from '@/lib/posts/constants'
import type { PublishedPostCard } from '@/lib/queries/posts'

export function postDate(post: Pick<PublishedPostCard, 'publishedAt' | 'createdAt'>) {
  return formatDateline(post.publishedAt ?? post.createdAt)
}

export function coverAlt(post: Pick<PublishedPostCard, 'coverImageAlt' | 'mediaAlt' | 'title'>) {
  return post.coverImageAlt || post.mediaAlt || post.title
}

function Meta({ post, showSection }: { post: PublishedPostCard; showSection?: boolean }) {
  const section = isPostSection(post.section) ? POST_SECTIONS[post.section].shortLabel : null
  return (
    <p className="dateline flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-brand-muted">
      <time>{postDate(post)}</time>
      {showSection && section && <span>{section}</span>}
      {post.categoryName && <span>{post.categoryName}</span>}
    </p>
  )
}

/** The lead story of a list. Holds its shape when a post has no cover image. */
export function LeadPost({ post, headingAs: Heading = 'h2' }: { post: PublishedPostCard; headingAs?: 'h2' | 'h3' }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.coverImageUrl && (
          <div className="relative mb-5 aspect-[16/9] overflow-hidden bg-brand-tint">
            <Image
              src={post.coverImageUrl}
              alt={coverAlt(post)}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
          </div>
        )}
        <Meta post={post} />
        <Heading className="mt-3 font-serif text-[1.625rem] font-bold leading-snug text-brand-text text-balance transition-colors group-hover:text-brand-primary sm:text-[2rem]">
          {post.title}
        </Heading>
        {post.excerpt && <p className="mt-4 line-clamp-3 max-w-[60ch] text-base leading-8 text-brand-muted">{post.excerpt}</p>}
      </Link>
    </article>
  )
}

/** A compact row with an optional thumbnail, for the rail beside a lead story. */
export function PostRow({ post, headingAs: Heading = 'h3' }: { post: PublishedPostCard; headingAs?: 'h2' | 'h3' }) {
  return (
    <article className="group border-b border-brand-rule py-5 first:pt-0 last:border-b-0 last:pb-0">
      <Link href={`/blog/${post.slug}`} className="flex gap-4">
        <div className="min-w-0 flex-1">
          <Meta post={post} />
          <Heading className="mt-2 line-clamp-3 font-serif text-[1.0625rem] font-medium leading-7 text-brand-text transition-colors group-hover:text-brand-primary">
            {post.title}
          </Heading>
        </div>
        {post.coverImageUrl && (
          <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-brand-tint sm:w-28">
            <Image src={post.coverImageUrl} alt="" fill sizes="112px" className="object-cover" />
          </div>
        )}
      </Link>
    </article>
  )
}

/** Grid item for list pages. */
export function PostCard({ post, showSection }: { post: PublishedPostCard; showSection?: boolean }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative mb-4 aspect-[16/10] overflow-hidden bg-brand-tint">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={coverAlt(post)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-serif text-lg text-brand-muted" aria-hidden="true">
              懂陸姐
            </span>
          )}
        </div>
        <Meta post={post} showSection={showSection} />
        <h3 className="mt-2 line-clamp-3 font-serif text-lg font-medium leading-8 text-brand-text transition-colors group-hover:text-brand-primary">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-brand-muted">{post.excerpt}</p>}
      </Link>
    </article>
  )
}
