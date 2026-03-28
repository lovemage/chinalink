'use client'

import { useState } from 'react'
import type { Service } from '@/payload-types'

interface PricingSectionProps {
  service: Service
  lineUrl: string
  compact?: boolean
}

export function PricingSection({ service, lineUrl, compact }: PricingSectionProps) {
  const consultationLineUrl = lineUrl || 'https://line.me/ti/p/~misstinachen'

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

  const containerRadius = compact ? 'rounded-2xl' : 'rounded-[2.5rem]'

  // Custom pricing — LINE CTA only
  if (service.pricingMode === 'custom') {
    return (
      <div className={`${containerRadius} border border-brand-primary/20 bg-brand-primary/5 p-6`}>
        <p className="text-lg font-semibold text-brand-text">此服務需先諮詢報價</p>
        <p className="mt-2 text-sm text-brand-muted">
          歡迎加入官方 LINE，我們會為您提供專屬報價。
        </p>
        <a
          href={consultationLineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-cta px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-cta/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
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
      <div className={`${containerRadius} border border-brand-primary/10 bg-white p-6 shadow-xl shadow-brand-primary/5`}>
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
    <div className={`${containerRadius} border border-brand-primary/10 bg-white p-6 shadow-xl shadow-brand-primary/5`}>
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
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-cta px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-cta/90 active:scale-[0.98]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
      加入官方 LINE 了解
    </a>
  )
}
