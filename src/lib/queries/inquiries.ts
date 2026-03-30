import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq, and, ilike, desc } from 'drizzle-orm'

interface GetInquiriesOpts {
  search?: string
  status?: string
}

export async function getInquiries(opts: GetInquiriesOpts = {}) {
  const { search, status } = opts

  const conditions = []

  if (search) {
    conditions.push(ilike(inquiries.name, `%${search}%`))
  }

  if (status) {
    conditions.push(eq(inquiries.status, status))
  }

  const rows = await db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      contactMethod: inquiries.contactMethod,
      message: inquiries.message,
      status: inquiries.status,
      itemType: inquiries.itemType,
      createdAt: inquiries.createdAt,
    })
    .from(inquiries)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(inquiries.createdAt))

  return rows
}
