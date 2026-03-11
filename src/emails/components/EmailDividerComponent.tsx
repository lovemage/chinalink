import { Hr } from '@react-email/components'

export function EmailDividerComponent() {
  return <Hr style={hrStyle} />
}

const hrStyle: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
}
