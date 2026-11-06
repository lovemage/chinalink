'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Briefcase,
  Package,
  ShoppingCart,
  MoreHorizontal,
  MessageCircleQuestion,
  PenLine,
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { logoutAction } from '@/app/admin/actions'

const primaryTabs = [
  { label: '文章', href: '/admin/posts', icon: FileText },
  { label: '發文', href: '/admin/posts/new', icon: PenLine },
  { label: '訂單', href: '/admin/orders', icon: ShoppingCart },
]

const moreMenuItems = [
  { label: '儀表板', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: '問題與交流', href: '/admin/questions', icon: MessageCircleQuestion, exact: false },
  { label: '服務', href: '/admin/services', icon: Briefcase, exact: false },
  { label: '商品', href: '/admin/products', icon: Package, exact: false },
  { label: '會員', href: '/admin/members', icon: Users, exact: false },
  { label: '分類', href: '/admin/categories', icon: FolderOpen, exact: false },
  { label: '設定', href: '/admin/settings', icon: Settings, exact: false },
]

export default function AdminTabBar() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  // The post editor has its own bottom action bar.
  if (/^\/admin\/posts\/(new|\d+)/.test(pathname)) return null

  return (
    <>
      {/* Backdrop */}
      {showMore && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* Slide-up more overlay */}
      {showMore && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-brand-rule z-50">
          <div className="py-2">
            {moreMenuItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-tint font-bold text-brand-text'
                      : 'text-brand-muted hover:bg-brand-bg'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              )
            })}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMore(false)}
              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-brand-muted hover:bg-brand-bg transition-colors"
            >
              <ExternalLink className="w-5 h-5 shrink-0" />
              前往網站
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-brand-alert hover:bg-brand-tint transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                登出
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <nav aria-label="後台主選單" className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-raised border-t border-brand-rule z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {primaryTabs.map((tab) => {
            const isActive =
              tab.href === '/admin/posts' ? pathname === tab.href : pathname.startsWith(tab.href)
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors ${
                  isActive ? 'bg-brand-tint font-bold text-brand-text' : 'text-brand-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors ${
              showMore ? 'bg-brand-tint font-bold text-brand-text' : 'text-brand-muted'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            更多
          </button>
        </div>
      </nav>
    </>
  )
}
