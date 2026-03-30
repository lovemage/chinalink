'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'

interface ProductRow {
  id: number
  title: string
  slug: string
  categoryName: string | null
  status: string
  visibility: string
  coverImageUrl: string | null
  createdAt: Date | null
}

interface ProductsTableProps {
  products: ProductRow[]
  categories: { id: number; name: string }[]
  initialSearch: string
  initialCategoryId: string
  initialStatus: string
}

export default function ProductsTable({
  products,
  categories,
  initialSearch,
  initialCategoryId,
  initialStatus,
}: ProductsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  function handleSearchChange(value: string) {
    setSearch(value)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    if (initialCategoryId) params.set('categoryId', initialCategoryId)
    if (initialStatus) params.set('status', initialStatus)
    router.push(`/admin/products?${params.toString()}`)
  }

  const columns = [
    {
      key: 'title',
      label: '產品名稱',
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
      key: 'status',
      label: '狀態',
      render: (row: Record<string, unknown>) => <StatusBadge status={row.status as string} />,
    },
    {
      key: 'visibility',
      label: '可見性',
      render: (row: Record<string, unknown>) => {
        const v = row.visibility as string
        const label = v === 'public' ? '公開' : v === 'private' ? '私密' : '不公開'
        return <span className="text-gray-500 text-xs">{label}</span>
      },
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

  // Filter locally for immediate feedback while router transition is pending
  const filtered = search
    ? products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : products

  return (
    <div className="space-y-3">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['', 'published', 'draft'] as const).map((s) => {
          const label = s === '' ? '全部' : s === 'published' ? '已發布' : '草稿'
          return (
            <button
              key={s}
              onClick={() => {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                if (initialCategoryId) params.set('categoryId', initialCategoryId)
                if (s) params.set('status', s)
                router.push(`/admin/products?${params.toString()}`)
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                initialStatus === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams()
              if (search) params.set('search', search)
              if (initialStatus) params.set('status', initialStatus)
              router.push(`/admin/products?${params.toString()}`)
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              !initialCategoryId
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            全部分類
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                params.set('categoryId', String(cat.id))
                if (initialStatus) params.set('status', initialStatus)
                router.push(`/admin/products?${params.toString()}`)
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
        searchPlaceholder="搜尋產品名稱..."
        onRowClick={(row) =>
          router.push(`/admin/products/${(row as unknown as ProductRow).id}`)
        }
        emptyMessage="尚無產品，點擊右上角新增"
      />
    </div>
  )
}
