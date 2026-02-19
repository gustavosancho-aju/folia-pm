import { cn, formatDeadline, isOverdue } from '@/lib/utils'
import { Calendar, AlertCircle } from 'lucide-react'

interface DeadlineBadgeProps {
  deadline: string | null
  className?: string
}

export function DeadlineBadge({ deadline, className }: DeadlineBadgeProps) {
  if (!deadline) return null

  const overdue = isOverdue(deadline)
  const label = formatDeadline(deadline)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        overdue
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-muted text-muted-foreground',
        className
      )}
    >
      {overdue ? (
        <AlertCircle className="h-3 w-3" />
      ) : (
        <Calendar className="h-3 w-3" />
      )}
      {label}
    </span>
  )
}
