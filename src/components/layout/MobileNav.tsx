'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface NavItem {
  label: string
  href: string
}

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="選單" />}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold text-brand-primary">
            懂陸姐
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <div className="mt-4 px-3 text-sm text-muted-foreground">
                {session?.user?.name || session?.user?.email}
              </div>
              <button
                onClick={() => {
                  setOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="mt-2 inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-brand-text transition-colors hover:bg-accent"
              >
                登出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-brand-cta px-4 text-sm font-medium text-white transition-colors hover:bg-brand-cta/90"
            >
              登入
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
