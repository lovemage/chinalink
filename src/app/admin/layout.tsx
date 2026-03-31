import type { Metadata } from 'next'
import { getAdminFromCookies } from '@/lib/auth-admin'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTabBar from '@/components/admin/AdminTabBar'
import AdminHeader from '@/components/admin/AdminHeader'
import '../(frontend)/styles.css'

export const metadata: Metadata = {
  title: 'ChinaLink 後台管理',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminFromCookies()

  // No valid session — render bare (login page)
  if (!admin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Mobile header */}
      <AdminHeader username={admin.username} />

      {/* Main content */}
      <main className="md:ml-60 pb-20 md:pb-0 pt-14 md:pt-0 min-h-screen bg-gray-50">
        {children}
      </main>

      {/* Mobile tab bar */}
      <AdminTabBar />
    </div>
  )
}
