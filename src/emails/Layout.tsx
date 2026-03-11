import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from '@react-email/components'
import type { ReactNode } from 'react'

interface LayoutProps {
  preview?: string
  children: ReactNode
}

export function Layout({ preview, children }: LayoutProps) {
  return (
    <Html lang="zh-TW">
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Brand Header */}
          <Section style={headerStyle}>
            <Text style={logoStyle}>懂陸姐</Text>
            <Text style={subtitleStyle}>ChinaLink</Text>
          </Section>

          <Hr style={hrStyle} />

          {/* Content */}
          <Section style={contentStyle}>{children}</Section>

          <Hr style={hrStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>懂陸姐 chinalink.com.tw</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f6f6f6',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans TC", sans-serif',
  margin: 0,
  padding: 0,
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '8px',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  backgroundColor: '#F97316',
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const logoStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 700,
  margin: '0 0 4px 0',
  lineHeight: '1.2',
}

const subtitleStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '14px',
  fontWeight: 400,
  margin: '0',
  lineHeight: '1.2',
}

const hrStyle: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '0',
}

const contentStyle: React.CSSProperties = {
  padding: '32px',
}

const footerStyle: React.CSSProperties = {
  padding: '16px 32px',
  textAlign: 'center' as const,
}

const footerTextStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
}
