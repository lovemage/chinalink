'use client'

import { useState } from 'react'
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

export default function OrderDetail({ order }: { order: Order }) {
  const [orderStatus, setOrderStatus] = useState(order.orderStatus)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [note, setNote] = useState(order.note ?? '')

  const [saving, setSaving] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [message, setMessage] = useState('')

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const [r1, r2] = await Promise.all([
      updateOrderStatus(order.id, orderStatus),
      updatePaymentStatus(order.id, paymentStatus),
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
    const result = await updateOrderNote(order.id, note)
    setSavingNote(false)
    if ('error' in result) {
      setMessage(result.error)
    } else {
      setMessage('備註已儲存')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="text-sm text-brand-muted hover:text-brand-muted transition-colors"
        >
          ← 返回訂單管理
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-brand-text">
        訂單詳情：{order.orderNumber}
      </h1>

      {message && (
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm ">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Info Card */}
        <div className="bg-white p-5 space-y-3">
          <h2 className="text-base font-semibold text-brand-text border-b border-brand-rule pb-2">
            訂單資訊
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-muted">訂單編號</dt>
              <dd className="font-mono font-medium text-brand-text">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">建立日期</dt>
              <dd className="text-brand-muted">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString('zh-TW')
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">訂單金額</dt>
              <dd className="font-semibold text-brand-text">
                NT$ {order.amount.toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">付款方式</dt>
              <dd className="text-brand-muted">{order.paymentMethod ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">ECPay 交易號</dt>
              <dd className="font-mono text-brand-muted">{order.ecpayTradeNo ?? '—'}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-brand-muted">訂單狀態</dt>
              <dd>
                <StatusBadge
                  status={ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                />
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-brand-muted">付款狀態</dt>
              <dd>
                <StatusBadge
                  status={PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                />
              </dd>
            </div>
          </dl>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white p-5 space-y-3">
          <h2 className="text-base font-semibold text-brand-text border-b border-brand-rule pb-2">
            客戶資訊
          </h2>
          {order.customer ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-muted">姓名</dt>
                <dd className="text-brand-text font-medium">{order.customer.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-muted">Email</dt>
                <dd className="text-brand-muted">{order.customer.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-muted">電話</dt>
                <dd className="text-brand-muted">{order.customer.phone ?? '—'}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-brand-muted">無客戶資訊</p>
          )}
        </div>
      </div>

      {/* Order Items Table */}
      {order.items.length > 0 && (
        <div className="bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-rule">
            <h2 className="text-base font-semibold text-brand-text">訂單品項</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-bg border-b border-brand-rule">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    類型
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    名稱
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    規格
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    單價
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    數量
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    小計
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-brand-muted">
                      {ITEM_TYPE_LABELS[item.itemType] ?? item.itemType}
                    </td>
                    <td className="px-4 py-3 text-brand-text font-medium">
                      {item.serviceName ?? item.productName ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {item.variantName ?? item.variantSKU ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-brand-muted">
                      NT$ {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-brand-muted">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-text">
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
        <div className="bg-white p-5 space-y-3">
          <h2 className="text-base font-semibold text-brand-text border-b border-brand-rule pb-2">
            加購項目
          </h2>
          <ul className="space-y-2">
            {order.selectedAddons.map((addon) => (
              <li key={addon.id} className="flex justify-between text-sm">
                <span className="text-brand-muted">{addon.name}</span>
                <span className="text-brand-text font-medium">
                  NT$ {addon.price.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Controls */}
      <div className="bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-brand-text border-b border-brand-rule pb-2">
          更新狀態
        </h2>
        <form onSubmit={handleStatusUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-muted">訂單狀態</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-muted">付款狀態</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
            className="px-4 py-2 bg-brand-primary text-white text-sm font-medium hover:bg-brand-deep disabled:opacity-50 transition-colors"
          >
            {saving ? '儲存中...' : '更新狀態'}
          </button>
        </form>
      </div>

      {/* Note */}
      <div className="bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-brand-text border-b border-brand-rule pb-2">
          備註
        </h2>
        <form onSubmit={handleNoteSave} className="space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="輸入備註..."
            className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          />
          <button
            type="submit"
            disabled={savingNote}
            className="px-4 py-2 bg-brand-deep text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
          >
            {savingNote ? '儲存中...' : '儲存備註'}
          </button>
        </form>
      </div>
    </div>
  )
}
