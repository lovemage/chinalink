'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'

interface OrderRow {
  id: number
  orderNumber: string
  customerName: string | null
  amount: number
  orderStatus: string
  paymentStatus: string
  createdAt: Date | null
}

interface OrdersTableProps {
  orders: OrderRow[]
  initialSearch: string
  initialOrderStatus: string
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待處理',
  paid: '已付款',
  completed: '已完成',
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  failed: '失敗',
  expired: '已過期',
}

const STATUS_TABS = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待處理' },
  { value: 'paid', label: '已付款' },
  { value: 'completed', label: '已完成' },
]

export default function OrdersTable({
  orders,
  initialSearch,
  initialOrderStatus,
}: OrdersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  function buildParams(overrides: Record<string, string>) {
    const base: Record<string, string> = {}
    if (search) base.search = search
    if (initialOrderStatus) base.orderStatus = initialOrderStatus
    return new URLSearchParams({ ...base, ...overrides })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    if (initialOrderStatus) params.set('orderStatus', initialOrderStatus)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const columns = [
    {
      key: 'orderNumber',
      label: '訂單編號',
      render: (row: Record<string, unknown>) => (
        <span className="font-mono font-medium text-gray-900">
          {row.orderNumber as string}
        </span>
      ),
    },
    {
      key: 'customerName',
      label: '客戶',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-700">{(row.customerName as string) ?? '—'}</span>
      ),
    },
    {
      key: 'amount',
      label: '金額',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-900">
          NT$ {((row.amount as number) ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'orderStatus',
      label: '訂單狀態',
      render: (row: Record<string, unknown>) => {
        const s = row.orderStatus as string
        return (
          <StatusBadge
            status={ORDER_STATUS_LABELS[s] ?? s}
            variant={
              s === 'completed' ? 'success' : s === 'paid' ? 'info' : 'warning'
            }
          />
        )
      },
    },
    {
      key: 'paymentStatus',
      label: '付款狀態',
      render: (row: Record<string, unknown>) => {
        const s = row.paymentStatus as string
        return <StatusBadge status={PAYMENT_STATUS_LABELS[s] ?? s} />
      },
    },
    {
      key: 'createdAt',
      label: '日期',
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
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          (o.customerName ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : orders

  return (
    <div className="space-y-3">
      {/* Order status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              const params = buildParams({ orderStatus: tab.value })
              if (!tab.value) params.delete('orderStatus')
              router.push(`/admin/orders?${params.toString()}`)
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              initialOrderStatus === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="搜尋訂單編號..."
        onRowClick={(row) =>
          router.push(`/admin/orders/${(row as unknown as OrderRow).id}`)
        }
        emptyMessage="尚無訂單資料"
      />
    </div>
  )
}
