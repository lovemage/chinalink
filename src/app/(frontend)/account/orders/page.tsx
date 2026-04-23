import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Briefcase, Package, Receipt } from 'lucide-react'
import { auth } from '@/lib/auth/auth'
import { getCustomerOrders } from '@/lib/queries/orders'

export const metadata = {
  title: '付款紀錄 - 懂陸姐',
  description: '查看您的訂單與付款紀錄',
}

export const dynamic = 'force-dynamic'

function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString()}`
}

function formatDate(date: Date | string | null): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function paymentMethodLabel(method?: string | null): string {
  switch (method) {
    case 'credit_card':
      return '信用卡'
    case 'atm':
      return 'ATM 轉帳'
    case 'cvs':
      return '超商代碼'
    case 'barcode':
      return '超商條碼'
    default:
      return '尚未付款'
  }
}

function paymentStatusLabel(status: string): { label: string; className: string } {
  switch (status) {
    case 'paid':
      return { label: '已付款', className: 'bg-emerald-50 text-emerald-700' }
    case 'failed':
      return { label: '付款失敗', className: 'bg-rose-50 text-rose-700' }
    case 'refunded':
      return { label: '已退款', className: 'bg-gray-100 text-gray-700' }
    default:
      return { label: '待付款', className: 'bg-amber-50 text-amber-700' }
  }
}

export default async function AccountOrdersPage() {
  const session = await auth()
  const customerId = (session as { customerId?: number } | null)?.customerId

  if (!session?.user || !customerId) {
    redirect('/login?callbackUrl=/account/orders')
  }

  const ordersList = await getCustomerOrders(customerId)

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10">
          <Receipt className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-text">付款紀錄</h1>
          <p className="text-sm text-brand-muted">查看您的所有訂單與付款狀態</p>
        </div>
      </div>

      {ordersList.length === 0 ? (
        <div className="rounded-2xl border border-brand-primary/10 bg-white p-12 text-center shadow-sm">
          <p className="text-brand-muted">目前尚無訂單紀錄</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90"
          >
            前往商品專區
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {ordersList.map((order) => {
            const items = order.items ?? []
            const addons = order.selectedAddons ?? []
            const status = paymentStatusLabel(order.paymentStatus)

            return (
              <li
                key={order.id}
                className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-primary/8 pb-4">
                  <div>
                    <p className="text-xs text-brand-muted">訂單編號</p>
                    <p className="font-mono text-sm font-semibold tracking-wider text-brand-text">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-brand-muted">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {paymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>

                {items.length > 0 && (
                  <ul className="mt-4 divide-y divide-brand-primary/8">
                    {items.map((item) => {
                      const isProduct = item.itemType === 'product'
                      const name = isProduct
                        ? [item.productName, item.variantName].filter(Boolean).join(' — ')
                        : item.serviceName || '服務項目'

                      return (
                        <li key={item.id} className="flex items-center gap-3 py-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/8">
                            {isProduct ? (
                              <Package className="h-4 w-4 text-brand-primary" />
                            ) : (
                              <Briefcase className="h-4 w-4 text-brand-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-brand-text">{name}</p>
                            <p className="text-xs text-brand-muted">
                              {formatPrice(item.unitPrice)} × {item.quantity}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm font-semibold text-brand-text">
                            {formatPrice(item.subtotal)}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {addons.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {addons.map((addon) => (
                      <li key={addon.id} className="flex justify-between text-xs text-brand-muted">
                        <span>加購 · {addon.name}</span>
                        <span>{formatPrice(addon.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-primary/8 pt-4">
                  <div>
                    <p className="text-xs text-brand-muted">訂單金額</p>
                    <p className="font-serif text-lg font-bold text-brand-primary">
                      {formatPrice(order.amount)}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
