import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { admins } from '@/lib/db/schema'

// ---- JWT secret ----

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('JWT_SECRET or PAYLOAD_SECRET env var is required')
  return new TextEncoder().encode(secret)
}

// ---- JWT for admin ----

export async function signAdminJWT(username: string): Promise<string> {
  return new SignJWT({ sub: 'admin', username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret())
}

export async function verifyAdminJWT(
  token: string
): Promise<{ sub: string; username: string; iat: number; exp: number } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as { sub: string; username: string; iat: number; exp: number }
  } catch {
    return null
  }
}

// ---- DB-based admin verification ----

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  const [row] = await db
    .select({ passwordHash: admins.passwordHash })
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1)

  if (!row) return false
  return bcrypt.compare(password, row.passwordHash)
}

// ---- Cookie-based admin info ----

export async function getAdminFromCookies(): Promise<{ username: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null

  const payload = await verifyAdminJWT(token)
  if (!payload) return null

  return { username: payload.username }
}
