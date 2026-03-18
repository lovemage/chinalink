'use client'

import { useState } from 'react'
import type { Service } from '@/payload-types'

interface PricingSectionProps {
  service: Service
  lineUrl: string
}

export function PricingSection({ service, lineUrl }: PricingSectionProps) {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(() => {
    const required = new Set<string>()
    if (service.pricingMode === 'addons' && service.addons) {
      for (const addon of service.addons) {
        if (addon.required && addon.id) {
          required.add(addon.id)
        }
      }
    }
    return required
  })

  function toggleAddon(id: string, isRequired: boolean) {
    if (isRequired) return
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function calculateTotal(): number {
    let total = service.basePrice || 0
    if (service.addons) {
      for (const addon of service.addons) {
        if (addon.id && selectedAddons.has(addon.id)) {
          total += addon.price
        }
      }
    }
    return total
  }

  // Custom pricing — LINE CTA only
  if (service.pricingMode === 'custom') {
    return (
      <div className="rounded-[2.5rem] border border-brand-primary/20 bg-brand-primary/5 p-6">
        <p className="text-lg font-semibold text-brand-text">此服務需先諮詢報價</p>
        <p className="mt-2 text-sm text-brand-muted">
          歡迎加入官方 LINE，我們會為您提供專屬報價。
        </p>
        <a
          href="https://lin.ee/S2VgXpn"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#05b04d]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304" />
          </svg>
          加入官方 LINE 了解
        </a>
      </div>
    )
  }

  // Addons pricing
  if (service.pricingMode === 'addons') {
    const total = calculateTotal()

    return (
      <div className="rounded-[2.5rem] border border-brand-primary/10 bg-white p-6 shadow-xl shadow-brand-primary/5">
        <div className="mb-4">
          <span className="text-sm text-brand-muted">基本價格</span>
          <p className="text-2xl font-bold text-brand-text">
            NT$ {(service.basePrice || 0).toLocaleString()}
          </p>
        </div>

        {service.addons && service.addons.length > 0 && (
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium text-brand-text">加購項目</p>
            {service.addons.map((addon) => (
              <label
                key={addon.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                  addon.id && selectedAddons.has(addon.id)
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-brand-primary/10 hover:border-brand-primary/30'
                } ${addon.required ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={addon.id ? selectedAddons.has(addon.id) : false}
                  onChange={() => addon.id && toggleAddon(addon.id, !!addon.required)}
                  disabled={!!addon.required}
                  className="h-4 w-4 rounded border-brand-primary/30 text-brand-primary accent-brand-primary"
                />
                <span className="flex-1 text-sm text-brand-text">
                  {addon.name}
                  {addon.required && (
                    <span className="ml-2 text-xs text-brand-muted">(必選)</span>
                  )}
                </span>
                <span className="text-sm font-medium text-brand-muted">
                  +NT$ {addon.price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="border-t border-brand-primary/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">合計</span>
            <span className="text-2xl font-bold text-brand-cta">
              NT$ {total.toLocaleString()}
            </span>
          </div>
          <ActionButton lineUrl={lineUrl} />
        </div>
      </div>
    )
  }

  // Fixed pricing
  return (
    <div className="rounded-[2.5rem] border border-brand-primary/10 bg-white p-6 shadow-xl shadow-brand-primary/5">
      <span className="text-sm text-brand-muted">價格</span>
      <p className="text-3xl font-bold text-brand-text">
        {service.price ? `NT$ ${service.price.toLocaleString()}` : '免費'}
      </p>
      <ActionButton lineUrl={lineUrl} />
    </div>
  )
}

function ActionButton({ lineUrl }: { lineUrl: string }) {
  if (!lineUrl) return null

  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#05b04d] active:scale-[0.98]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304" />
      </svg>
      加入官方 LINE 了解
    </a>
  )
}
