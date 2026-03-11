import { HeroSectionBlock } from './HeroSectionBlock'
import { RichTextBlock } from './RichTextBlock'
import { ImageBlockComponent } from './ImageBlockComponent'
import { ImageGalleryBlock } from './ImageGalleryBlock'
import { CalloutBlock } from './CalloutBlock'
import { QuoteBlock } from './QuoteBlock'
import { StepGuideBlock } from './StepGuideBlock'
import { FAQBlock } from './FAQBlock'
import { CTABlockComponent } from './CTABlockComponent'
import { TableBlockComponent } from './TableBlockComponent'
import { EmbedBlock } from './EmbedBlock'

/* eslint-disable @typescript-eslint/no-explicit-any */
const blockComponents: Record<string, React.ComponentType<any>> = {
  'hero-section': HeroSectionBlock,
  'rich-text': RichTextBlock,
  'image': ImageBlockComponent,
  'image-gallery': ImageGalleryBlock,
  'callout': CalloutBlock,
  'quote': QuoteBlock,
  'step-guide': StepGuideBlock,
  'faq': FAQBlock,
  'cta': CTABlockComponent,
  'table': TableBlockComponent,
  'embed': EmbedBlock,
}

interface Block {
  blockType: string
  id?: string | null
  blockName?: string | null
  [key: string]: unknown
}

interface BlockRendererProps {
  blocks?: Block[] | null
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        if (block.blockType === 'divider') {
          return <hr key={block.id || index} className="my-8 border-brand-primary/20" />
        }

        const Component = blockComponents[block.blockType]
        if (!Component) return null

        const { blockType: _blockType, id, blockName: _blockName, ...props } = block
        return <Component key={id || index} {...props} />
      })}
    </div>
  )
}
