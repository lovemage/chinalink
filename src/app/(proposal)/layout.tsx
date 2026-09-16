import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import '../(frontend)/styles.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-sans',
})

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: '懂陸姐網站重新定位｜方向確認書',
  description: '懂陸姐網站重新定位方向、修改範圍與素材準備清單。',
  robots: { index: false, follow: false },
}
export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${notoSerifTC.variable}`}>
      <body className="min-h-screen bg-[#f4ecdf] font-sans antialiased">{children}</body>
    </html>
  )
}
