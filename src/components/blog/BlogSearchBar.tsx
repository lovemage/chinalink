'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface BlogSearchBarProps {
  initialSearch?: string
}

export function BlogSearchBar({ initialSearch = '' }: BlogSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialSearch)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const next = value.trim()
    if (next) {
      params.set('search', next)
    } else {
      params.delete('search')
    }
    router.push(`/blog?${params.toString()}`)
  }

  function clearSearch() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜尋文章關鍵字..."
        className="w-full rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
      />
      <button
        type="submit"
        className="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-brand-text hover:bg-brand-primary/90 transition-colors"
      >
        搜尋
      </button>
      {searchParams.get('search') && (
        <button
          type="button"
          onClick={clearSearch}
          className="rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm text-brand-muted hover:bg-brand-primary/5 transition-colors"
        >
          清除
        </button>
      )}
    </form>
  )
}

