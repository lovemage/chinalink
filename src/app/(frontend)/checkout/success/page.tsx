'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface OrderData {
  id: string
  orderNumber: string
  amount: number
  paymentStatus: string
  paymentMethod?: string
  service: {
    title: string
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

  const paymentMethodLabel = (method?: string) => {
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-gray-500">載入中...</div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl">&#10003;</div>
        <h1 className="mb-2 text-3xl font-bold text-green-600">付款完成</h1>
        <p className="mb-8 text-gray-600">感謝您的購買，我們將盡快為您安排服務。</p>

        {order && (
          <div className="mb-8 space-y-3 text-left">
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
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">付款方式</span>
              <span className="font-medium">{paymentMethodLabel(order.paymentMethod)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">付款狀態</span>
              <span
                className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}
              >
                {order.paymentStatus === 'paid' ? '已付款' : '處理中'}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-lg font-bold">付款金額</span>
              <span className="text-lg font-bold text-brand-primary">
                NT$ {order.amount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {!order && !orderId && (
          <p className="mb-8 text-gray-500">付款已完成處理。</p>
        )}

        <Link
          href="/"
          className="inline-block rounded-lg bg-brand-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-primary/90"
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
