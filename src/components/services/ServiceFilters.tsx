'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { ServiceCategory } from '@/payload-types'

interface ServiceFiltersProps {
  categories: ServiceCategory[]
}

export function ServiceFilters({ categories }: ServiceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  function handleClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    router.push(`/services?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleClick('')}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
          !currentCategory
            ? 'bg-brand-primary text-white'
            : 'bg-white text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary'
        }`}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => handleClick(cat.slug)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            currentCategory === cat.slug
              ? 'bg-brand-primary text-white'
              : 'bg-white text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
