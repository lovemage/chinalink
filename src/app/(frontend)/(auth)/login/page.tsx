import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LoginButtons } from '@/components/auth/LoginButtons'

export const metadata = {
  title: '登入 - 懂陸姐',
  description: '登入懂陸姐帳號',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-brand-bg px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand-primary">登入懂陸姐</CardTitle>
          <CardDescription>使用以下方式快速登入</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButtons />
        </CardContent>
      </Card>
    </div>
  )
}
