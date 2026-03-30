'use client'

import { useActionState } from 'react'
import { loginAction } from '../actions'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-brand-text mb-2">
          ChinaLink 後台管理
        </h1>
        <p className="text-sm text-center text-brand-muted mb-8">
          請輸入管理員帳號密碼
        </p>

        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-brand-text mb-1"
            >
              帳號
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
              placeholder="管理員帳號"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-text mb-1"
            >
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm text-brand-text placeholder-brand-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
              placeholder="管理員密碼"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-brand-cta text-center">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-brand-cta focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  )
}
