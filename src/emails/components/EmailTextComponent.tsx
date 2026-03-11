import { Text } from '@react-email/components'

interface EmailTextProps {
  text: string
}

export function EmailTextComponent({ text }: EmailTextProps) {
  return (
    <Text style={textStyle}>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </Text>
  )
}

const textStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}
