import { timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { publishDueScheduledPosts } from '@/lib/posts/publish-scheduled'

export const dynamic = 'force-dynamic'

// Optional external trigger; the app also checks every minute on its own.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? ''
  const expected = Buffer.from(secret ?? '')
  const actual = Buffer.from(given)
  if (!secret || expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await publishDueScheduledPosts())
}
