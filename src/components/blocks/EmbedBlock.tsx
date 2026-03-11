interface EmbedBlockProps {
  url: string
  caption?: string | null
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function EmbedBlock({ url, caption }: EmbedBlockProps) {
  const youtubeId = getYouTubeId(url)

  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-xl">
        {youtubeId ? (
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={caption || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <div className="relative aspect-video">
            <iframe
              src={url}
              title={caption || 'Embedded content'}
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-brand-muted">{caption}</figcaption>
      )}
    </figure>
  )
}
