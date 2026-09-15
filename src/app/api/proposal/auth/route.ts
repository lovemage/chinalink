import { NextResponse } from 'next/server'
import {
  getProposalAccessToken,
  isProposalPasswordValid,
  PROPOSAL_ACCESS_COOKIE,
  PROPOSAL_PATH,
} from '@/lib/proposal/access'

const attempts = new Map<string, { count: number; expires: number }>()
export async function POST(request: Request) {
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  for (const [id, entry] of attempts) if (entry.expires < now) attempts.delete(id)
  const entry = attempts.get(key) || { count: 0, expires: now + 15 * 60 * 1000 }
  if (++entry.count > 10) return NextResponse.json({ success: false, error: '嘗試次數過多，請於 15 分鐘後再試。' }, { status: 429 })
  attempts.set(key, entry)
  try {
    const body = (await request.json()) as { password?: unknown }
    const password = typeof body.password === 'string' ? body.password : ''

    if (!isProposalPasswordValid(password)) {
      return NextResponse.json(
        { success: false, error: '密碼不正確，請重新輸入。' },
        { status: 401 },
      )
    }

    attempts.delete(key)
    const response = NextResponse.json({ success: true, redirectTo: PROPOSAL_PATH })
    response.cookies.set(PROPOSAL_ACCESS_COOKIE, getProposalAccessToken(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: '無法驗證密碼，請稍後再試。' },
      { status: 400 },
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(PROPOSAL_ACCESS_COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
