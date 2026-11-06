import React from 'react'
import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { FloatingAiChat } from '@/components/ai/FloatingAiChat'
import './styles.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  variable: '--font-noto-serif',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chinalink.tw'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  description: '懂陸姐是 Tina 的個人專欄，寫大陸電商、零售消費、產業供應鏈與新媒體的第一線觀察。',
  title: '懂陸姐 ChinaLink',
  openGraph: {
    siteName: '懂陸姐 ChinaLink',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${notoSerifTC.variable}`}>
      <body className="flex min-h-screen flex-col bg-brand-bg font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <FloatingAiChat />
        </AuthProvider>
      </body>
    </html>
  )
}
