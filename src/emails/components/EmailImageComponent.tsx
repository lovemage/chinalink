import { Img } from '@react-email/components'

interface MediaObject {
  url: string
  alt?: string
  width?: number
  height?: number
}

interface EmailImageProps {
  image: MediaObject | string
  alt?: string
}

export function EmailImageComponent({ image, alt }: EmailImageProps) {
  const imageUrl = typeof image === 'string' ? image : image.url
  const altText = alt ?? (typeof image === 'object' ? image.alt : '') ?? ''

  return (
    <Img
      src={imageUrl}
      alt={altText}
      style={imageStyle}
    />
  )
}

const imageStyle: React.CSSProperties = {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '6px',
  margin: '0 0 16px 0',
}
