'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Package, Briefcase } from 'lucide-react'

interface OrderItem {
  id: number
  itemType: 'service' | 'product'
  serviceName?: string | null
  productName?: string | null
  variantName?: string | null
  unitPrice: number
  quantity: number
  subtotal: number
}

interface OrderData {
  id: number
  orderNumber: string
  amount: number
  paymentStatus: string
  itemType: string
  items: OrderItem[]
  selectedAddons?: { name: string; price: number }[]
  customer?: { name: string; email: string } | null
}

function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString()}`
}

export default function CheckoutPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) throw new Error('無法取得訂單資料')
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '發生錯誤')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  async function handlePayment() {
    if (!order) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      })

      const data = await res.json()
      if (data.formHtml) {
        // Inject ECPay auto-submit form
        const container = document.getElementById('ecpay-container')
        if (container) {
          container.innerHTML = data.formHtml
        }
      } else {
        setError(data.error || '付款請求失敗')
        setSubmitting(false)
      }
    } catch {
      setError('付款請求失敗，請稍後再試')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-gray-500">載入中...</div>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500">{error}</p>
          <Link href="/" className="mt-4 inline-block text-brand-primary hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  if (order.paymentStatus === 'paid') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-green-600">此訂單已完成付款</h1>
          <p className="text-gray-600">訂單編號：{order.orderNumber}</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary/90">
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  const items = order.items ?? []
  const addons = order.selectedAddons ?? []

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 pt-32">
      <h1 className="mb-2 text-center font-serif text-3xl font-bold text-brand-text">確認訂單</h1>
      <p className="mb-8 text-center text-sm text-brand-muted">請確認以下訂單內容後前往付款</p>

      <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm">
        {/* Order number */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-brand-bg px-4 py-3">
          <span className="text-sm text-brand-muted">訂單編號</span>
          <span className="font-mono text-sm font-semibold tracking-wider text-brand-text">{order.orderNumber}</span>
        </div>

        {/* Order items */}
        {items.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">訂單明細</h2>
            <ul className="divide-y divide-brand-primary/8">
              {items.map((item) => {
                const isProduct = item.itemType === 'product'
                const name = isProduct
                  ? [item.productName, item.variantName].filter(Boolean).join(' — ')
                  : item.serviceName || '服務項目'

                return (
                  <li key={item.id} className="flex items-start gap-3 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/8">
                      {isProduct ? (
                        <Package className="h-4 w-4 text-brand-primary" />
                      ) : (
                        <Briefcase className="h-4 w-4 text-brand-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-text">{name}</p>
                      <p className="text-xs text-brand-muted">
                        {formatPrice(item.unitPrice)} x {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-brand-text">
                      {formatPrice(item.subtotal)}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Selected addons */}
        {addons.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">加購項目</h2>
            <ul className="space-y-2">
              {addons.map((addon, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{addon.name}</span>
                  <span className="font-medium text-brand-text">{formatPrice(addon.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Total */}
        <div className="flex items-baseline justify-between border-t border-brand-primary/10 pt-4">
          <span className="text-lg font-bold text-brand-text">應付金額</span>
          <span className="font-serif text-2xl font-bold text-brand-primary">
            {formatPrice(order.amount)}
          </span>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        {/* Pay button */}
        <button
          onClick={handlePayment}
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-brand-cta px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-cta/20 transition-all hover:bg-brand-cta/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? '正在跳轉至綠界付款...' : '前往付款'}
        </button>

        <p className="mt-3 text-center text-xs text-brand-muted">
          點擊後將跳轉至綠界金流進行安全付款
        </p>
      </div>

      {/* ECPay form will be injected here */}
      <div id="ecpay-container" />
    </section>
  )
}
