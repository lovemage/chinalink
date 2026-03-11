import { Heading } from '@react-email/components'

interface EmailHeadingProps {
  text: string
  level?: 'h1' | 'h2' | 'h3'
}

const styles: Record<string, React.CSSProperties> = {
  h1: { fontSize: '28px', fontWeight: 700, color: '#1f2937', margin: '0 0 16px 0' },
  h2: { fontSize: '22px', fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0' },
  h3: { fontSize: '18px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0' },
}

export function EmailHeadingComponent({ text, level = 'h2' }: EmailHeadingProps) {
  const Tag = level
  const asMap = { h1: 'h1', h2: 'h2', h3: 'h3' } as const

  return (
    <Heading as={asMap[Tag]} style={styles[level]}>
      {text}
    </Heading>
  )
}
