import Link from 'next/link'

const columns = [
  {
    heading: '欄目',
    links: [
      { label: '陸姐觀點', href: '/blog' },
      { label: '供應鏈觀察', href: '/observations' },
      { label: '問題與交流', href: '/questions' },
      { label: '顧問服務', href: '/services' },
    ],
  },
  {
    heading: '文章分類',
    links: [
      { label: '電商與平台', href: '/category/ecommerce-platforms' },
      { label: '零售與消費', href: '/category/retail-consumer' },
      { label: 'To B 與產業供應鏈', href: '/category/b2b-supply-chain' },
      { label: '新媒體與流量', href: '/category/new-media-traffic' },
    ],
  },
  {
    heading: '更多',
    links: [
      { label: '供應鏈推薦', href: '/supply-chain' },
      { label: '商品專區', href: '/products' },
      { label: '購物車', href: '/service-cart' },
      { label: '關於懂陸姐', href: '/about' },
      { label: '聯絡我們', href: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-brand-deep text-brand-raised">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-2xl font-bold">懂陸姐</p>
            <p className="mt-1 text-sm text-brand-tint">ChinaLink</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-brand-tint">
              Tina 的個人專欄，寫給想看懂大陸市場的台灣讀者。
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-bold">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-brand-tint">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="text-sm font-bold">聯絡方式</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand-tint">
              <li>
                <Link
                  href="https://lin.ee/S2VgXpn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  <span >官方 LINE</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/qr/SUAOGNTNRTI2H1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span >WhatsApp</span>
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
                  <span >微信 ID：</span>
                  TwTina777
                </span>
              </li>
              <li>
                <Link
                  href="mailto:misstinachen1104@gmail.com"
                  className="inline-flex items-center gap-2 transition-colors hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>
                  <span >客服信箱</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-6 text-[13px] text-brand-tint">
          <span>&copy; {new Date().getFullYear()} 懂陸姐 ChinaLink</span>
          <Link href="/privacy-policy" className="hover:underline">
            隱私權政策
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            服務條款
          </Link>
        </div>
      </div>
    </footer>
  )
}
