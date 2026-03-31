import Link from 'next/link'
import { getPosts } from '@/lib/queries/posts'
import { getBlogCategories } from '@/lib/queries/categories'
import { getPostTagsAll } from '@/lib/queries/post-tags'
import PostsTable from './PostsTable'

interface PageProps {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    status?: string
  }>
}

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ''
  const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined
  const status = params.status ?? ''

  const [postsList, categories, tags] = await Promise.all([
    getPosts({
      search: search || undefined,
      categoryId,
      status: status || undefined,
    }),
    getBlogCategories(),
    getPostTagsAll(),
  ])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          新增文章
        </Link>
      </div>

      <PostsTable
        posts={postsList}
        categories={categories}
        tags={tags}
        initialSearch={search}
        initialCategoryId={categoryId?.toString() ?? ''}
        initialStatus={status}
      />
    </div>
  )
}
