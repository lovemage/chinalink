'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const contactMethod = formData.get('contactMethod') as string
    const message = formData.get('message') as string

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, contactMethod, message }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || '送出失敗，請稍後再試')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : '送出失敗，請稍後再試')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-700">訊息已送出！</p>
        <p className="mt-2 text-sm text-green-600">我們會盡快回覆您，感謝您的聯繫。</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-brand-text">
          姓名 <span className="text-red-500">*</span>
        </label>
        <Input id="name" name="name" required placeholder="請輸入您的姓名" />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-text">
          Email <span className="text-red-500">*</span>
        </label>
        <Input id="email" name="email" type="email" required placeholder="請輸入您的 Email" />
      </div>

      <div>
        <label
          htmlFor="contactMethod"
          className="mb-1.5 block text-sm font-medium text-brand-text"
        >
          聯繫方式
        </label>
        <Input id="contactMethod" name="contactMethod" placeholder="Line ID 或 微信 ID" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-brand-text">
          需求說明 <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="請描述您的需求或問題"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
      >
        {status === 'loading' ? '送出中...' : '送出訊息'}
      </Button>
    </form>
  )
}
