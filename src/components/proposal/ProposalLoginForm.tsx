'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'

export function ProposalLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/proposal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = (await response.json()) as {
        success?: boolean
        redirectTo?: string
        error?: string
      }

      if (!response.ok || !result.success) {
        setError(result.error || '無法登入，請稍後再試。')
        return
      }

      window.location.assign(result.redirectTo || '/website-repositioning-survey')
    } catch {
      setError('網路連線異常，請稍後再試。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10" noValidate>
      <label htmlFor="proposal-password" className="block text-sm font-bold text-[#332b25]">
        提案檢視密碼
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <LockKeyhole aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8b6b4c]" />
          <input
            id="proposal-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'proposal-password-error' : undefined}
            className="h-14 w-full border border-[#cdbda9] bg-[#fffcf6] pl-12 pr-4 text-base text-[#28231f] outline-none transition-colors placeholder:text-[#a69a8e] focus:border-[#9f5d35] focus:ring-2 focus:ring-[#9f5d35]/20"
            placeholder="請輸入密碼"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !password}
          className="inline-flex h-14 items-center justify-center gap-3 bg-[#9f5d35] px-7 font-bold text-[#fffaf2] transition-colors hover:bg-[#82482a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f5d35] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? '驗證中' : '查看方向確認書'}
          {!submitting && <ArrowRight aria-hidden="true" className="size-5" />}
        </button>
      </div>
      {error && (
        <p id="proposal-password-error" role="alert" className="mt-3 text-sm font-medium text-[#a33a2b]">
          {error}
        </p>
      )}
    </form>
  )
}
