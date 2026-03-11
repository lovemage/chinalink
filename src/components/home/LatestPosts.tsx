import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media as MediaType } from '@/payload-types'
import { ArrowRight } from 'lucide-react'

export async function LatestPosts() {
  const payload = await getPayload({ config: configPromise })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 3,
  })

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-brand-primary uppercase">
              <span className="h-px w-8 bg-brand-primary"></span>
              最新觀點
            </div>
            <h2 className="text-3xl font-extrabold text-brand-text sm:text-4xl md:text-5xl">
              掌握兩岸最新<br/>商業趨勢與政策
            </h2>
          </div>
          {posts.length > 0 && (
            <Link
              href="/blog"
              className="group inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-card px-6 font-semibold text-brand-text shadow-sm transition-all hover:border-brand-primary hover:text-brand-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              閱讀更多文章
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-[2.5rem] border-2 border-dashed border-brand-muted/20 bg-brand-bg/50">
            <p className="text-lg text-brand-muted">目前還沒有文章，敬請期待！</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {posts.map((post, index) => {
              const cover = post.coverImage as MediaType | null | undefined
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null

              const isFeatured = index === 0;

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-brand-bg/30 transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                    isFeatured ? 'lg:col-span-7' : 'lg:col-span-5'
                  }`}
                >
                  <div className={`relative w-full overflow-hidden ${isFeatured ? 'aspect-[4/3] lg:aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    {cover?.url ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt || post.title}
                        fill
                        sizes={isFeatured ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-primary/5">
                        <div className="relative h-[80px] w-[80px] opacity-30">
                          <Image src="/icons/marketing.png" alt="文章" fill sizes="80px" className="object-contain" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>
                    
                    {date && (
                      <div className="absolute top-6 left-6 rounded-full bg-card/95 px-4 py-1.5 text-xs font-bold text-brand-text shadow-sm">
                        {date}
                      </div>
                    )}
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-end p-6 text-white sm:p-8 md:p-10`}>
                    <h3 className={`font-bold leading-tight drop-shadow-md ${isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}>
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className={`mt-3 line-clamp-2 text-white/80 drop-shadow-sm ${isFeatured ? 'text-base sm:text-lg' : 'text-sm'}`}>
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-brand-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      閱讀全文 <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
