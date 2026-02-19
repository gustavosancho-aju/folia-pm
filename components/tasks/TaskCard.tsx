'use client'

import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { MoreHorizontal, Pencil, Trash2, GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeadlineBadge } from '@/components/shared/DeadlineBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/constants'
import type { Task } from '@/types/database.types'
import { useTaskStore } from '@/stores/taskStore'

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
}

export function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const { deleteTask } = useTaskStore()
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow ${
              snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20 rotate-1' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-2">
              <div
                {...provided.dragHandleProps}
                className="mt-0.5 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1 mb-2">
                  <p className="text-sm font-medium leading-snug">{task.title}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {task.description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge className={PRIORITY_COLORS[task.priority]} variant="outline">
                    {PRIORITY_LABELS[task.priority]}
                  </Badge>
                  <DeadlineBadge deadline={task.deadline} />
                </div>

                {task.assignee && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    👤 {task.assignee}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir tarefa"
        description={`Excluir a tarefa "${task.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={() => deleteTask(task.id)}
      />
    </>
  )
}
