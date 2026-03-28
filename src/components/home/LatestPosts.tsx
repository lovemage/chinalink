import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media as MediaType } from '@/payload-types'

export async function LatestPosts() {
  const payload = await getPayload({ config: configPromise })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 10,
  })

  if (posts.length === 0) return null

  // Duplicate posts for seamless infinite scroll
  const marqueeItems = [...posts, ...posts]

  return (
    <section className="bg-background py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-brand-primary uppercase">
              <span className="h-px w-8 bg-brand-primary"></span>
              最新觀點
            </div>
            <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl md:text-5xl">
              掌握兩岸最新<br />商業趨勢與政策
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-card px-6 font-semibold text-brand-text shadow-sm transition-all hover:border-brand-primary hover:text-brand-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            閱讀更多文章
          </Link>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />

        <div className="flex animate-marquee gap-6 hover:[animation-play-state:paused]">
          {marqueeItems.map((post, index) => {
            const cover = post.coverImage as MediaType | null | undefined
            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null

            return (
              <Link
                key={`${post.id}-${index}`}
                href={`/blog/${post.slug}`}
                className="group relative flex-shrink-0 w-[320px] sm:w-[380px] overflow-hidden rounded-3xl bg-brand-bg/30 transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {cover?.url ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt || post.title}
                      fill
                      sizes="380px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-brand-primary/5">
                      <div className="relative h-[60px] w-[60px] opacity-30">
                        <Image src="/icons/marketing.png" alt="文章" fill sizes="60px" className="object-contain" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                  {date && (
                    <div className="absolute top-4 left-4 rounded-full bg-card/95 px-3 py-1 text-xs font-bold text-brand-text shadow-sm">
                      {date}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white sm:p-6">
                  <h3 className="text-lg font-bold leading-tight drop-shadow-md line-clamp-2 sm:text-xl">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-white/80 drop-shadow-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
