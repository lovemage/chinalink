export const dynamic = 'force-dynamic'

import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { BlogSearchBar } from '@/components/blog/BlogSearchBar'
import { PostCard } from '@/components/blog/PostCard'
import { getPostCategoriesAll, getPublishedPostsFiltered } from '@/lib/queries/posts'

export const metadata = {
  title: 'Blog - 懂陸姐 ChinaLink',
  description: '懂陸姐部落格 — 台商大陸經營知識、實務攻略與最新資訊',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams

  const [categories, posts] = await Promise.all([
    getPostCategoriesAll(),
    getPublishedPostsFiltered(category, search),
  ])

  return (
    <section className="relative min-h-[50vh] pt-32 pb-24 overflow-hidden bg-brand-bg">
      {/* Background organic shape */}
      <div className="pointer-events-none absolute top-20 left-0 -ml-24 h-[420px] w-[420px] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-brand-cta/5 blur-3xl opacity-40" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-primary uppercase">
            <span className="h-px w-8 bg-brand-primary"></span>
            Insights & Articles
          </div>
          <h1 className="font-serif text-5xl font-medium tracking-tight text-brand-text sm:text-6xl">
            專欄觀點 <span className="font-playfair italic text-brand-primary">Blog</span>
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-brand-muted max-w-xl">
            台商大陸經營知識、實務攻略與最新政策資訊，幫助您掌握兩岸商業趨勢。
          </p>
        </div>

        <div className="mt-16">
          <CategoryFilter categories={categories} />
        </div>

        <div className="mt-4 max-w-xl">
          <BlogSearchBar initialSearch={search ?? ''} />
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-24 text-center">
            <p className="font-serif text-xl text-brand-muted">目前沒有文章</p>
          </div>
        )}
      </div>
    </section>
  )
}
