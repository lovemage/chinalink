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
        className={`border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
          !currentCategory
            ? 'bg-brand-tint font-bold text-brand-text border-brand-tint'
            : 'border-brand-rule bg-brand-raised text-brand-text hover:bg-brand-tint'
        }`}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => handleClick(cat.slug)}
          className={`border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            currentCategory === cat.slug
              ? 'bg-brand-tint font-bold text-brand-text border-brand-tint'
              : 'border-brand-rule bg-brand-raised text-brand-text hover:bg-brand-tint'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
