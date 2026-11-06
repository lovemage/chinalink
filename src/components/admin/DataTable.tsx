'use client'

import React from 'react'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  onRowClick?: (item: T) => void
  emptyMessage?: string
  actions?: React.ReactNode
}

export default function DataTable<T>({
  columns,
  data,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onRowClick,
  emptyMessage = 'No data found.',
  actions,
}: DataTableProps<T>) {
  return (
    <div className="bg-white overflow-hidden">
      {(onSearchChange || actions) && (
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-brand-rule">
          {onSearchChange && (
            <input
              type="text"
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-h-11 min-w-0 flex-1 px-3 py-2 text-base md:text-sm border border-brand-rule focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          )}
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      <ul className="divide-y divide-brand-rule md:hidden">
        {data.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-brand-muted">{emptyMessage}</li>
        ) : (
          data.map((item, rowIndex) => (
            <li
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={`space-y-1.5 p-4 ${onRowClick ? 'cursor-pointer active:bg-brand-tint' : ''}`}
            >
              {columns.map((col, colIndex) => {
                const value = col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')
                return colIndex === 0 ? (
                  <div key={col.key} className="font-medium leading-6">
                    {value}
                  </div>
                ) : (
                  <div key={col.key} className="flex items-start justify-between gap-4 text-sm">
                    <span className="shrink-0 text-brand-muted">{col.label}</span>
                    <span className="min-w-0 text-right">{value}</span>
                  </div>
                )
              })}
            </li>
          ))
        )}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-bg border-b border-brand-rule">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-brand-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-gray-50 last:border-0 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-brand-bg' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-brand-muted ${col.className ?? ''}`}
                    >
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
