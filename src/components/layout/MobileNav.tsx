'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { primaryNav, secondaryNav } from './Navbar'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button type="button" aria-label="開啟選單" className="flex size-11 items-center justify-center text-brand-text" />
        }
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[86vw] max-w-sm gap-0 overflow-y-auto bg-brand-bg">
        <SheetHeader className="border-b border-brand-rule">
          <SheetTitle className="text-left font-serif text-xl font-bold text-brand-text">懂陸姐</SheetTitle>
        </SheetHeader>
        <nav aria-label="主要欄目" className="flex flex-col p-2">
          {primaryNav.map((item) => {
            const current = pathname === item.href || (item.href !== '/blog' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={current ? 'page' : undefined}
                className={`px-4 py-3.5 font-serif text-lg font-medium ${current ? 'bg-brand-tint font-bold' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <nav aria-label="其他頁面" className="flex flex-col border-t border-brand-rule p-2 text-[15px] text-brand-muted">
          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={close} className="px-4 py-3">
              {item.label}
            </Link>
          ))}
          <Link href="/service-cart" onClick={close} className="px-4 py-3">
            購物車
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/account/orders" onClick={close} className="px-4 py-3">
                付款紀錄
              </Link>
              <button
                type="button"
                onClick={() => {
                  close()
                  signOut({ callbackUrl: '/' })
                }}
                className="px-4 py-3 text-left"
              >
                登出（{session?.user?.name || session?.user?.email}）
              </button>
            </>
          ) : (
            <Link href="/login" onClick={close} className="px-4 py-3">
              會員登入
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
