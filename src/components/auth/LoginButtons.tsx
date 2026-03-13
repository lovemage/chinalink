'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export function LoginButtons() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('發送失敗，請稍後再試')
      }

      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('email-otp', {
        email,
        code,
        redirect: false,
      })

      if (res?.error) {
        throw new Error('驗證碼錯誤或已過期')
      }

      if (res?.ok) {
        window.location.href = '/'
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              電子郵件
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-12"
            disabled={isLoading || !email}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            發送驗證碼
          </Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium leading-none">
              驗證碼
            </label>
            <Input
              id="code"
              type="text"
              placeholder="請輸入 6 位數驗證碼"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 rounded-xl text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-sm text-muted-foreground text-center pt-2">
              已發送至 {email}
              <button
                type="button"
                className="text-brand-primary ml-2 hover:underline font-medium"
                onClick={() => setStep('email')}
                disabled={isLoading}
              >
                修改
              </button>
            </p>
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-12"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            登入
          </Button>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            或使用其他方式
          </span>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/' })}
        variant="outline"
        className="rounded-2xl h-12 w-full"
        disabled={isLoading}
      >
        Google 登入
      </Button>
    </div>
  )
}
