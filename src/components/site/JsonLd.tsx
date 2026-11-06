import { serializeJsonLd } from '@/lib/posts/structured-data'

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Serialized with "<" escaped, so content cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
