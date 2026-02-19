'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { TaskColumn } from './TaskColumn'
import { TaskDialog } from './TaskDialog'
import { TASK_COLUMNS } from '@/lib/constants'
import type { Task, TaskStatus } from '@/types/database.types'
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations'
import { useTaskStore } from '@/stores/taskStore'

interface TaskBoardProps {
  processId: string
  tasks: Task[]
}

export function TaskBoard({ processId, tasks }: TaskBoardProps) {
  const { reorderTasks, createTask, updateTask } = useTaskStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')
  const [submitting, setSubmitting] = useState(false)

  const tasksByStatus = TASK_COLUMNS.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks
        .filter(t => t.status === status)
        .sort((a, b) => a.order_index - b.order_index)
      return acc
    },
    { todo: [], in_progress: [], review: [], done: [] }
  )

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result
      if (!destination) return
      if (source.droppableId === destination.droppableId && source.index === destination.index) return

      const sourceStatus = source.droppableId as TaskStatus
      const destStatus = destination.droppableId as TaskStatus

      // Build new lists
      const newBoard = { ...tasksByStatus }
      const sourceItems = [...newBoard[sourceStatus]]
      const [moved] = sourceItems.splice(source.index, 1)
      const destItems = sourceStatus === destStatus ? sourceItems : [...newBoard[destStatus]]
      destItems.splice(destination.index, 0, { ...moved, status: destStatus })

      // Build the reorder payload
      const updates: { id: string; order_index: number; status: TaskStatus }[] = []
      destItems.forEach((t, i) => updates.push({ id: t.id, order_index: i, status: destStatus }))
      if (sourceStatus !== destStatus) {
        sourceItems.forEach((t, i) => updates.push({ id: t.id, order_index: i, status: sourceStatus }))
      }

      reorderTasks(updates)
    },
    [tasksByStatus, reorderTasks]
  )

  function openAddTask(status: TaskStatus) {
    setDefaultStatus(status)
    setEditTarget(null)
    setDialogOpen(true)
  }

  function openEditTask(task: Task) {
    setEditTarget(task)
    setDialogOpen(true)
  }

  async function handleSubmit(data: CreateTaskInput) {
    setSubmitting(true)
    if (editTarget) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { process_id, ...rest } = data
      await updateTask(editTarget.id, rest as UpdateTaskInput)
    } else {
      const columnTasks = tasksByStatus[data.status as TaskStatus]
      await createTask({ ...data, order_index: columnTasks.length })
    }
    setSubmitting(false)
    setDialogOpen(false)
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {TASK_COLUMNS.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onAddTask={openAddTask}
              onEditTask={openEditTask}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        processId={processId}
        initialStatus={defaultStatus}
        initialData={editTarget}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </>
  )
}
