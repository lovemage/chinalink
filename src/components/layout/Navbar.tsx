'use client'

import Link from 'next/link'
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
  { label: '服務項目', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: '關於懂陸姐', href: '/about' },
  { label: '聯繫我們', href: '/contact' },
]

export function Navbar() {
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-brand-primary">
          懂陸姐
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-text transition-colors hover:text-brand-primary"
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    <Avatar>
                      {session.user.image ? (
                        <AvatarImage src={session.user.image} alt={session.user.name || ''} />
                      ) : null}
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuLabel>
                  {session.user.name || session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="mr-2 size-4" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg bg-brand-cta px-4 text-sm font-medium text-white transition-colors hover:bg-brand-cta/90"
            >
              登入
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
