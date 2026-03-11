'use client'

import { useState } from 'react'
import type { Service } from '@/payload-types'

interface PricingSectionProps {
  service: Service
}

export function PricingSection({ service }: PricingSectionProps) {
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

  function handleBuy() {
    alert('即將跳轉至結帳頁面（功能開發中）')
  }

  if (service.pricingMode === 'custom') {
    return (
      <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <p className="text-lg font-semibold text-brand-text">此服務需先諮詢報價</p>
        <p className="mt-2 text-sm text-brand-muted">
          請填寫下方詢價表單，我們會盡快與您聯繫。
        </p>
        <a
          href="#inquiry-form"
          className="mt-4 inline-block rounded-full bg-brand-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-primary/90"
        >
          填寫詢價表單
        </a>
      </div>
    )
  }

  if (service.pricingMode === 'addons') {
    const total = calculateTotal()

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
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
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  addon.id && selectedAddons.has(addon.id)
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-gray-200 hover:border-brand-primary/30'
                } ${addon.required ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={addon.id ? selectedAddons.has(addon.id) : false}
                  onChange={() => addon.id && toggleAddon(addon.id, !!addon.required)}
                  disabled={!!addon.required}
                  className="h-4 w-4 rounded border-gray-300 text-brand-primary accent-brand-primary"
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

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">合計</span>
            <span className="text-2xl font-bold text-brand-cta">
              NT$ {total.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={handleBuy}
            className="mt-4 w-full rounded-full bg-brand-cta px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-cta/90"
          >
            立即購買
          </button>
        </div>
      </div>
    )
  }

  // fixed pricing
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <span className="text-sm text-brand-muted">價格</span>
      <p className="text-3xl font-bold text-brand-text">
        {service.price ? `NT$ ${service.price.toLocaleString()}` : '免費'}
      </p>
      <button
        type="button"
        onClick={handleBuy}
        className="mt-6 w-full rounded-full bg-brand-cta px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-cta/90"
      >
        立即購買
      </button>
    </div>
  )
}
