import Link from 'next/link'
import type { PublishedPostCard } from '@/lib/queries/posts'
import { postDate } from './PostCard'

/**
 * The dateline wire: date and source sit in their own columns beside each headline.
 * `tone="field"` is for the olive band on the home page.
 */
export function WireList({
  posts,
  tone = 'paper',
  headingAs: Heading = 'h3',
}: {
  posts: PublishedPostCard[]
  tone?: 'paper' | 'field'
  headingAs?: 'h2' | 'h3'
}) {
  const onField = tone === 'field'
  const rule = onField ? 'border-white/20' : 'border-brand-rule'
  const secondary = onField ? 'text-brand-tint' : 'text-brand-muted'
  return (
    <ol className={`border-t ${onField ? 'border-white/50' : 'border-brand-text'}`}>
      {posts.map((post) => {
        const source = post.sources?.[0]?.name
        return (
          <li key={post.id} className={`border-b ${rule}`}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-x-8 gap-y-2 py-5 md:grid-cols-[6.5rem_minmax(0,1fr)_11rem] md:py-6"
            >
              <time className={`dateline text-sm ${secondary} md:pt-1`}>{postDate(post)}</time>
              <div className="min-w-0">
                <Heading className="font-serif text-[1.0625rem] font-medium leading-8 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-xl">
                  {post.title}
                </Heading>
                {post.excerpt && (
                  <p className={`mt-1.5 line-clamp-2 max-w-[62ch] text-[15px] leading-7 ${secondary}`}>{post.excerpt}</p>
                )}
              </div>
              <p className={`text-[13px] leading-6 ${secondary} md:pt-1 md:text-right`}>
                {source ? `來源：${source}` : post.categoryName}
              </p>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
