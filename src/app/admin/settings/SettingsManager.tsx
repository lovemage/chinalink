'use client'

import { useState, useTransition } from 'react'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import { updateSettings } from '@/lib/actions/settings'
import { updateInquiryStatus } from '@/lib/actions/inquiries'

interface InquiryRow {
  id: number
  name: string
  contactMethod: string
  message: string
  status: string
  itemType: string | null
  createdAt: Date | null
}

interface SettingsManagerProps {
  settings: Record<string, string>
  inquiries: InquiryRow[]
}

const INQUIRY_STATUS_OPTIONS = [
  { value: 'new', label: '新諮詢' },
  { value: 'contacted', label: '已聯繫' },
  { value: 'quoted', label: '已報價' },
  { value: 'closed', label: '已結案' },
]

const INQUIRY_STATUS_LABELS: Record<string, string> = {
  new: '新諮詢',
  contacted: '已聯繫',
  quoted: '已報價',
  closed: '已結案',
}

const ITEM_TYPE_LABELS: Record<string, string> = {
  service: '服務',
  product: '商品',
}

const TABS = [
  { key: 'settings', label: '基本設定' },
  { key: 'inquiries', label: '諮詢紀錄' },
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
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null)

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

  async function handleStatusChange(id: number, status: string) {
    setStatusUpdating(id)
    const result = await updateInquiryStatus(id, status)
    setStatusUpdating(null)
    if ('error' in result) {
      alert(result.error)
    }
  }

  const inquiryColumns = [
    {
      key: 'name',
      label: '姓名',
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-gray-900">{row.name as string}</span>
      ),
    },
    {
      key: 'contactMethod',
      label: '聯繫方式',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-600 text-sm">{row.contactMethod as string}</span>
      ),
    },
    {
      key: 'itemType',
      label: '類型',
      render: (row: Record<string, unknown>) => {
        const t = row.itemType as string | null
        return (
          <span className="text-gray-500 text-sm">
            {t ? (ITEM_TYPE_LABELS[t] ?? t) : '—'}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: '狀態',
      render: (row: Record<string, unknown>) => {
        const s = row.status as string
        return (
          <StatusBadge status={INQUIRY_STATUS_LABELS[s] ?? s} />
        )
      },
    },
    {
      key: 'createdAt',
      label: '日期',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-400 text-xs">
          {row.createdAt
            ? new Date(row.createdAt as string).toLocaleDateString('zh-TW')
            : '—'}
        </span>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: 基本設定 */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSettingsSubmit} className="max-w-lg space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="lineOfficialUrl"
                className="block text-sm font-medium text-gray-700"
              >
                LINE 官方帳號網址
              </label>
              <input
                id="lineOfficialUrl"
                name="lineOfficialUrl"
                type="text"
                defaultValue={settings.lineOfficialUrl ?? ''}
                placeholder="https://lin.ee/xxxxxxx"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lineOfficialId"
                className="block text-sm font-medium text-gray-700"
              >
                LINE 官方帳號 ID
              </label>
              <input
                id="lineOfficialId"
                name="lineOfficialId"
                type="text"
                defaultValue={settings.lineOfficialId ?? ''}
                placeholder="@xxxxxxxx"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
              <div className="bg-white rounded-xl shadow-sm p-5 space-y-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {inquiry.name} 的諮詢內容
                  </h3>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    收起
                  </button>
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                  {inquiry.message}
                </p>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    更新狀態
                  </label>
                  <select
                    value={inquiry.status}
                    disabled={statusUpdating === inquiry.id}
                    onChange={(e) =>
                      handleStatusChange(inquiry.id, e.target.value)
                    }
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {INQUIRY_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {statusUpdating === inquiry.id && (
                    <span className="text-xs text-gray-400">更新中...</span>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
