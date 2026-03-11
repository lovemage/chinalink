export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { PostCard } from '@/components/blog/PostCard'
import type { Category, Post } from '@/payload-types'
import type { Where } from 'payload'

export const metadata = {
  title: 'Blog - 懂陸姐 ChinaLink',
  description: '懂陸姐部落格 — 台商大陸經營知識、實務攻略與最新資訊',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  const where: Where = {
    status: { equals: 'published' },
  }

  if (category) {
    const matchedCategory = categoriesResult.docs.find(
      (c: Category) => c.slug === category,
    )
    if (matchedCategory) {
      where.category = { equals: matchedCategory.id }
    }
  }

  const postsResult = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: 20,
    depth: 1,
  })

  const categories = categoriesResult.docs as Category[]
  const posts = postsResult.docs as Post[]

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-brand-text sm:text-4xl">Blog</h1>
        <p className="mt-3 text-brand-muted">
          台商大陸經營知識、實務攻略與最新資訊
        </p>

        <div className="mt-8">
          <CategoryFilter categories={categories} />
        </div>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg text-brand-muted">目前沒有文章</p>
          </div>
        )}
      </div>
    </section>
  )
}
