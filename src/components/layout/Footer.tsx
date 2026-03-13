import Link from 'next/link'
import Image from 'next/image'

const quickLinks = [
  { label: '服務項目', href: '/services' },
  { label: '商品專區', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: '關於懂陸姐', href: '/about' },
  { label: '聯繫我們', href: '/contact' },
  { label: '隱私權政策', href: '/privacy-policy' },
  { label: '服務條款', href: '/terms-of-service' },
]

export function Footer() {
  return (
    <footer className="bg-brand-text text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand info */}
          <div>
            <div className="relative h-[123px] w-[220px]">
              <Image src="/chinalink_logo_916.webp" alt="懂陸姐 ChinaLink" fill sizes="220px" className="object-contain object-left" />
            </div>
            <p className="mt-2 text-sm text-white/70">
              台灣人在大陸生活經商，找懂陸姐就對了。
              提供專業的台商顧問服務與實用資訊。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              快速連結
            </h4>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              聯絡方式
            </h4>
            <ul className="mt-3 space-y-3 text-sm text-white/70">
              <li>
                <span className="font-medium text-white/90">Line ID：</span>
                misstinachen
              </li>
              <li>
                <span className="font-medium text-white/90">微信 ID：</span>
                tod324
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>&copy; {new Date().getFullYear()} 懂陸姐 ChinaLink. All rights reserved.</span>
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              隱私權政策
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-white">
              服務條款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
