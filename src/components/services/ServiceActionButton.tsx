interface ServiceActionButtonProps {
  serviceId: number
  cartEnabled: boolean
  lineUrl: string
  variant?: 'card' | 'detail'
}

const LineSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108a.63.63 0 0 1 .63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 1.261V8.108a.631.631 0 0 0-1.261 0v3.016zm-1.783-3.646a.63.63 0 0 0-1.179.319v1.89l-2.063-2.46a.63.63 0 0 0-.483-.25h-.058a.63.63 0 0 0-.63.63v3.647a.63.63 0 0 0 1.261 0V9.274l2.071 2.47a.63.63 0 0 0 .484.248h.057a.63.63 0 0 0 .63-.63V8.108a.63.63 0 0 0-.09-.63zM8.87 11.124H7.115V8.108a.63.63 0 0 0-1.26 0v3.646a.63.63 0 0 0 .63.63H8.87c.349 0 .63-.286.63-.63 0-.345-.281-.63-.63-.63zM24 10.304C24 4.615 18.617.305 12 .305S0 4.615 0 10.304c0 4.942 4.383 9.08 10.305 9.862.402.087.948.265 1.086.608.124.31.081.795.04 1.11l-.175 1.048c-.054.313-.249 1.226 1.074.668 1.323-.558 7.148-4.21 9.753-7.209C23.395 14.905 24 12.726 24 10.304" />
  </svg>
)

export function ServiceActionButton({
  lineUrl,
  variant = 'card',
}: ServiceActionButtonProps) {
  if (!lineUrl) return null

  const isCard = variant === 'card'
  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={
        isCard
          ? 'inline-flex items-center gap-1.5 rounded-full bg-brand-cta/10 px-4 py-2 text-sm font-medium text-brand-cta transition-all duration-200 hover:bg-brand-cta hover:text-white active:scale-95'
          : 'mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-cta px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-cta/90 active:scale-[0.98]'
      }
    >
      <LineSvg className="h-4 w-4" />
      加入官方 LINE 了解
    </a>
  )
}
