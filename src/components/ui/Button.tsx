'use client'

import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useUtmLink } from '@/hooks/useUtmLink'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // PRIMARY — зелёный градиент как в примере
        primary: 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white shadow-lg shadow-[#22c55e]/30 hover:shadow-xl',
        // SECONDARY — тёмный с рамкой
        secondary: 'bg-[#1e293b] hover:bg-[#334155] text-white border border-[#334155] hover:border-[#475569]',
        // OUTLINE — прозрачный с зелёной рамкой при наведении
        outline: 'border border-[#334155] hover:border-[#22c55e] text-[#cbd5e1] hover:text-[#4ade80] bg-transparent',
        // GHOST — только текст с подсветкой
        ghost: 'text-[#94a3b8] hover:text-[#4ade80] bg-transparent hover:bg-[rgba(34,197,94,0.1)]',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
  children: React.ReactNode
}

/** Определяет внешнюю ссылку (http/https или //...) */
function isExternal(href: string) {
  return /^https?:\/\//.test(href) || href.startsWith('//')
}

function ButtonLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const utmHref = useUtmLink(href)
  const external = isExternal(href)

  if (external) {
    return (
      <a href={utmHref} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (href) {
    return (
      <ButtonLink href={href} className={classes}>
        {children}
      </ButtonLink>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
