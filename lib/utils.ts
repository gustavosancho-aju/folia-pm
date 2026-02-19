import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Sem prazo'
  const date = new Date(deadline)
  if (isToday(date)) return 'Hoje'
  if (isTomorrow(date)) return 'Amanhã'
  return format(date, "d 'de' MMM", { locale: ptBR })
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false
  return isPast(new Date(deadline))
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return '#10b981'
  if (progress >= 50) return '#3b82f6'
  if (progress >= 25) return '#f59e0b'
  return '#ef4444'
}
