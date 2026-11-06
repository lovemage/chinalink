import Link from 'next/link'
import { getBlogCategories } from '@/lib/queries/categories'
import { getPublishedPostRefs } from '@/lib/queries/posts'
import { getPostTagsAll } from '@/lib/queries/post-tags'
import { getSiteUrl } from '@/lib/posts/constants'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const [categories, tags, allPosts] = await Promise.all([
    getBlogCategories(),
    getPostTagsAll(),
    getPublishedPostRefs(),
  ])

  return (
    <div className="space-y-3 p-3 md:p-6">
      <Link href="/admin/posts" className="inline-flex min-h-9 items-center text-sm text-brand-muted hover:text-brand-text">
        ← 文章管理
      </Link>
      <h1 className="sr-only">新增文章</h1>
      <PostForm
        categories={categories}
        availableTags={tags}
        allPosts={allPosts.map(({ id, title }) => ({ id, title }))}
        mode="create"
        siteUrl={getSiteUrl()}
      />
    </div>
  )
}
