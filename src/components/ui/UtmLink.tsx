'use client'

import { AnchorHTMLAttributes, ReactNode } from 'react'
import { useUtmLink } from '@/hooks/useUtmLink'

export type UtmLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  /** Целевой URL — UTM-метки текущей страницы будут автоматически добавлены */
  href: string
  children: ReactNode
}

/**
 * Универсальная ссылка с автоматической передачей UTM-меток.
 *
 * Использование — просто замените <a href="..."> или <Link href="..."> на <UtmLink href="...">:
 *
 * @example
 * // Было:
 * <a href="https://sbsite.pro//ru_site_ch_1" target="_blank">Оставить заявку</a>
 *
 * // Стало:
 * <UtmLink href="https://sbsite.pro//ru_site_ch_1" target="_blank">Оставить заявку</UtmLink>
 */
export function UtmLink({ href, children, ...props }: UtmLinkProps) {
  const utmHref = useUtmLink(href)

  return (
    <a href={utmHref} {...props}>
      {children}
    </a>
  )
}
