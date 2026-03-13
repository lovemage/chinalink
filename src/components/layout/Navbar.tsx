'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { MobileNav } from './MobileNav'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

const navItems = [
  { label: '首頁', href: '/' },
  { label: '服務項目', href: '/services' },
  { label: '商品專區', href: '/products' },
  { label: '專欄文章', href: '/blog' },
  { label: '關於我們', href: '/about' },
  { label: '聯絡諮詢', href: '/contact' },
]

export function Navbar() {
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-brand-bg/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 transition-colors hover:text-brand-primary">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-brand-primary/20 bg-brand-bg shadow-sm">
            <Image
              src="/Chinalink_logo.png"
              alt="懂陸姐 Logo"
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-text leading-none">
              懂陸姐
            </span>
            <span className="font-playfair text-[11px] font-bold uppercase tracking-widest text-brand-muted italic mt-0.5">
              ChinaLink
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-text/80 transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg"
            >
              {item.label}
            </Link>
          ))}

          <div className="h-6 w-px bg-brand-muted/20"></div>

          {isLoggedIn && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      {session.user.image ? (
                        <AvatarImage src={session.user.image} alt={session.user.name || ''} />
                      ) : null}
                      <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold">
                        {session.user.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-2xl p-2">
                <DropdownMenuLabel className="font-bold">
                  {session.user.name || session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-brand-muted/10" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-xl text-brand-cta focus:bg-brand-cta/10 focus:text-brand-cta font-medium cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  登出帳號
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-brand-primary px-8 text-sm font-semibold tracking-wider text-brand-text shadow-md transition-colors duration-300 hover:bg-brand-primary/90 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text focus-visible:ring-offset-4 focus-visible:ring-offset-brand-bg"
            >
              <span className="relative">會員登入</span>
            </Link>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  )
}
