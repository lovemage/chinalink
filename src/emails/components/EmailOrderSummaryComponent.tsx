import { Section, Text, Row, Column, Hr } from '@react-email/components'

interface EmailOrderSummaryProps {
  orderNumber?: string
  serviceName?: string
  amount?: string
  paymentStatus?: string
  paymentMethod?: string
}

export function EmailOrderSummaryComponent({
  orderNumber = '',
  serviceName = '',
  amount = '',
  paymentStatus = '',
  paymentMethod = '',
}: EmailOrderSummaryProps) {
  const rows = [
    { label: '訂單編號', value: orderNumber },
    { label: '服務名稱', value: serviceName },
    { label: '金額', value: amount },
    { label: '付款狀態', value: paymentStatus },
    { label: '付款方式', value: paymentMethod },
  ]

  return (
    <Section style={containerStyle}>
      <Text style={titleStyle}>訂單摘要</Text>
      <Hr style={hrStyle} />
      {rows.map((row) => (
        <Row key={row.label} style={rowStyle}>
          <Column style={labelStyle}>{row.label}</Column>
          <Column style={valueStyle}>{row.value}</Column>
        </Row>
      ))}
    </Section>
  )
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  padding: '16px 20px',
  margin: '0 0 16px 0',
  border: '1px solid #e5e7eb',
}

const titleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#1f2937',
  margin: '0 0 8px 0',
}

const hrStyle: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '8px 0',
}

const rowStyle: React.CSSProperties = {
  padding: '6px 0',
}

const labelStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '14px',
  width: '120px',
  verticalAlign: 'top',
}

const valueStyle: React.CSSProperties = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: 500,
  verticalAlign: 'top',
}
