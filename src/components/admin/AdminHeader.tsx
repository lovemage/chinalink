'use client'

export default function AdminHeader({ username }: { username: string }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <span className="text-base font-bold text-[#1C1917]">ChinaLink 後台</span>
      <span className="text-sm text-gray-500">{username}</span>
    </header>
  )
}
