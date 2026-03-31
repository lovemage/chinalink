import { db } from '@/lib/db'
import { postTags } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export async function getPostTagsAll() {
  return db
    .select({
      id: postTags.id,
      name: postTags.name,
      slug: postTags.slug,
      createdAt: postTags.createdAt,
    })
    .from(postTags)
    .orderBy(asc(postTags.name))
}

