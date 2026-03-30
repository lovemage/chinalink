'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface ServiceCategoryItem {
  id: number
  name: string
  slug: string
}

interface ServiceFiltersProps {
  categories: ServiceCategoryItem[]
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
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => handleClick('')}
        className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
          !currentCategory
            ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
            : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-primary/40 hover:bg-white'
        }`}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => handleClick(cat.slug)}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            currentCategory === cat.slug
              ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
              : 'border-brand-primary/15 bg-white/80 text-brand-text hover:border-brand-primary/40 hover:bg-white'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
