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
                <Link
                  href="https://lin.ee/S2VgXpn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304" />
                  </svg>
                  <span className="font-medium text-white/90">官方 LINE</span>
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.534c0 2.212 1.17 4.203 3.002 5.55a.49.49 0 0 1 .178.518l-.545 1.927a.357.357 0 0 0 .501.404l2.174-1.248a.89.89 0 0 1 .652-.078c.854.22 1.76.338 2.729.338h.006c-.034-.238-.056-.479-.056-.724 0-3.713 3.528-6.723 7.879-6.723.147 0 .291.008.436.013-.636-3.643-4.238-6.323-8.265-6.323zM6.318 7.86a.937.937 0 1 1 0-1.875.937.937 0 0 1 0 1.875zm4.746 0a.937.937 0 1 1 0-1.875.937.937 0 0 1 0 1.875z" />
                  <path d="M23.988 14.228c0-3.333-3.393-6.037-7.578-6.037-4.187 0-7.58 2.704-7.58 6.037s3.393 6.037 7.58 6.037c.947 0 1.853-.127 2.687-.351a.71.71 0 0 1 .519.063l1.727.992a.283.283 0 0 0 .399-.322l-.433-1.531a.39.39 0 0 1 .141-.411c1.502-1.1 2.538-2.734 2.538-4.477zm-10.14-1.098a.748.748 0 1 1 0-1.497.748.748 0 0 1 0 1.497zm5.122 0a.748.748 0 1 1 0-1.497.748.748 0 0 1 0 1.497z" />
                </svg>
                <span>
                  <span className="font-medium text-white/90">微信 ID：</span>
                  TwTina777
                </span>
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
