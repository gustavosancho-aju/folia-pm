'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import { PROCESS_STATUS_COLORS, PROCESS_STATUS_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import type { ProcessWithTaskCounts } from '@/types/database.types'
import Link from 'next/link'

interface RecentActivityProps {
  processes: ProcessWithTaskCounts[]
}

export function RecentActivity({ processes }: RecentActivityProps) {
  const recent = [...processes]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nenhuma atividade ainda
          </p>
        ) : (
          recent.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div className="min-w-0">
                  <Link
                    href={`/processes/${p.id}`}
                    className="text-sm font-medium hover:underline line-clamp-1"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(p.updated_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">{p.progress}%</span>
                <Badge className={PROCESS_STATUS_COLORS[p.status]} variant="outline">
                  {PROCESS_STATUS_LABELS[p.status]}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
