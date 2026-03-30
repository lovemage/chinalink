import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMember } from '@/lib/queries/members'
import StatusBadge from '@/components/admin/StatusBadge'

interface PageProps {
  params: Promise<{ id: string }>
}

const AUTH_PROVIDER_LABELS: Record<string, string> = {
  email: 'Email',
  google: 'Google',
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待處理',
  paid: '已付款',
  completed: '已完成',
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params
  const memberId = parseInt(id)

  if (isNaN(memberId)) notFound()

  const member = await getMember(memberId)
  if (!member) notFound()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/members"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回會員管理
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>

      {/* Member Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
          會員資訊
        </h2>

        <div className="flex items-start gap-4">
          {member.avatar && (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
          )}

          <dl className="flex-1 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">姓名</dt>
              <dd className="font-medium text-gray-900">{member.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-700">{member.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">電話</dt>
              <dd className="text-gray-700">{member.phone ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">登入方式</dt>
              <dd className="text-gray-700">
                {AUTH_PROVIDER_LABELS[member.authProvider] ?? member.authProvider}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Provider ID</dt>
              <dd className="font-mono text-xs text-gray-500">{member.providerId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">最後登入</dt>
              <dd className="text-gray-700">
                {member.lastLoginAt
                  ? new Date(member.lastLoginAt).toLocaleString('zh-TW')
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">註冊日期</dt>
              <dd className="text-gray-700">
                {member.createdAt
                  ? new Date(member.createdAt).toLocaleString('zh-TW')
                  : '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            訂單紀錄
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({member.orders.length})
            </span>
          </h2>
        </div>

        {member.orders.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            尚無訂單紀錄
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody>
                {member.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      NT$ {order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                        variant={
                          order.orderStatus === 'completed'
                            ? 'success'
                            : order.orderStatus === 'paid'
                            ? 'info'
                            : 'warning'
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('zh-TW')
                        : '—'}
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
