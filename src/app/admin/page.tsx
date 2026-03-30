import Link from 'next/link'
import { ShoppingCart, CalendarDays, Users, Package } from 'lucide-react'
import { getDashboardStats } from '@/lib/queries/dashboard'

function formatAmount(amount: number) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待處理',
  processing: '處理中',
  completed: '已完成',
  cancelled: '已取消',
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default async function AdminDashboard() {
  const { totalOrders, monthOrders, totalMembers, totalItems, recentOrders } =
    await getDashboardStats()

  const stats = [
    {
      label: '總訂單數',
      value: totalOrders,
      icon: ShoppingCart,
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '本月訂單',
      value: monthOrders,
      icon: CalendarDays,
      accent: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: '總會員數',
      value: totalMembers,
      icon: Users,
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: '服務/商品',
      value: totalItems,
      icon: Package,
      accent: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="mt-1 text-sm text-gray-500">歡迎回到 ChinaLink 後台管理系統</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, accent, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${accent}`} />
            </div>
            <div>
              <p className={`text-3xl font-bold ${accent}`}>{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">最新訂單</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">尚無訂單資料</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">訂單編號</th>
                  <th className="px-6 py-3 text-left font-medium">金額</th>
                  <th className="px-6 py-3 text-left font-medium">狀態</th>
                  <th className="px-6 py-3 text-left font-medium">日期</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatAmount(order.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ORDER_STATUS_COLORS[order.orderStatus] ??
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
