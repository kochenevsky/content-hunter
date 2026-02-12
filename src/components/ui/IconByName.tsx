'use client'

import { Video } from 'lucide-react'
import { getIcon } from '@/lib/icon-map'

type Props = {
  name: string | null | undefined
  className?: string
}

export function IconByName({ name, className }: Props) {
  const Icon = name ? getIcon(name) : null
  const Component = Icon ?? Video
  return <Component className={className} />
}
