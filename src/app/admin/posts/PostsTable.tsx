'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useToast } from '@/components/admin/AdminToast'
import { cancelSchedule, publishScheduledNow, reschedulePost } from '@/lib/actions/posts'
import { isPostSection, POST_SECTIONS, POST_STATUS_LABELS } from '@/lib/posts/constants'
import { formatDateline, formatTaipeiDateTime, toTaipeiInputValue } from '@/lib/posts/time'
import PostTagsManagerModal from './PostTagsManagerModal'

export interface PostListRow {
  id: number
  title: string
  section: string
  categoryName: string | null
  status: string
  publishedAt: Date | null
  scheduledAt: Date | null
  scheduleError: string | null
  createdAt: Date | null
  completion: number
  missing: number
}

interface PostsTableProps {
  posts: PostListRow[]
  categories: { id: number; name: string }[]
  tags: { id: number; name: string; slug: string }[]
  initialSearch: string
  initialCategoryId: string
  initialStatus: string
  initialSection: string
}

const statusTabs = [
  { label: '全部', value: '' },
  { label: '草稿', value: 'draft' },
  { label: '已排程', value: 'scheduled' },
  { label: '已發布', value: 'published' },
]

const selectClass = 'min-h-11 w-full border border-brand-rule bg-white px-2 text-base md:text-sm'
const smallButton = 'inline-flex min-h-10 items-center border border-brand-rule bg-white px-3 text-sm hover:bg-brand-tint disabled:opacity-50'

function ScheduleControls({ post }: { post: PostListRow }) {
  const { addToast } = useToast()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [when, setWhen] = useState(toTaipeiInputValue(post.scheduledAt))

  const run = (action: () => Promise<{ success: true } | { error: string }>, done: string) =>
    startTransition(async () => {
      const result = await action()
      if ('error' in result) addToast(result.error, 'error')
      else {
        addToast(done, 'success')
        setEditing(false)
        router.refresh()
      }
    })

  return (
    <div className="mt-3 border-t border-brand-rule pt-3">
      {editing ? (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="datetime-local"
            aria-label="新的排程時間（台灣時間）"
            value={when}
            onChange={(event) => setWhen(event.target.value)}
            className="min-h-10 min-w-0 flex-1 border border-brand-rule bg-white px-2 text-base md:text-sm"
          />
          <button type="button" className={smallButton} disabled={pending} onClick={() => run(() => reschedulePost(post.id, when), '已改期')}>
            確認改期
          </button>
          <button type="button" className={smallButton} disabled={pending} onClick={() => setEditing(false)}>
            返回
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={smallButton} disabled={pending} onClick={() => setEditing(true)}>
            改期
          </button>
          <button type="button" className={smallButton} disabled={pending} onClick={() => run(() => cancelSchedule(post.id), '已取消排程，文章改為草稿')}>
            取消排程
          </button>
          <button type="button" className={smallButton} disabled={pending} onClick={() => run(() => publishScheduledNow(post.id), '文章已發布')}>
            立即發布
          </button>
        </div>
      )}
    </div>
  )
}

export default function PostsTable({
  posts,
  categories,
  tags,
  initialSearch,
  initialCategoryId,
  initialStatus,
  initialSection,
}: PostsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  function navigate(overrides: Record<string, string>) {
    const merged = {
      search,
      categoryId: initialCategoryId,
      status: initialStatus,
      section: initialSection,
      ...overrides,
    }
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value)
    router.push(`/admin/posts?${params.toString()}`)
  }

  const failed = posts.filter((post) => post.scheduleError)

  return (
    <div className="space-y-4">
      {failed.length > 0 && (
        <p className="bg-brand-tint p-3 text-sm text-brand-alert" role="alert">
          有 {failed.length} 篇排程文章發布失敗，請打開文章修正後重新排程。
        </p>
      )}

      <nav aria-label="文章狀態" className="flex overflow-x-auto border-b border-brand-rule">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            aria-current={initialStatus === tab.value ? 'page' : undefined}
            onClick={() => navigate({ status: tab.value })}
            className={`min-h-11 shrink-0 px-4 text-sm ${initialStatus === tab.value ? 'bg-brand-tint font-bold' : 'text-brand-muted'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <form
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]"
        onSubmit={(event) => {
          event.preventDefault()
          navigate({ search })
        }}
      >
        <div className="flex border border-brand-rule bg-white">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜尋文章標題"
            aria-label="搜尋文章標題"
            className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm"
          />
          <button type="submit" aria-label="搜尋" className="flex w-11 items-center justify-center">
            <Search className="size-4" aria-hidden="true" />
          </button>
        </div>
        <select aria-label="欄目" className={selectClass} value={initialSection} onChange={(event) => navigate({ section: event.target.value })}>
          <option value="">全部欄目</option>
          <option value="opinion">{POST_SECTIONS.opinion.label}</option>
          <option value="observation">{POST_SECTIONS.observation.label}</option>
        </select>
        <select aria-label="分類" className={selectClass} value={initialCategoryId} onChange={(event) => navigate({ categoryId: event.target.value })}>
          <option value="">全部分類</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <PostTagsManagerModal tags={tags} />
      </form>

      {posts.length === 0 ? (
        <div className="border border-brand-rule bg-brand-raised px-4 py-12 text-center">
          <p className="text-sm text-brand-muted">
            {initialSearch || initialCategoryId || initialStatus || initialSection ? '沒有符合條件的文章' : '還沒有文章'}
          </p>
          <Link href="/admin/posts/new" className="mt-3 inline-block text-sm font-bold underline underline-offset-4">
            新增第一篇
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => {
            const when =
              post.status === 'scheduled'
                ? `排程 ${formatTaipeiDateTime(post.scheduledAt)}`
                : formatDateline(post.publishedAt ?? post.createdAt)
            return (
              <li key={post.id} className="border border-brand-rule bg-brand-raised p-4">
                <Link href={`/admin/posts/${post.id}`} className="block">
                  <span className="block font-medium leading-6 text-brand-text">{post.title}</span>
                  <span className="dateline mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-brand-muted">
                    <span className={`font-bold ${post.status === 'published' ? 'text-brand-primary' : 'text-brand-text'}`}>
                      {POST_STATUS_LABELS[post.status] ?? post.status}
                    </span>
                    <span>{isPostSection(post.section) ? POST_SECTIONS[post.section].label : post.section}</span>
                    <span>{post.categoryName ?? '未分類'}</span>
                    <span>{when}</span>
                    <span>完成度 {post.completion}%</span>
                    {post.missing > 0 && post.status !== 'published' && <span className="text-brand-alert">缺 {post.missing} 項必填</span>}
                  </span>
                  {post.scheduleError && <span className="mt-2 block text-sm text-brand-alert">發布失敗：{post.scheduleError}</span>}
                </Link>
                {post.status === 'scheduled' && <ScheduleControls post={post} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
