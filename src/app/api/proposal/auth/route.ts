import { NextResponse } from 'next/server'
import {
  getProposalAccessToken,
  isProposalPasswordValid,
  PROPOSAL_ACCESS_COOKIE,
  PROPOSAL_PATH,
} from '@/lib/proposal/access'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: unknown }
    const password = typeof body.password === 'string' ? body.password : ''

    if (!isProposalPasswordValid(password)) {
      return NextResponse.json(
        { success: false, error: '密碼不正確，請重新輸入。' },
        { status: 401 },
      )
    }

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
