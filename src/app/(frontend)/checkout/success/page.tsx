'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  paymentMethod?: string
  items: OrderItem[]
}

function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString()}`
}

function paymentMethodLabel(method?: string) {
  switch (method) {
    case 'credit_card':
      return '信用卡'
    case 'atm':
      return 'ATM 轉帳'
    case 'cvs':
      return '超商代碼'
    default:
      return '-'
  }
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-gray-500">載入中...</div>
      </div>
    )
  }

  const items = order?.items ?? []

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 pt-32">
      <div className="rounded-2xl border border-brand-primary/10 bg-white p-8 text-center shadow-sm">
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-4 mb-2 font-serif text-3xl font-bold text-green-600">付款完成</h1>
        <p className="mb-8 text-brand-muted">感謝您的購買，我們將盡快為您處理。</p>

        {order && (
          <div className="mb-8 space-y-0 text-left">
            {/* Order info */}
            <div className="divide-y divide-brand-primary/8 rounded-xl border border-brand-primary/8 bg-brand-bg">
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-brand-muted">訂單編號</span>
                <span className="font-mono text-sm font-semibold tracking-wider">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-brand-muted">付款方式</span>
                <span className="text-sm font-medium">{paymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-brand-muted">付款狀態</span>
                <span
                  className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {order.paymentStatus === 'paid' ? '已付款' : '處理中'}
                </span>
              </div>
            </div>

            {/* Order items */}
            {items.length > 0 && (
              <div className="mt-4">
                <h2 className="mb-2 px-1 text-sm font-semibold text-brand-text">訂單明細</h2>
                <ul className="divide-y divide-brand-primary/8 rounded-xl border border-brand-primary/8">
                  {items.map((item) => {
                    const isProduct = item.itemType === 'product'
                    const name = isProduct
                      ? [item.productName, item.variantName].filter(Boolean).join(' — ')
                      : item.serviceName || '服務項目'

                    return (
                      <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/8">
                          {isProduct ? (
                            <Package className="h-3.5 w-3.5 text-brand-primary" />
                          ) : (
                            <Briefcase className="h-3.5 w-3.5 text-brand-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-text truncate">{name}</p>
                          <p className="text-xs text-brand-muted">x {item.quantity}</p>
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

            {/* Total */}
            <div className="mt-4 flex justify-between rounded-xl border border-brand-primary/8 bg-brand-bg px-4 py-3">
              <span className="text-lg font-bold">付款金額</span>
              <span className="font-serif text-lg font-bold text-brand-primary">
                {formatPrice(order.amount)}
              </span>
            </div>
          </div>
        )}

        {!order && !orderId && (
          <p className="mb-8 text-gray-500">付款已完成處理。</p>
        )}

        <Link
          href="/"
          className="inline-block rounded-2xl bg-brand-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-primary/90"
        >
          返回首頁
        </Link>
      </div>
    </section>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-lg text-gray-500">載入中...</div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
