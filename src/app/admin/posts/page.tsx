import Link from 'next/link'
import { getPosts } from '@/lib/queries/posts'
import { getBlogCategories } from '@/lib/queries/categories'
import { getPostTagsAll } from '@/lib/queries/post-tags'
import { checkPost } from '@/lib/posts/checks'
import PostsTable from './PostsTable'

interface PageProps {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    status?: string
    section?: string
  }>
}

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ''
  const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined
  const status = params.status ?? ''
  const section = params.section ?? ''

  const [postsList, categories, tags] = await Promise.all([
    getPosts({
      search: search || undefined,
      categoryId,
      status: status || undefined,
      section: section || undefined,
    }),
    getBlogCategories(),
    getPostTagsAll(),
  ])

  // Article bodies stay on the server; the list only needs the result of the check.
  const rows = postsList.map((post) => {
    const check = checkPost({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content,
      section: post.section,
      categoryId: post.categoryId,
      coverImageUrl: post.coverImageUrl ?? '',
      coverImageAlt: post.coverImageAlt ?? '',
      author: post.author ?? '',
      seoTitle: post.seoTitle ?? '',
      seoDescription: post.seoDescription ?? '',
      focusKeyword: post.focusKeyword ?? '',
      tagCount: post.tagCount,
      ogTitle: post.ogTitle ?? '',
      ogDescription: post.ogDescription ?? '',
      sources: post.sources,
      faq: post.faq,
      relatedPostIds: post.relatedPostIds,
    })
    return {
      id: post.id,
      title: post.title,
      section: post.section,
      categoryName: post.categoryName,
      status: post.status,
      publishedAt: post.publishedAt,
      scheduledAt: post.scheduledAt,
      scheduleError: post.scheduleError,
      createdAt: post.createdAt,
      completion: check.completion,
      missing: check.required.length,
    }
  })

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-text md:text-2xl">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex min-h-11 items-center bg-brand-primary px-4 text-sm font-bold text-brand-raised hover:bg-brand-deep"
        >
          新增文章
        </Link>
      </div>

      <PostsTable
        posts={rows}
        categories={categories}
        tags={tags}
        initialSearch={search}
        initialCategoryId={categoryId?.toString() ?? ''}
        initialStatus={status}
        initialSection={section}
      />
    </div>
  )
}
