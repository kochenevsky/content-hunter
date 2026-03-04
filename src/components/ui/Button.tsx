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
        primary: 'bg-primary-500 hover:bg-primary-600 text-white',
        secondary: 'bg-neutral-900 hover:bg-neutral-800 text-white',
        outline: 'border border-neutral-300 hover:border-neutral-400 text-neutral-900 bg-transparent',
        ghost: 'text-neutral-600 hover:text-neutral-900 bg-transparent',
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
