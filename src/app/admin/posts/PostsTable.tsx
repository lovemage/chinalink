'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'

interface PostRow {
  id: number
  title: string
  slug: string
  categoryName: string | null
  author: string | null
  status: string
  publishedAt: Date | null
  createdAt: Date | null
}

interface PostsTableProps {
  posts: PostRow[]
  categories: { id: number; name: string }[]
  initialSearch: string
  initialCategoryId: string
  initialStatus: string
}

export default function PostsTable({
  posts,
  categories,
  initialSearch,
  initialCategoryId,
  initialStatus,
}: PostsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  function handleSearchChange(value: string) {
    setSearch(value)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    if (initialCategoryId) params.set('categoryId', initialCategoryId)
    if (initialStatus) params.set('status', initialStatus)
    router.push(`/admin/posts?${params.toString()}`)
  }

  const columns = [
    {
      key: 'title',
      label: '文章標題',
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-gray-900">{row.title as string}</span>
      ),
    },
    {
      key: 'categoryName',
      label: '分類',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-500">{(row.categoryName as string) ?? '—'}</span>
      ),
    },
    {
      key: 'author',
      label: '作者',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-500">{(row.author as string) ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      label: '狀態',
      render: (row: Record<string, unknown>) => <StatusBadge status={row.status as string} />,
    },
    {
      key: 'publishedAt',
      label: '發布時間',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-400 text-xs">
          {row.publishedAt
            ? new Date(row.publishedAt as string).toLocaleDateString('zh-TW')
            : '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '建立時間',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-400 text-xs">
          {row.createdAt
            ? new Date(row.createdAt as string).toLocaleDateString('zh-TW')
            : '—'}
        </span>
      ),
    },
  ]

  const filtered = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts

  return (
    <div className="space-y-3">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '全部', value: '' },
          { label: '草稿', value: 'draft' },
          { label: '已發布', value: 'published' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              const params = new URLSearchParams()
              if (search) params.set('search', search)
              if (initialCategoryId) params.set('categoryId', initialCategoryId)
              if (opt.value) params.set('status', opt.value)
              router.push(`/admin/posts?${params.toString()}`)
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              initialStatus === opt.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams()
              if (search) params.set('search', search)
              if (initialStatus) params.set('status', initialStatus)
              router.push(`/admin/posts?${params.toString()}`)
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              !initialCategoryId
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            所有分類
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                params.set('categoryId', String(cat.id))
                if (initialStatus) params.set('status', initialStatus)
                router.push(`/admin/posts?${params.toString()}`)
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                initialCategoryId === String(cat.id)
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="搜尋文章標題..."
        onRowClick={(row) =>
          router.push(`/admin/posts/${(row as unknown as PostRow).id}`)
        }
        emptyMessage="尚無文章，點擊右上角新增"
      />
    </div>
  )
}
