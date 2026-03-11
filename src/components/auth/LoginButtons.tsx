'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function LoginButtons() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => signIn('line', { callbackUrl: '/' })}
        className="bg-[#06C755] hover:bg-[#06C755]/90 text-white rounded-2xl h-12"
      >
        LINE 登入
      </Button>
      <Button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        variant="outline"
        className="rounded-2xl h-12"
      >
        Google 登入
      </Button>
    </div>
  )
}
