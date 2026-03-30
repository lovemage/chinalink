'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdmin, signAdminJWT } from '@/lib/auth-admin'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: '請輸入帳號及密碼' }
  }

  const valid = await verifyAdmin(username, password)
  if (!valid) {
    return { error: '帳號或密碼錯誤' }
  }

  const token = await signAdminJWT(username)
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400, // 24 hours
  })

  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/admin/login')
}
