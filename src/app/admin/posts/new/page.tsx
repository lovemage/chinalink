import Link from 'next/link'
import { getBlogCategories } from '@/lib/queries/categories'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const categories = await getBlogCategories()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/posts"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回文章管理
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">新增文章</h1>

      <PostForm
        categories={categories}
        mode="create"
      />
    </div>
  )
}
