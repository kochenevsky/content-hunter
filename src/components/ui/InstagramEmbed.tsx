'use client'

type InstagramEmbedProps = {
  /** Код рилса из URL: instagram.com/reel/CODE/ → CODE */
  reelId: string
  title?: string
  className?: string
}

export function InstagramEmbed({ reelId, title = 'Instagram Reels', className = '' }: InstagramEmbedProps) {
  const embedUrl = `https://www.instagram.com/reel/${reelId}/embed/`
  const permalink = `https://www.instagram.com/reel/${reelId}/`

  return (
    <div className={`aspect-[9/16] w-full max-h-[320px] sm:max-h-[400px] md:max-h-[500px] overflow-hidden rounded-lg sm:rounded-xl bg-neutral-100 ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
      <p className="sr-only">
        <a href={permalink} target="_blank" rel="noopener noreferrer">
          Смотреть в Instagram
        </a>
      </p>
    </div>
  )
}
