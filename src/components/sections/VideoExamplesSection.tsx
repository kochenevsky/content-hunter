'use client'

import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { InstagramEmbed } from '@/components/ui/InstagramEmbed'
import { VimeoEmbed } from '@/components/ui/VimeoEmbed'
import { Instagram, Youtube, Video } from 'lucide-react'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'

const DEFAULT_EXAMPLES = [
  { client: 'Витаминная крышка Booster Cap', format: 'Распаковка и обзорные ролики', instagram: [{ id: 'DSup4OVjRYf', label: 'Reel 1' }, { id: 'DTaSfgqDRdy', label: 'Reel 2' }], youtube: [{ id: 'gLKgolZi_do', label: 'Shorts 1' }, { id: '_KbGGubr6_Q', label: 'Shorts 2' }], vimeo: [] as { id: string; label: string }[] },
  { client: 'Бренд одежды Relisme', format: 'Распаковка и обзорные ролики', instagram: [{ id: 'DTdG-HzAtTV', label: 'Reel 1' }], youtube: [{ id: 'BRA7KSecCYQ', label: 'Shorts 1' }], vimeo: [] as { id: string; label: string }[] },
  { client: 'Агентство недвижимости, Санкт-Петербург', format: 'Обзорные и продающие ролики', instagram: [], youtube: [], vimeo: [] as { id: string; label: string }[] },
  { client: 'Клиника, Дубай', format: 'Обзорные и продающие ролики', instagram: [], youtube: [], vimeo: [] as { id: string; label: string }[] },
  { client: 'Ресторан, Дубай', format: 'Обзорные и продающие ролики', instagram: [], youtube: [], vimeo: [] as { id: string; label: string }[] },
]

export type VideoExamplesSectionProps = {
  title?: string | null
  subtitle?: string | null
  items?: Array<{
    client?: string
    format?: string
    instagramIds?: Array<{ id?: string; label?: string }>
    youtubeIds?: Array<{ id?: string; label?: string }>
    vimeoIds?: Array<{ id?: string; label?: string }>
  }> | null
}

export function VideoExamplesSection({ title, subtitle, items }: VideoExamplesSectionProps = {}) {
  const examples = items?.length ? items.map(p => ({
    client: p.client || '',
    format: p.format || '',
    instagram: (p.instagramIds || []).map(i => ({ id: i.id || '', label: i.label || '' })).filter(i => i.id),
    youtube: (p.youtubeIds || []).map(i => ({ id: i.id || '', label: i.label || '' })).filter(i => i.id),
    vimeo: (p.vimeoIds || []).map(i => ({ id: i.id || '', label: i.label || '' })).filter(i => i.id),
  })).filter(p => p.instagram.length || p.youtube.length || p.vimeo.length) : DEFAULT_EXAMPLES
  return (
    <section id="video-examples" className="section bg-neutral-50">
      <div className="container">
        <FadeInView direction="up" className="text-center mb-10 md:mb-16 px-2 sm:px-0">
          <h2 className="heading-2 text-neutral-900 mb-4">
            {title || 'Примеры работ'}
          </h2>
          <p className="text-lead max-w-2xl mx-auto text-neutral-600">
            {subtitle || 'Реальные ролики наших клиентов. Vimeo доступен в РФ.'}
          </p>
        </FadeInView>

        <div className="space-y-12 md:space-y-20">
          {examples.map((project, projectIndex) => (
            <FadeInView key={projectIndex} direction="up" delay={projectIndex * 0.05}>
              <div className="mb-4 md:mb-8 px-2 sm:px-0">
                <h3 className="text-lg sm:text-xl md:heading-3 text-neutral-900 mb-1 font-semibold md:font-bold">
                  {project.client}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm">{project.format}</p>
              </div>

              <StaggerContainer stagger={0.1} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {project.instagram.map((reel) => (
                  <StaggerItem key={reel.id} direction="up">
                    <div className="space-y-1 sm:space-y-2 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-500 text-xs sm:text-sm truncate">
                        <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Reels</span>
                      </div>
                      <InstagramEmbed reelId={reel.id} title={`${project.client} — ${reel.label}`} />
                    </div>
                  </StaggerItem>
                ))}
                {project.youtube.map((short) => (
                  <StaggerItem key={short.id} direction="up">
                    <div className="space-y-1 sm:space-y-2 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-500 text-xs sm:text-sm truncate">
                        <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Shorts</span>
                      </div>
                      <YouTubeEmbed videoId={short.id} title={`${project.client} — ${short.label}`} />
                    </div>
                  </StaggerItem>
                ))}
                {project.vimeo?.map((v) => (
                  <StaggerItem key={v.id} direction="up">
                    <div className="space-y-1 sm:space-y-2 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-500 text-xs sm:text-sm truncate">
                        <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">Vimeo</span>
                      </div>
                      <VimeoEmbed videoId={v.id} title={`${project.client} — ${v.label}`} />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
