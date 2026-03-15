'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface InquiryFormProps {
  serviceId?: number
  serviceTitle?: string
}

export function InquiryForm({ serviceId, serviceTitle }: InquiryFormProps) {
  const [name, setName] = useState('')
  const [contactMethod, setContactMethod] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contactMethod, message, serviceId }),
      })

      if (!res.ok) {
        throw new Error('提交失敗，請稍後再試')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div id="inquiry-form" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />
        <p className="mt-4 text-lg font-semibold text-brand-text">詢價已送出！</p>
        <p className="mt-2 text-sm text-brand-muted">我們會盡快與您聯繫，感謝您的耐心等候。</p>
      </div>
    )
  }

  return (
    <div id="inquiry-form" className="rounded-2xl border border-brand-primary/10 bg-white p-6">
      <h3 className="font-serif text-xl font-medium text-brand-text">
        {serviceTitle ? `詢價 - ${serviceTitle}` : '聯繫我們'}
      </h3>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="inquiry-name" className="mb-1.5 block text-sm font-medium text-brand-text">
            姓名
          </label>
          <input
            id="inquiry-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-brand-primary/15 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            placeholder="請輸入您的姓名"
          />
        </div>

        <div>
          <label htmlFor="inquiry-contact" className="mb-1.5 block text-sm font-medium text-brand-text">
            聯繫方式（Line ID / 微信）
          </label>
          <input
            id="inquiry-contact"
            type="text"
            required
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            className="w-full rounded-xl border border-brand-primary/15 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            placeholder="請輸入 Line ID 或微信號"
          />
        </div>

        <div>
          <label htmlFor="inquiry-message" className="mb-1.5 block text-sm font-medium text-brand-text">
            需求說明
          </label>
          <textarea
            id="inquiry-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-brand-primary/15 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            placeholder="請描述您的需求"
          />
        </div>

        {error && <p className="text-sm text-brand-cta">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? '提交中...' : '送出詢價'}
        </button>
      </form>
    </div>
  )
}
