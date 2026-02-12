import {
  TrendingDown,
  Clock,
  AlertTriangle,
  Target,
  FileText,
  Video,
  Scissors,
  Share2,
  BarChart3,
  ShoppingBag,
  GraduationCap,
  User,
  Utensils,
  Sparkles,
  Plane,
  Building2,
  Stethoscope,
  Zap,
  TrendingUp,
  Globe,
  Users,
  Repeat,
  ArrowRight,
  Check,
  X,
  MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  TrendingDown,
  Clock,
  AlertTriangle,
  Target,
  FileText,
  Video,
  Scissors,
  Share2,
  BarChart3,
  ShoppingBag,
  GraduationCap,
  User,
  Utensils,
  Sparkles,
  Plane,
  Building2,
  Stethoscope,
  Zap,
  TrendingUp,
  Globe,
  Users,
  Repeat,
  ArrowRight,
  Check,
  X,
  MapPin,
}

export function getIcon(name: string | null | undefined): LucideIcon | null {
  if (!name || typeof name !== 'string') return null
  const icon = iconMap[name.trim()]
  return icon ?? null
}
