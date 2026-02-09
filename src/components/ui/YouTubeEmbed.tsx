'use client'

type YouTubeEmbedProps = {
  /** ID видео (из URL shorts или watch: gLKgolZi_do) */
  videoId: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ videoId, title = 'YouTube Shorts', className = '' }: YouTubeEmbedProps) {
  return (
    <div className={`aspect-[9/16] w-full max-h-[320px] sm:max-h-[400px] md:max-h-[500px] overflow-hidden rounded-lg sm:rounded-xl bg-neutral-900 ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
