'use client'

import { LogOut } from 'lucide-react'

export function ProposalLogoutButton() {
  async function logOut() {
    await fetch('/api/proposal/auth', { method: 'DELETE' })
    window.location.assign('/website-repositioning-survey/login')
  }

  return (
    <button
      type="button"
      onClick={logOut}
      className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-[#e8ddd1] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dca77f]"
    >
      <LogOut className="size-4" aria-hidden="true" />
      登出
    </button>
  )
}
