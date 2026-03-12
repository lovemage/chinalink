import clsx from 'clsx'

interface MaterialSymbolProps {
  name: string
  className?: string
  filled?: boolean
  ariaHidden?: boolean
}

export function MaterialSymbol({
  name,
  className,
  filled = false,
  ariaHidden = true,
}: MaterialSymbolProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={clsx('material-symbols-outlined select-none leading-none', className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 48`,
      }}
    >
      {name}
    </span>
  )
}
