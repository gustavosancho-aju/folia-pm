'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from './TaskCard'
import { TASK_STATUS_LABELS, TASK_STATUS_COLUMN_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types/database.types'

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onEditTask: (task: Task) => void
}

export function TaskColumn({ status, tasks, onAddTask, onEditTask }: TaskColumnProps) {
  return (
    <div className="flex flex-col gap-3 min-w-[260px] w-[260px]">
      {/* Column header */}
      <div className={cn('rounded-t-lg border-t-2 pt-1', TASK_STATUS_COLUMN_COLORS[status])}>
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{TASK_STATUS_LABELS[status]}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {tasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAddTask(status)}
            aria-label={`Adicionar tarefa em ${TASK_STATUS_LABELS[status]}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex flex-col gap-2 rounded-lg min-h-[200px] p-2 transition-colors',
              snapshot.isDraggingOver
                ? 'bg-accent/60'
                : 'bg-muted/30'
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={() => onAddTask(status)}
                className="flex items-center justify-center gap-1 rounded-md border border-dashed border-border py-4 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar tarefa
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
