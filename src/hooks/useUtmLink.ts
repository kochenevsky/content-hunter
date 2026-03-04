'use client'

import { useEffect, useState } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

/**
 * Читает UTM-метки из текущего URL и прокидывает их в переданную ссылку.
 *
 * @example
 * const href = useUtmLink('https://sbsite.pro//ru_site_ch_1')
 * // Если страница открыта с ?utm_source=yandex&utm_campaign=search,
 * // вернёт: 'https://sbsite.pro//ru_site_ch_1?utm_source=yandex&utm_campaign=search'
 */
export function useUtmLink(baseUrl: string): string {
  const [href, setHref] = useState(baseUrl)

  useEffect(() => {
    const pageParams = new URLSearchParams(window.location.search)
    const utmParams = new URLSearchParams()

    UTM_KEYS.forEach((key) => {
      const val = pageParams.get(key)
      if (val) utmParams.set(key, val)
    })

    const utmString = utmParams.toString()
    if (!utmString) return

    try {
      const url = new URL(baseUrl)
      // Добавляем к уже существующим параметрам в baseUrl (не перезаписываем)
      utmParams.forEach((val, key) => {
        if (!url.searchParams.has(key)) {
          url.searchParams.set(key, val)
        }
      })
      setHref(url.toString())
    } catch {
      // Относительный URL — просто склеиваем
      const separator = baseUrl.includes('?') ? '&' : '?'
      setHref(`${baseUrl}${separator}${utmString}`)
    }
  }, [baseUrl])

  return href
}
