'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react'
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
import { formatRelativeTime } from '@/lib/utils'
import type { ProcessWithTaskCounts } from '@/types/database.types'
import { useProcessStore } from '@/stores/processStore'

type SortKey = 'title' | 'status' | 'progress' | 'deadline' | 'created_at'
type SortDir = 'asc' | 'desc'

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
  return sortDir === 'asc'
    ? <ArrowUp className="ml-1 h-3.5 w-3.5" />
    : <ArrowDown className="ml-1 h-3.5 w-3.5" />
}

interface ProcessTableProps {
  processes: ProcessWithTaskCounts[]
  onEdit?: (process: ProcessWithTaskCounts) => void
}

export function ProcessTable({ processes, onEdit }: ProcessTableProps) {
  const { deleteProcess } = useProcessStore()
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...processes].sort((a, b) => {
      let va: string | number = a[sortKey] ?? ''
      let vb: string | number = b[sortKey] ?? ''
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [processes, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium">
                <button
                  className="flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort('title')}
                >
                  Processo <SortIcon col="title" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  className="flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort('status')}
                >
                  Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  className="flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort('progress')}
                >
                  Progresso <SortIcon col="progress" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tarefas</th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  className="flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort('deadline')}
                >
                  Prazo <SortIcon col="deadline" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  className="flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleSort('created_at')}
                >
                  Criado <SortIcon col="created_at" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((process) => (
              <tr key={process.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: process.color }}
                    />
                    <Link
                      href={`/processes/${process.id}`}
                      className="font-medium hover:underline"
                    >
                      {process.title}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={PROCESS_STATUS_COLORS[process.status]} variant="outline">
                    {PROCESS_STATUS_LABELS[process.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <ProgressBar value={process.progress} className="flex-1" />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {process.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {process.done_count}/{process.total_tasks}
                </td>
                <td className="px-4 py-3">
                  <DeadlineBadge deadline={process.deadline} />
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {formatRelativeTime(process.created_at)}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
