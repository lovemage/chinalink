import { getOrders } from '@/lib/queries/orders'
import OrdersTable from './OrdersTable'

interface PageProps {
  searchParams: Promise<{
    search?: string
    orderStatus?: string
    paymentStatus?: string
  }>
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ''
  // Default to 'paid' tab so abandoned/unpaid orders are hidden by default.
  // 'all' is the sentinel used by the "全部" tab to show every order.
  const orderStatus = params.orderStatus ?? 'paid'
  const paymentStatus = params.paymentStatus ?? ''

  const ordersList = await getOrders({
    search: search || undefined,
    orderStatus: orderStatus && orderStatus !== 'all' ? orderStatus : undefined,
    paymentStatus: paymentStatus || undefined,
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
      </div>

      <OrdersTable
        orders={ordersList}
        initialSearch={search}
        initialOrderStatus={orderStatus}
      />
    </div>
  )
}
