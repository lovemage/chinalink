'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import {
  updateOrderStatus,
  updatePaymentStatus,
} from '@/lib/actions/orders'

interface OrderRow {
  id: number
  orderNumber: string
  customerId: number | null
  customerName: string | null
  amount: number
  orderStatus: string
  paymentStatus: string
  paymentMethod: string | null
  note: string | null
  createdAt: Date | null
}

interface OrdersTableProps {
  orders: OrderRow[]
  initialSearch: string
  initialOrderStatus: string
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

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: '信用卡',
  atm: 'ATM',
  cvs: '超商代碼',
  barcode: '超商條碼',
}

const STATUS_TABS = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待處理' },
  { value: 'paid', label: '已付款' },
  { value: 'completed', label: '已完成' },
]

function orderStatusSelectClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400'
    case 'paid':
      return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400'
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400'
  }
}

function paymentStatusSelectClass(status: string): string {
  switch (status) {
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-400'
    case 'failed':
      return 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-400'
    case 'expired':
      return 'bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-400'
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-400'
  }
}

export default function OrdersTable({
  orders,
  initialSearch,
  initialOrderStatus,
}: OrdersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  // Count orders per customer so we can visually hint "this customer has multiple orders".
  const customerOrderCount = useMemo(() => {
    const counts = new Map<number, number>()
    for (const o of orders) {
      if (o.customerId == null) continue
      counts.set(o.customerId, (counts.get(o.customerId) ?? 0) + 1)
    }
    return counts
  }, [orders])

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

  function handleOrderStatusChange(orderId: number, nextStatus: string) {
    setSavingId(orderId)
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus)
      setSavingId(null)
      if ('error' in result) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  function handlePaymentStatusChange(orderId: number, nextStatus: string) {
    setSavingId(orderId)
    startTransition(async () => {
      const result = await updatePaymentStatus(orderId, nextStatus)
      setSavingId(null)
      if ('error' in result) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const columns = [
    {
      key: 'orderNumber',
      label: '訂單編號',
      render: (row: Record<string, unknown>) => {
        const order = row as unknown as OrderRow
        return (
          <Link
            href={`/admin/orders/${order.id}`}
            className="font-mono font-medium text-blue-600 hover:text-blue-800"
          >
            {order.orderNumber}
          </Link>
        )
      },
    },
    {
      key: 'customerName',
      label: '客戶',
      render: (row: Record<string, unknown>) => {
        const order = row as unknown as OrderRow
        const name = order.customerName ?? '—'
        const count = order.customerId != null
          ? customerOrderCount.get(order.customerId) ?? 0
          : 0
        return (
          <div className="flex items-center gap-2">
            {order.customerId != null ? (
              <Link
                href={`/admin/members/${order.customerId}`}
                className="text-gray-700 hover:text-blue-700 hover:underline"
              >
                {name}
              </Link>
            ) : (
              <span className="text-gray-500">{name}</span>
            )}
            {count > 1 && (
              <span
                title={`此會員共有 ${count} 筆訂單`}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {count} 筆
              </span>
            )}
          </div>
        )
      },
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
        const order = row as unknown as OrderRow
        const isSaving = savingId === order.id
        return (
          <select
            value={order.orderStatus}
            disabled={isSaving}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold outline-none transition-colors focus:ring-2 disabled:opacity-60 ${orderStatusSelectClass(order.orderStatus)}`}
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      },
    },
    {
      key: 'paymentStatus',
      label: '付款狀態',
      render: (row: Record<string, unknown>) => {
        const order = row as unknown as OrderRow
        const isSaving = savingId === order.id
        const method = order.paymentMethod
          ? PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod
          : null
        return (
          <div className="flex flex-col gap-1">
            <select
              value={order.paymentStatus}
              disabled={isSaving}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold outline-none transition-colors focus:ring-2 disabled:opacity-60 ${paymentStatusSelectClass(order.paymentStatus)}`}
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {method && (
              <span className="text-[11px] text-gray-400">{method}</span>
            )}
          </div>
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
        searchPlaceholder="搜尋訂單編號或客戶..."
        emptyMessage="尚無訂單資料"
      />
    </div>
  )
}
