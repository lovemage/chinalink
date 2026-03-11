import { Text } from '@react-email/components'

interface EmailFooterProps {
  text?: string
}

export function EmailFooterComponent({ text }: EmailFooterProps) {
  if (!text) return null

  return (
    <Text style={footerStyle}>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </Text>
  )
}

const footerStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '16px 0 0 0',
  textAlign: 'center' as const,
}
