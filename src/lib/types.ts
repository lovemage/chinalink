// Local type definitions replacing payload-types
// These types describe the shape of data stored in JSONB columns (post content blocks, etc.)

export interface MediaType {
  id: number
  url: string
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
}

// Generic Lexical rich text node shape (stored as JSONB)
export interface LexicalNode {
  root?: {
    children?: LexicalNode[]
    direction?: string | null
    format?: string
    indent?: number
    type?: string
    version?: number
  }
  type?: string
  text?: string
  format?: number
  mode?: string
  style?: string
  direction?: string | null
  indent?: number
  version?: number
  children?: LexicalNode[]
  [key: string]: unknown
}

// Post content block types
export interface HeroSectionBlockData {
  blockType: 'hero-section'
  id?: string | null
  blockName?: string | null
  heading: string
  subheading?: string | null
  backgroundImage?: number | MediaType | null
}

export interface RichTextBlockData {
  blockType: 'rich-text'
  id?: string | null
  blockName?: string | null
  content?: LexicalNode | null
}

export interface ImageBlockData {
  blockType: 'image'
  id?: string | null
  blockName?: string | null
  image: number | MediaType
  caption?: string | null
  alignment?: 'left' | 'center' | 'right' | 'full' | null
}

export interface ImageGalleryBlockData {
  blockType: 'image-gallery'
  id?: string | null
  blockName?: string | null
  images?: Array<{
    image: number | MediaType
    caption?: string | null
    id?: string | null
  }> | null
  layout?: 'grid' | 'carousel' | null
}

export interface CalloutBlockData {
  blockType: 'callout'
  id?: string | null
  blockName?: string | null
  type?: 'info' | 'warning' | 'tip' | null
  content?: LexicalNode | null
}

export interface QuoteBlockData {
  blockType: 'quote'
  id?: string | null
  blockName?: string | null
  text: string
  author?: string | null
}

export interface FAQBlockData {
  blockType: 'faq'
  id?: string | null
  blockName?: string | null
  items?: Array<{
    question: string
    answer?: LexicalNode | null
    id?: string | null
  }> | null
}

export interface StepGuideBlockData {
  blockType: 'step-guide'
  id?: string | null
  blockName?: string | null
  steps?: Array<{
    title: string
    description?: LexicalNode | null
    screenshot?: number | MediaType | null
    id?: string | null
  }> | null
}

export interface CTABlockData {
  blockType: 'cta'
  id?: string | null
  blockName?: string | null
  heading: string
  subheading?: string | null
  buttonText?: string | null
  buttonUrl?: string | null
}

export interface TableBlockData {
  blockType: 'table'
  id?: string | null
  blockName?: string | null
  caption?: string | null
  rows?: Array<{
    cells?: Array<{
      content?: string | null
      id?: string | null
    }> | null
    id?: string | null
  }> | null
}

export interface EmbedBlockData {
  blockType: 'embed'
  id?: string | null
  blockName?: string | null
  url: string
  caption?: string | null
}

export interface DividerBlockData {
  blockType: 'divider'
  id?: string | null
  blockName?: string | null
}

export type PostContentBlock =
  | HeroSectionBlockData
  | RichTextBlockData
  | ImageBlockData
  | ImageGalleryBlockData
  | CalloutBlockData
  | QuoteBlockData
  | FAQBlockData
  | StepGuideBlockData
  | CTABlockData
  | TableBlockData
  | EmbedBlockData
  | DividerBlockData
