export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { PageHeader } from '@/components/site/PageHeader'
import { PostListing, parsePage } from '@/components/blog/PostListing'
import { ARTICLE_CATEGORY_SLUGS } from '@/lib/posts/constants'

async function getCategory(slug: string) {
  if (!(ARTICLE_CATEGORY_SLUGS as readonly string[]).includes(slug)) return null
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
  return row ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: '找不到分類' }
  return {
    title: `${category.name}｜懂陸姐 ChinaLink`,
    description: category.description ?? undefined,
    alternates: { canonical: `/category/${category.slug}` },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const [{ slug }, { search, page }] = await Promise.all([params, searchParams])
  const category = await getCategory(slug)
  if (!category) notFound()

  return (
    <>
      <PageHeader title={category.name} description={category.description ?? undefined} />
      <PostListing
        basePath={`/category/${category.slug}`}
        layout="grid"
        category={category.slug}
        search={search}
        page={parsePage(page)}
        showCategoryFilter={false}
      />
    </>
  )
}
