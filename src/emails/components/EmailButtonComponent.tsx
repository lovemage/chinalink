import { Button } from '@react-email/components'

interface EmailButtonProps {
  text: string
  url: string
}

export function EmailButtonComponent({ text, url }: EmailButtonProps) {
  return (
    <Button style={buttonStyle} href={url}>
      {text}
    </Button>
  )
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#F97316',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center' as const,
}
