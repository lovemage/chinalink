'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'

interface MemberRow {
  id: number
  name: string
  email: string
  authProvider: string
  lastLoginAt: Date | null
  createdAt: Date | null
}

interface MembersTableProps {
  members: MemberRow[]
  initialSearch: string
}

const AUTH_PROVIDER_LABELS: Record<string, string> = {
  email: 'Email',
  google: 'Google',
}

export default function MembersTable({ members, initialSearch }: MembersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  function handleSearchChange(value: string) {
    setSearch(value)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    router.push(`/admin/members?${params.toString()}`)
  }

  const columns = [
    {
      key: 'name',
      label: '姓名',
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-gray-900">{row.name as string}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-700">{row.email as string}</span>
      ),
    },
    {
      key: 'authProvider',
      label: '登入方式',
      render: (row: Record<string, unknown>) => {
        const provider = row.authProvider as string
        return (
          <span className="text-gray-600">
            {AUTH_PROVIDER_LABELS[provider] ?? provider}
          </span>
        )
      },
    },
    {
      key: 'lastLoginAt',
      label: '最後登入',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-400 text-xs">
          {row.lastLoginAt
            ? new Date(row.lastLoginAt as string).toLocaleDateString('zh-TW')
            : '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '註冊日期',
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-400 text-xs">
          {row.createdAt
            ? new Date(row.createdAt as string).toLocaleDateString('zh-TW')
            : '—'}
        </span>
      ),
    },
  ]

  const filtered = search
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : members

  return (
    <DataTable
      columns={columns}
      data={filtered as unknown as Record<string, unknown>[]}
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="搜尋姓名或 Email..."
      onRowClick={(row) =>
        router.push(`/admin/members/${(row as unknown as MemberRow).id}`)
      }
      emptyMessage="尚無會員資料"
    />
  )
}
