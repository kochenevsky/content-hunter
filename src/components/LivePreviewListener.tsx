'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * Компонент для Live Preview — обновляет страницу при изменениях в админке Payload.
 * Добавляется в layout фронтенда. Работает только когда страница открыта в iframe админки.
 */
export function LivePreviewListener() {
  const router = useRouter()

  return (
    <PayloadLivePreview
      refresh={router.refresh}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || ''}
    />
  )
}
