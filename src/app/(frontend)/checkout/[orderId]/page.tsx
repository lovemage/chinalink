'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface OrderData {
  id: string
  orderNumber: string
  amount: number
  paymentStatus: string
  service: {
    title: string
  }
  selectedAddons?: { name: string; price: number }[]
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

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: typeof order.service === 'string' ? order.service : order.service,
          customerId: '',
          selectedAddons: order.selectedAddons || [],
        }),
      })

      const data = await res.json()
      if (data.formHtml) {
        // Inject form HTML and auto-submit to ECPay
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

  if (error) {
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
          <h1 className="mb-4 text-2xl font-bold text-green-600">此訂單已完成付款</h1>
          <p className="text-gray-600">訂單編號：{order.orderNumber}</p>
          <Link href="/" className="mt-4 inline-block text-brand-primary hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-brand-text">確認訂單</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">訂單編號</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">服務項目</span>
            <span className="font-medium">
              {typeof order.service === 'object' ? order.service.title : '服務項目'}
            </span>
          </div>
          {order.selectedAddons && order.selectedAddons.length > 0 && (
            <div className="border-b pb-2">
              <span className="text-gray-600">加購項目</span>
              <ul className="mt-1 space-y-1">
                {order.selectedAddons.map((addon, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span>NT$ {addon.price.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-between pt-2">
            <span className="text-lg font-bold text-brand-text">應付金額</span>
            <span className="text-lg font-bold text-brand-primary">
              NT$ {order.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={submitting}
          className="w-full rounded-lg bg-brand-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? '處理中...' : '前往付款'}
        </button>
      </div>

      {/* ECPay form will be injected here */}
      <div id="ecpay-container" />
    </section>
  )
}
