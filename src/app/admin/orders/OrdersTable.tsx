'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import {
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderNote,
} from '@/lib/actions/orders'

interface OrderRow {
  id: number
  orderNumber: string
  customerName: string | null
  amount: number
  orderStatus: string
  paymentStatus: string
  note: string | null
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

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: '待處理' },
  { value: 'paid', label: '已付款' },
  { value: 'completed', label: '已完成' },
]

const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: '待付款' },
  { value: 'paid', label: '已付款' },
  { value: 'failed', label: '失敗' },
  { value: 'expired', label: '已過期' },
]

const STATUS_TABS = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待處理' },
  { value: 'paid', label: '已付款' },
  { value: 'completed', label: '已完成' },
]

interface EditingOrder {
  id: number
  orderNumber: string
  orderStatus: string
  paymentStatus: string
  note: string
}

export default function OrdersTable({
  orders,
  initialSearch,
  initialOrderStatus,
}: OrdersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [editing, setEditing] = useState<EditingOrder | null>(null)
  const [isPending, startTransition] = useTransition()

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

  function openEditor(order: OrderRow, e: React.MouseEvent) {
    e.stopPropagation()
    setEditing({
      id: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      note: order.note ?? '',
    })
  }

  function handleSave() {
    if (!editing) return
    startTransition(async () => {
      const [r1, r2, r3] = await Promise.all([
        updateOrderStatus(editing.id, editing.orderStatus),
        updatePaymentStatus(editing.id, editing.paymentStatus),
        updateOrderNote(editing.id, editing.note),
      ])
      if ('error' in r1 || 'error' in r2 || 'error' in r3) {
        const err =
          ('error' in r1 ? r1.error : '') ||
          ('error' in r2 ? r2.error : '') ||
          ('error' in r3 ? r3.error : '')
        alert(err)
      } else {
        setEditing(null)
        router.refresh()
      }
    })
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
          <button
            type="button"
            onClick={(e) => openEditor(row as unknown as OrderRow, e)}
            title="點擊編輯狀態"
          >
            <StatusBadge
              status={ORDER_STATUS_LABELS[s] ?? s}
              variant={
                s === 'completed' ? 'success' : s === 'paid' ? 'info' : 'warning'
              }
            />
          </button>
        )
      },
    },
    {
      key: 'paymentStatus',
      label: '付款狀態',
      render: (row: Record<string, unknown>) => {
        const s = row.paymentStatus as string
        return (
          <button
            type="button"
            onClick={(e) => openEditor(row as unknown as OrderRow, e)}
            title="點擊編輯狀態"
          >
            <StatusBadge status={PAYMENT_STATUS_LABELS[s] ?? s} />
          </button>
        )
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

      {/* Status Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                編輯訂單 {editing.orderNumber}
              </h2>
              <button
                type="button"
                onClick={() => !isPending && setEditing(null)}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">訂單狀態</label>
                <select
                  value={editing.orderStatus}
                  onChange={(e) =>
                    setEditing({ ...editing, orderStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">付款狀態</label>
                <select
                  value={editing.paymentStatus}
                  onChange={(e) =>
                    setEditing({ ...editing, paymentStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">備註</label>
                <textarea
                  value={editing.note}
                  onChange={(e) =>
                    setEditing({ ...editing, note: e.target.value })
                  }
                  rows={3}
                  placeholder="輸入備註..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? '儲存中...' : '儲存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
