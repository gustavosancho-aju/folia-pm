import { FolderKanban, Play, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { ProcessSummary } from '@/types/database.types'

interface SummaryCardsProps {
  summary: ProcessSummary | null
}

const cards = [
  {
    label: 'Total',
    key: 'total' as const,
    icon: FolderKanban,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    label: 'Ativos',
    key: 'active' as const,
    icon: Play,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    label: 'Concluídos',
    key: 'completed' as const,
    icon: CheckCircle2,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    label: 'Em Atraso',
    key: 'overdue' as const,
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
]

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, key, icon: Icon, color, bg }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">
                {summary ? summary[key] : <span className="h-7 w-8 rounded bg-muted animate-pulse inline-block" />}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
