import { EmailHeadingComponent } from './EmailHeadingComponent'
import { EmailTextComponent } from './EmailTextComponent'
import { EmailButtonComponent } from './EmailButtonComponent'
import { EmailImageComponent } from './EmailImageComponent'
import { EmailOrderSummaryComponent } from './EmailOrderSummaryComponent'
import { EmailDividerComponent } from './EmailDividerComponent'
import { EmailFooterComponent } from './EmailFooterComponent'
import type { EmailBlock } from '../types'

interface EmailBlockRendererProps {
  blocks: EmailBlock[]
  variables?: Record<string, string>
}

export function EmailBlockRenderer({ blocks, variables = {} }: EmailBlockRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? `block-${index}`

        switch (block.blockType) {
          case 'email-heading':
            return (
              <EmailHeadingComponent
                key={key}
                text={block.text ?? ''}
                level={block.level}
              />
            )
          case 'email-text':
            return <EmailTextComponent key={key} text={block.text ?? ''} />
          case 'email-button':
            return (
              <EmailButtonComponent
                key={key}
                text={block.text ?? ''}
                url={block.url ?? '#'}
              />
            )
          case 'email-image':
            return (
              <EmailImageComponent
                key={key}
                image={block.image ?? { url: '' }}
                alt={block.alt}
              />
            )
          case 'email-order-summary':
            return (
              <EmailOrderSummaryComponent
                key={key}
                orderNumber={variables.orderNumber}
                serviceName={variables.serviceName}
                amount={variables.amount}
                paymentStatus={variables.paymentStatus}
                paymentMethod={variables.paymentMethod}
              />
            )
          case 'email-divider':
            return <EmailDividerComponent key={key} />
          case 'email-footer':
            return <EmailFooterComponent key={key} text={block.text} />
          default:
            return null
        }
      })}
    </>
  )
}
