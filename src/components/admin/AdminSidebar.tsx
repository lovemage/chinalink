'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Package,
  FileText,
  ShoppingCart,
  Users,
  FolderOpen,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { logoutAction } from '@/app/admin/actions'

const navItems = [
  { label: '儀表板', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: '服務管理', href: '/admin/services', icon: Briefcase, exact: false },
  { label: '商品管理', href: '/admin/products', icon: Package, exact: false },
  { label: '文章管理', href: '/admin/posts', icon: FileText, exact: false },
  { label: '訂單管理', href: '/admin/orders', icon: ShoppingCart, exact: false },
  { label: '會員管理', href: '/admin/members', icon: Users, exact: false },
  { label: '分類管理', href: '/admin/categories', icon: FolderOpen, exact: false },
  { label: '站台設定', href: '/admin/settings', icon: Settings, exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-60 bg-[#1C1917] text-white">
      {/* Logo / Title */}
      <div className="flex flex-col justify-center h-14 px-5 border-b border-white/10">
        <span className="text-base font-bold tracking-wide text-white">ChinaLink</span>
        <span className="text-[10px] text-white/40">後台管理</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#F4845F]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-5 h-5 shrink-0" />
          前往網站
        </a>
      </div>

      <div className="p-3 border-t border-white/10">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            登出
          </button>
        </form>
      </div>
    </aside>
  )
}
