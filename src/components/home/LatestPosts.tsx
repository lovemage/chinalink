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
    limit: 3,
  })

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">最新文章</h2>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-brand-muted">
            目前還沒有文章，敬請期待！
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
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
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FFEDD5]">
                    {cover?.url ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl text-brand-primary/40">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                          <path d="M18 14h-8" />
                          <path d="M15 18h-5" />
                          <path d="M10 6h8v4h-8V6Z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {date && (
                      <time className="text-xs text-brand-muted">{date}</time>
                    )}
                    <h3 className="mt-1 text-lg font-semibold leading-snug text-brand-text group-hover:text-brand-primary">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-brand-muted">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
            >
              查看全部文章 &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
