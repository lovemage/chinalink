import Link from 'next/link'
import Image from 'next/image'
import type { Post, Category, Media } from '@/payload-types'

interface PostCardProps {
  post: Post
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function PostCard({ post }: PostCardProps) {
  const cover =
    typeof post.coverImage === 'object' && post.coverImage
      ? (post.coverImage as Media)
      : null
  const category =
    typeof post.category === 'object' && post.category
      ? (post.category as Category)
      : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-primary/10">
        {cover?.url ? (
          <Image
            src={cover.sizes?.card?.url || cover.url}
            alt={cover.alt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-brand-primary/30">&#128221;</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="mb-2 w-fit rounded-full bg-brand-primary/10 px-3 py-0.5 text-xs font-medium text-brand-primary">
            {category.name}
          </span>
        )}

        <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-brand-muted">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4">
          <time className="text-xs text-brand-muted">
            {post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.createdAt)}
          </time>
        </div>
      </div>
    </Link>
  )
}
