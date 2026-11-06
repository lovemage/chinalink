'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, Receipt, ShoppingCart } from 'lucide-react'
import { MobileNav } from './MobileNav'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

export const primaryNav = [
  { label: '陸姐觀點', href: '/blog' },
  { label: '供應鏈觀察', href: '/observations' },
  { label: '問題與交流', href: '/questions' },
  { label: '顧問服務', href: '/services' },
]

export const secondaryNav = [
  { label: '供應鏈推薦', href: '/supply-chain' },
  { label: '商品專區', href: '/products' },
  { label: '關於懂陸姐', href: '/about' },
  { label: '聯絡我們', href: '/contact' },
]

function isCurrent(pathname: string, href: string) {
  // An article can belong to either column, so /blog/[slug] highlights neither.
  if (href === '/blog') return pathname === '/blog'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user

  return (
    <header className="sticky top-0 z-40 border-b border-brand-rule bg-brand-bg">
      <div className="hidden border-b border-brand-rule lg:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-end gap-6 px-6 text-[13px] text-brand-muted">
          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-text" aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
          <Link href="/service-cart" className="inline-flex items-center gap-1.5 hover:text-brand-text">
            <ShoppingCart className="size-3.5" aria-hidden="true" />
            購物車
          </Link>
          {isLoggedIn && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button type="button" className="hover:text-brand-text">
                    {session.user.name || session.user.email}
                  </button>
                }
              />
              <DropdownMenuContent align="end" sideOffset={8} className="w-48 p-1">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{session.user.name || session.user.email}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/account/orders" className="cursor-pointer" />}>
                  <Receipt className="mr-2 size-4" aria-hidden="true" />
                  付款紀錄
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer">
                  <LogOut className="mr-2 size-4" aria-hidden="true" />
                  登出帳號
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hover:text-brand-text">
              會員登入
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[76px]">
        <Link href="/" className="flex items-center gap-3" aria-label="懂陸姐 ChinaLink 首頁">
          <Image src="/Chinalink_logo.png" alt="" width={52} height={52} className="size-11 lg:size-[52px]" priority />
          <span className="font-serif text-xl font-bold leading-none text-brand-text lg:text-[1.625rem]">懂陸姐</span>
        </Link>

        <nav aria-label="主要欄目" className="hidden items-stretch gap-1 lg:flex">
          {primaryNav.map((item) => {
            const current = isCurrent(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={`px-4 py-2.5 text-[15px] transition-colors ${
                  current ? 'bg-brand-tint font-bold text-brand-text' : 'text-brand-text hover:bg-brand-tint/60'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <Link href="/service-cart" aria-label="購物車" className="flex size-11 items-center justify-center text-brand-text">
            <ShoppingCart className="size-5" aria-hidden="true" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
