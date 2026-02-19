'use client'

import Link from 'next/link'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { DeadlineBadge } from '@/components/shared/DeadlineBadge'
import { getProgressColor } from '@/lib/utils'
import type { ProcessWithTaskCounts } from '@/types/database.types'

interface ProcessProgressRingProps {
  process: ProcessWithTaskCounts
}

export function ProcessProgressRing({ process }: ProcessProgressRingProps) {
  const chartData = [{ value: process.progress, fill: getProgressColor(process.progress) }]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="65%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  cornerRadius={8}
                  angleAxisId={0}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold leading-none">{process.progress}%</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/processes/${process.id}`}
              className="font-medium text-sm hover:underline line-clamp-1"
            >
              {process.title}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">
              {process.done_count}/{process.total_tasks} tarefas
            </p>
            <div className="mt-2">
              <ProgressBar value={process.progress} />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: process.color }}
              />
              <DeadlineBadge deadline={process.deadline} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
