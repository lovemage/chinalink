'use client'

import { useState, useTransition } from 'react'
import DataTable from '@/components/admin/DataTable'
import { updateSettings } from '@/lib/actions/settings'
import type { SiteSettings } from '@/lib/queries/settings'

interface InquiryRow {
  id: number
  name: string
  contactMethod: string
  message: string
  createdAt: Date | null
}

interface SettingsManagerProps {
  settings: SiteSettings
  inquiries: InquiryRow[]
}

const TABS = [
  { key: 'settings', label: '基本設定' },
  { key: 'inquiries', label: '聯絡諮詢AI紀錄' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function SettingsManager({
  settings,
  inquiries,
}: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('settings')
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  async function handleSettingsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSettingsSaved(false)
    setSettingsError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateSettings(formData)
      if ('error' in result) {
        setSettingsError(result.error)
      } else {
        setSettingsSaved(true)
      }
    })
  }

  const inquiryColumns = [
    {
      key: 'name',
      label: '姓名',
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-brand-text">{row.name as string}</span>
      ),
    },
    {
      key: 'contactMethod',
      label: '聯繫方式',
      render: (row: Record<string, unknown>) => (
        <span className="text-brand-muted text-sm">{row.contactMethod as string}</span>
      ),
    },
    {
      key: 'message',
      label: '訊息',
      render: (row: Record<string, unknown>) => (
        <span className="text-brand-muted text-sm">
          {String(row.message ?? '').slice(0, 30)}
          {String(row.message ?? '').length > 30 ? '…' : ''}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '日期',
      render: (row: Record<string, unknown>) => (
        <span className="text-brand-muted text-xs">
          {row.createdAt
            ? new Date(row.createdAt as string).toLocaleDateString('zh-TW')
            : '—'}
        </span>
      ),
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-text">設定</h1>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-brand-rule">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted hover:text-brand-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: 基本設定 */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSettingsSubmit} className="max-w-lg space-y-5">
          <div className="bg-white p-4 md:p-6 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="lineOfficialUrl"
                className="block text-sm font-medium text-brand-muted"
              >
                LINE 官方帳號網址
              </label>
              <input
                id="lineOfficialUrl"
                name="lineOfficialUrl"
                type="text"
                defaultValue={settings.lineOfficialUrl ?? ''}
                placeholder="https://lin.ee/xxxxxxx"
                className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lineOfficialId"
                className="block text-sm font-medium text-brand-muted"
              >
                LINE 官方帳號 ID
              </label>
              <input
                id="lineOfficialId"
                name="lineOfficialId"
                type="text"
                defaultValue={settings.lineOfficialId ?? ''}
                placeholder="@xxxxxxxx"
                className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div className="border border-brand-rule bg-brand-bg p-4 space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-brand-text">AI 客服設定</h2>
                <p className="mt-1 text-xs text-brand-muted">
                  系統會強制限制 AI 只回答站內商品與服務相關問題。
                </p>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-brand-muted">
                <input
                  name="aiAgentEnabled"
                  type="checkbox"
                  defaultChecked={settings.aiAgentEnabled}
                  className="h-4 w-4 border-brand-rule text-brand-primary focus:ring-brand-primary"
                />
                啟用 AI 客服
              </label>

              <div className="space-y-1.5">
                <label
                  htmlFor="openrouterApiKey"
                  className="block text-sm font-medium text-brand-muted"
                >
                  OpenRouter API Key
                </label>
                <input
                  id="openrouterApiKey"
                  name="openrouterApiKey"
                  type="password"
                  defaultValue={settings.openrouterApiKey ?? ''}
                  placeholder="sk-or-v1-..."
                  className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="openrouterModel"
                  className="block text-sm font-medium text-brand-muted"
                >
                  OpenRouter Model
                </label>
                <input
                  id="openrouterModel"
                  name="openrouterModel"
                  type="password"
                  defaultValue={settings.openrouterModel ?? 'openai/gpt-4.1-mini'}
                  placeholder="openai/gpt-4.1-mini"
                  autoComplete="off"
                  className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="systemPrompt"
                  className="block text-sm font-medium text-brand-muted"
                >
                  系統 Prompt
                </label>
                <textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  rows={6}
                  defaultValue={settings.systemPrompt ?? ''}
                  placeholder="你是懂陸姐網站的 AI 客服..."
                  className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="aiAgentPrompt"
                  className="block text-sm font-medium text-brand-muted"
                >
                  管理員額外 Prompt
                </label>
                <textarea
                  id="aiAgentPrompt"
                  name="aiAgentPrompt"
                  rows={5}
                  defaultValue={settings.aiAgentPrompt ?? ''}
                  placeholder="你是懂陸姐站內客服..."
                  className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="whatsappUrl"
                  className="block text-sm font-medium text-brand-muted"
                >
                  WhatsApp 官方連結
                </label>
                <input
                  id="whatsappUrl"
                  name="whatsappUrl"
                  type="text"
                  defaultValue={settings.whatsappUrl ?? ''}
                  placeholder="https://wa.me/886XXXXXXXXX"
                  className="w-full px-3 py-2 text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {settingsError && (
            <p className="text-sm text-red-600">{settingsError}</p>
          )}
          {settingsSaved && (
            <p className="text-sm text-green-600">設定已儲存</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-brand-primary text-white text-sm font-medium hover:bg-brand-deep disabled:opacity-50 transition-colors"
          >
            {isPending ? '儲存中...' : '儲存設定'}
          </button>
        </form>
      )}

      {/* Tab: 諮詢紀錄 */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <DataTable
            columns={inquiryColumns}
            data={inquiries as unknown as Record<string, unknown>[]}
            searchPlaceholder="搜尋姓名..."
            emptyMessage="尚無諮詢紀錄"
            onRowClick={(row) => {
              const r = row as unknown as InquiryRow
              setExpandedId(expandedId === r.id ? null : r.id)
            }}
          />

          {/* Expanded detail panel */}
          {expandedId !== null && (() => {
            const inquiry = inquiries.find((i) => i.id === expandedId)
            if (!inquiry) return null
            return (
              <div className="bg-white p-5 space-y-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-brand-text">
                    {inquiry.name} 的諮詢內容
                  </h3>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="text-brand-muted hover:text-brand-muted text-sm"
                  >
                    收起
                  </button>
                </div>

                <p className="text-sm text-brand-muted whitespace-pre-wrap bg-brand-bg p-3">
                  {inquiry.message}
                </p>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
