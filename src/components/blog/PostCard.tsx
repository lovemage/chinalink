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
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-brand-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
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

      <div className="flex flex-1 flex-col p-5">
        {post.categoryName && (
          <span className="mb-3 w-fit rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
            {post.categoryName}
          </span>
        )}

        <h3 className="text-lg font-bold text-brand-text transition-colors group-hover:text-brand-primary">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-brand-muted">
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
