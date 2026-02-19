'use client'

import Link from 'next/link'
import { MoreHorizontal, Trash2, Pencil, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { DeadlineBadge } from '@/components/shared/DeadlineBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PROCESS_STATUS_COLORS, PROCESS_STATUS_LABELS } from '@/lib/constants'
import type { ProcessWithTaskCounts, ProcessStatus } from '@/types/database.types'
import { useProcessStore } from '@/stores/processStore'
import { useState } from 'react'

interface ProcessKanbanProps {
  processes: ProcessWithTaskCounts[]
  onEdit?: (process: ProcessWithTaskCounts) => void
}

const STATUS_ORDER: ProcessStatus[] = ['active', 'paused', 'completed']

export function ProcessKanban({ processes, onEdit }: ProcessKanbanProps) {
  const { deleteProcess } = useProcessStore()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const grouped = STATUS_ORDER.reduce<Record<ProcessStatus, ProcessWithTaskCounts[]>>(
    (acc, status) => {
      acc[status] = processes.filter(p => p.status === status)
      return acc
    },
    { active: [], paused: [], completed: [] }
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Badge className={PROCESS_STATUS_COLORS[status]} variant="outline">
                {PROCESS_STATUS_LABELS[status]}
              </Badge>
              <span className="text-sm text-muted-foreground">{grouped[status].length}</span>
            </div>

            <div className="flex flex-col gap-3">
              {grouped[status].map((process) => (
                <div
                  key={process.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: process.color }}
                      />
                      <Link
                        href={`/processes/${process.id}`}
                        className="font-medium text-sm hover:underline line-clamp-2"
                      >
                        {process.title}
                      </Link>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/processes/${process.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir
                          </Link>
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(process)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(process.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {process.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {process.description}
                    </p>
                  )}

                  <ProgressBar value={process.progress} showLabel className="mb-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{process.done_count}/{process.total_tasks} tarefas</span>
                    <DeadlineBadge deadline={process.deadline} />
                  </div>
                </div>
              ))}

              {grouped[status].length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="text-xs text-muted-foreground">Nenhum processo</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir processo"
        description="Esta ação é irreversível. Todas as tarefas do processo também serão excluídas."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteProcess(deleteTarget)
        }}
      />
    </>
  )
}
