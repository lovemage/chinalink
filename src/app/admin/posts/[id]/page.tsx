import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/queries/posts'
import { getBlogCategories } from '@/lib/queries/categories'
import { getPostTagsAll } from '@/lib/queries/post-tags'
import PostForm from '@/components/admin/PostForm'
import DeletePostButton from './DeletePostButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) notFound()

  const [post, categories, tags] = await Promise.all([
    getPost(postId),
    getBlogCategories(),
    getPostTagsAll(),
  ])

  if (!post) notFound()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/posts"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回文章管理
        </Link>
        <DeletePostButton postId={postId} postTitle={post.title} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">編輯文章：{post.title}</h1>

      <PostForm
        post={post}
        categories={categories}
        availableTags={tags}
        mode="edit"
      />
    </div>
  )
}
