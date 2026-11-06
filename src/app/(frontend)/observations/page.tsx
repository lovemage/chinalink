export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/PageHeader'
import { PostListing, parsePage } from '@/components/blog/PostListing'
import { POST_SECTIONS } from '@/lib/posts/constants'

const section = POST_SECTIONS.observation

export const metadata: Metadata = {
  title: `${section.label}｜懂陸姐 ChinaLink`,
  description: section.description,
  alternates: { canonical: '/observations' },
}

export default async function ObservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>
}) {
  const { category, search, page } = await searchParams
  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      <PostListing basePath="/observations" layout="wire" section="observation" category={category} search={search} page={parsePage(page)} />
    </>
  )
}
