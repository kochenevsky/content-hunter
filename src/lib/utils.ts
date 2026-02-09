import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'М'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

export function formatCurrency(amount: number, currency: 'RUB' | 'USD' | 'EUR' = 'RUB'): string {
  const symbols = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  }
  
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + 'М ' + symbols[currency]
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K ' + symbols[currency]
  }
  return amount.toLocaleString('ru-RU') + ' ' + symbols[currency]
}
