import React from 'react'
import { Noto_Sans_TC } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/components/auth/AuthProvider'
import './styles.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata = {
  description: '懂陸姐 - 台商大陸經營知識與顧問服務平台',
  title: '懂陸姐 ChinaLink',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-Hant" className={notoSansTC.variable}>
      <body className="flex min-h-screen flex-col bg-brand-bg">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
