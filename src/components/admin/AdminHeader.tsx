'use client'

export default function AdminHeader({ username }: { username: string }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-brand-raised border-b border-brand-rule flex items-center justify-between px-4">
      <span className="text-base font-bold text-brand-text">懂陸姐後台</span>
      <span className="text-sm text-brand-muted">{username}</span>
    </header>
  )
}
