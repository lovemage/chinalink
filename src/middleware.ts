import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

async function hasValidAdminToken(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value
  const secret = process.env.JWT_SECRET ?? process.env.PAYLOAD_SECRET
  if (!token || !secret) return false
  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!(await hasValidAdminToken(request))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
