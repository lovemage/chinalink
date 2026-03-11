export interface MediaObject {
  url: string
  alt?: string
}

export interface EmailBlock {
  id?: string
  blockType: string
  text?: string
  level?: 'h1' | 'h2' | 'h3'
  url?: string
  image?: MediaObject | string
  alt?: string
  note?: string
}
