import { Headset } from 'lucide-react'

interface ServiceActionButtonProps {
  serviceId: number
  cartEnabled: boolean
  lineUrl: string
  variant?: 'card' | 'detail'
}

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
          ? 'inline-flex items-center gap-1.5 rounded-full bg-[#06C755]/10 px-4 py-2 text-sm font-medium text-[#06C755] transition-all duration-200 hover:bg-[#06C755] hover:text-white active:scale-95'
          : 'mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#05b04d] active:scale-[0.98]'
      }
    >
      <Headset className="h-4 w-4" />
      諮詢服務
    </a>
  )
}
