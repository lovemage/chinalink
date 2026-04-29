'use client'

interface HeroConsultButtonProps {
  className: string
  children: React.ReactNode
}

export function HeroConsultButton({ className, children }: HeroConsultButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('linkai:open'))
      }}
      className={className}
    >
      {children}
    </button>
  )
}
