import Link from 'next/link'
import Image from 'next/image'

export interface DrizzlePostForCard {
  id: number
  title: string
  slug: string
  excerpt: string | null
  author: string | null
  publishedAt: Date | null
  createdAt: Date | null
  categoryName: string | null
  categorySlug: string | null
  coverImageUrl: string | null
  coverImageAlt: string | null
}

interface PostCardProps {
  post: DrizzlePostForCard
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function PostCard({ post }: PostCardProps) {
  const dateDisplay = post.publishedAt
    ? formatDate(post.publishedAt)
    : post.createdAt
      ? formatDate(post.createdAt)
      : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-brand-primary/8 sm:rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-primary/10">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-brand-primary/30">&#128221;</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {post.categoryName && (
          <span className="mb-2 w-fit rounded-full bg-brand-primary/10 px-2.5 py-1 text-[11px] font-medium text-brand-primary sm:mb-3 sm:px-3 sm:text-xs">
            {post.categoryName}
          </span>
        )}

        <h3 className="text-base font-bold text-brand-text transition-colors group-hover:text-brand-primary sm:text-lg">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-xs text-brand-muted sm:mt-2 sm:text-sm">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4">
          {dateDisplay && (
            <time className="text-xs text-brand-muted">
              {dateDisplay}
            </time>
          )}
        </div>
      </div>
    </Link>
  )
}
