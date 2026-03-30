interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

function detectVariant(status: string): StatusBadgeProps['variant'] {
  const s = status.toLowerCase()
  if (['published', 'paid', 'completed', 'active'].includes(s)) return 'success'
  if (['draft', 'pending'].includes(s)) return 'warning'
  if (['failed', 'expired', 'closed'].includes(s)) return 'danger'
  if (['new', 'contacted', 'quoted'].includes(s)) return 'info'
  return 'default'
}

const variantClasses: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant ?? detectVariant(status)
  const classes = variantClasses[resolvedVariant]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  )
}
