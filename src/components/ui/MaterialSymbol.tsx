import clsx from 'clsx'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import {
  BadgeCheck,
  CircleHelp,
  Headset,
  Megaphone,
  PackageSearch,
  Store,
  ListChecks,
} from 'lucide-react'

interface MaterialSymbolProps {
  name: string
  className?: string
  filled?: boolean
  ariaHidden?: boolean
}

const iconMap: Record<string, ComponentType<LucideProps>> = {
  badge: BadgeCheck,
  support_agent: Headset,
  inventory_2: PackageSearch,
  storefront: Store,
  campaign: Megaphone,
  checklist: ListChecks,
}

export function MaterialSymbol({
  name,
  className,
  filled = false,
  ariaHidden = true,
}: MaterialSymbolProps) {
  const Icon = iconMap[name] || CircleHelp

  return (
    <Icon
      aria-hidden={ariaHidden}
      className={clsx('inline-block', className)}
      strokeWidth={filled ? 2.4 : 2}
    />
  )
}
