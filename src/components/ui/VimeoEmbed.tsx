'use client'

type VimeoEmbedProps = {
  /** ID видео (из URL vimeo.com/123456789) */
  videoId: string
  title?: string
  className?: string
}

export function VimeoEmbed({ videoId, title = 'Vimeo', className = '' }: VimeoEmbedProps) {
  return (
    <div className={`aspect-[9/16] w-full max-h-[320px] sm:max-h-[400px] md:max-h-[500px] overflow-hidden rounded-lg sm:rounded-xl bg-neutral-900 ${className}`}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
