import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getPublishedPostRefs } from '@/lib/queries/posts'
import { getBlogCategories } from '@/lib/queries/categories'
import { getPostTagsAll } from '@/lib/queries/post-tags'
import { getSiteUrl } from '@/lib/posts/constants'
import PostForm from '@/components/admin/PostForm'
import DeletePostButton from './DeletePostButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) notFound()

  const [post, categories, tags, allPosts] = await Promise.all([
    getPost(postId),
    getBlogCategories(),
    getPostTagsAll(),
    getPublishedPostRefs(),
  ])

  if (!post) notFound()

  return (
    <div className="space-y-3 p-3 md:p-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/admin/posts" className="inline-flex min-h-9 items-center text-sm text-brand-muted hover:text-brand-text">
          ← 文章管理
        </Link>
        <DeletePostButton postId={postId} postTitle={post.title} />
      </div>
      <h1 className="sr-only">編輯文章：{post.title}</h1>
      <PostForm
        post={post}
        categories={categories}
        availableTags={tags}
        allPosts={allPosts.map(({ id: refId, title }) => ({ id: refId, title }))}
        mode="edit"
        siteUrl={getSiteUrl()}
      />
    </div>
  )
}
