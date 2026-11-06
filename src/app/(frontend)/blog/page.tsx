export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/PageHeader'
import { PostListing, parsePage } from '@/components/blog/PostListing'
import { POST_SECTIONS } from '@/lib/posts/constants'

const section = POST_SECTIONS.opinion

export const metadata: Metadata = {
  title: `${section.label}｜懂陸姐 ChinaLink`,
  description: section.description,
  alternates: { canonical: '/blog' },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>
}) {
  const { category, search, page } = await searchParams
  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      <PostListing basePath="/blog" layout="magazine" section="opinion" category={category} search={search} page={parsePage(page)} />
    </>
  )
}
