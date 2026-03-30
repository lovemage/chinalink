'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export interface DrizzleCategory {
  id: number
  name: string
  slug: string
}

interface CategoryFilterProps {
  categories: DrizzleCategory[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
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
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleClick('')}
        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
          !currentCategory
            ? 'bg-brand-primary text-brand-text'
            : 'bg-card text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary'
        }`}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => handleClick(cat.slug)}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
            currentCategory === cat.slug
              ? 'bg-brand-primary text-brand-text'
              : 'bg-card text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
