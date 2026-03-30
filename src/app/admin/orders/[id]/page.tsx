'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/admin/StatusBadge'
import {
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderNote,
} from '@/lib/actions/orders'
import { getOrder } from '@/lib/queries/orders'

type Order = NonNullable<Awaited<ReturnType<typeof getOrder>>>

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

const ITEM_TYPE_LABELS: Record<string, string> = {
  service: '服務',
  product: '產品',
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const [orderStatus, setOrderStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [note, setNote] = useState('')

  const [saving, setSaving] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const data = await getOrder(id)
      if (!data) {
        router.push('/admin/orders')
        return
      }
      setOrder(data)
      setOrderStatus(data.orderStatus)
      setPaymentStatus(data.paymentStatus)
      setNote(data.note ?? '')
      setLoading(false)
    }
    if (!isNaN(id)) load()
  }, [id, router])

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const [r1, r2] = await Promise.all([
      updateOrderStatus(id, orderStatus),
      updatePaymentStatus(id, paymentStatus),
    ])
    setSaving(false)
    if ('error' in r1) {
      setMessage(r1.error)
    } else if ('error' in r2) {
      setMessage(r2.error)
    } else {
      setMessage('狀態已更新')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  async function handleNoteSave(e: React.FormEvent) {
    e.preventDefault()
    setSavingNote(true)
    setMessage('')
    const result = await updateOrderNote(id, note)
    setSavingNote(false)
    if ('error' in result) {
      setMessage(result.error)
    } else {
      setMessage('備注已儲存')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-400 text-sm">載入中...</p>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回訂單管理
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        訂單詳情：{order.orderNumber}
      </h1>

      {message && (
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
            訂單資訊
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">訂單編號</dt>
              <dd className="font-mono font-medium text-gray-900">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">建立日期</dt>
              <dd className="text-gray-700">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString('zh-TW')
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">訂單金額</dt>
              <dd className="font-semibold text-gray-900">
                NT$ {order.amount.toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">付款方式</dt>
              <dd className="text-gray-700">{order.paymentMethod ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">ECPay 交易號</dt>
              <dd className="font-mono text-gray-700">{order.ecpayTradeNo ?? '—'}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">訂單狀態</dt>
              <dd>
                <StatusBadge
                  status={ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                />
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-500">付款狀態</dt>
              <dd>
                <StatusBadge
                  status={PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                />
              </dd>
            </div>
          </dl>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
            客戶資訊
          </h2>
          {order.customer ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">姓名</dt>
                <dd className="text-gray-900 font-medium">{order.customer.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-700">{order.customer.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">電話</dt>
                <dd className="text-gray-700">{order.customer.phone ?? '—'}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-400">無客戶資訊</p>
          )}
        </div>
      </div>

      {/* Order Items Table */}
      {order.items.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">訂單品項</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    類型
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    名稱
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    規格
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    單價
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    數量
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    小計
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-gray-500">
                      {ITEM_TYPE_LABELS[item.itemType] ?? item.itemType}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {item.serviceName ?? item.productName ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {item.variantName ?? item.variantSKU ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      NT$ {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      NT$ {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Addons */}
      {order.selectedAddons.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
            加購項目
          </h2>
          <ul className="space-y-2">
            {order.selectedAddons.map((addon) => (
              <li key={addon.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{addon.name}</span>
                <span className="text-gray-900 font-medium">
                  NT$ {addon.price.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Controls */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
          更新狀態
        </h2>
        <form onSubmit={handleStatusUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">訂單狀態</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
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
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '儲存中...' : '更新狀態'}
          </button>
        </form>
      </div>

      {/* Note */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
          備注
        </h2>
        <form onSubmit={handleNoteSave} className="space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="輸入備注..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={savingNote}
            className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
          >
            {savingNote ? '儲存中...' : '儲存備注'}
          </button>
        </form>
      </div>
    </div>
  )
}
