'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'

interface ServiceRow {
  id: number
  title: string
  slug: string
  categoryName: string | null
  status: string
  pricingMode: string
  price: number | null
  basePrice: number | null
  createdAt: Date | null
}

interface ServicesTableProps {
  services: ServiceRow[]
  categories: { id: number; name: string }[]
  initialSearch: string
  initialCategoryId: string
  initialStatus: string
}

function formatPrice(row: ServiceRow): string {
  if (row.pricingMode === 'custom') return '洽談訂製'
  if (row.pricingMode === 'addons') {
    return row.basePrice != null ? `NT$ ${row.basePrice.toLocaleString()} 起` : '加購組合'
  }
  return row.price != null ? `NT$ ${row.price.toLocaleString()}` : '—'
}

export default function ServicesTable({
  services,
  categories,
  initialSearch,
  initialCategoryId,
  initialStatus,
}: ServicesTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  function handleSearchChange(value: string) {
    setSearch(value)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    if (initialCategoryId) params.set('categoryId', initialCategoryId)
    if (initialStatus) params.set('status', initialStatus)
    router.push(`/admin/services?${params.toString()}`)
  }

  const columns = [
    {
      key: 'title',
      label: '服務名稱',
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
      key: 'price',
      label: '價格',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-600">{formatPrice(row as unknown as ServiceRow)}</span>
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

  // Filter locally for search (server already filtered, but also filter client-side for
  // immediate feedback while the router transition is pending)
  const filtered = search
    ? services.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    : services

  return (
    <div className="space-y-3">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams()
              if (search) params.set('search', search)
              if (initialStatus) params.set('status', initialStatus)
              router.push(`/admin/services?${params.toString()}`)
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              !initialCategoryId
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                params.set('categoryId', String(cat.id))
                if (initialStatus) params.set('status', initialStatus)
                router.push(`/admin/services?${params.toString()}`)
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                initialCategoryId === String(cat.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
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
        searchPlaceholder="搜尋服務名稱..."
        onRowClick={(row) =>
          router.push(`/admin/services/${(row as unknown as ServiceRow).id}`)
        }
        emptyMessage="尚無服務，點擊右上角新增"
      />
    </div>
  )
}
