import { cn } from '@/lib/utils'
import { getProgressColor } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className, showLabel = false }: ProgressBarProps) {
  const color = getProgressColor(value)
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[3ch] text-right text-xs font-medium text-muted-foreground">
          {value}%
        </span>
      )}
    </div>
  )
}
