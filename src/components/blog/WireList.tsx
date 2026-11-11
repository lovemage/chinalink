import Image from 'next/image'
import Link from 'next/link'
import type { PublishedPostCard } from '@/lib/queries/posts'
import { postDate } from './PostCard'

/**
 * The dateline wire: a thumbnail leads each headline, and the date sits with the source.
 * The thumbnail stays shorter than the headline block, so it never adds height to a row.
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
  const thumbEmpty = onField ? 'bg-white/10' : 'bg-brand-tint'
  return (
    <ol className={`border-t ${onField ? 'border-white/50' : 'border-brand-text'}`}>
      {posts.map((post) => {
        const source = post.sources?.[0]?.name
        const origin = source ? `來源：${source}` : post.categoryName
        return (
          <li key={post.id} className={`border-b ${rule}`}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 py-5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-6 md:grid-cols-[6.5rem_minmax(0,1fr)_11rem] md:gap-x-8 md:py-6"
            >
              <div className={`relative aspect-[4/3] overflow-hidden ${thumbEmpty} md:mt-1`}>
                {post.coverImageUrl && (
                  <Image src={post.coverImageUrl} alt="" fill sizes="(max-width: 640px) 80px, 104px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <Heading className="font-serif text-[1.0625rem] font-medium leading-7 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-xl sm:leading-8">
                  {post.title}
                </Heading>
                {post.excerpt && (
                  <p className={`mt-1.5 line-clamp-2 max-w-[62ch] text-[15px] leading-7 ${secondary}`}>{post.excerpt}</p>
                )}
                <p className={`mt-1.5 flex gap-x-3 text-[13px] leading-6 ${secondary} md:hidden`}>
                  <time className="dateline shrink-0">{postDate(post)}</time>
                  {origin && <span className="min-w-0 truncate">{origin}</span>}
                </p>
              </div>
              <div className={`hidden text-right text-[13px] leading-6 ${secondary} md:block md:pt-1`}>
                <time className="dateline block text-sm">{postDate(post)}</time>
                {origin && <p className="mt-1 line-clamp-2" title={origin}>{origin}</p>}
              </div>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
