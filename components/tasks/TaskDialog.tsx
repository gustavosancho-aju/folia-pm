'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema, type CreateTaskInput } from '@/lib/validations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TASK_STATUS_LABELS,
  PRIORITY_LABELS,
} from '@/lib/constants'
import type { Task, TaskStatus } from '@/types/database.types'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processId: string
  initialStatus?: TaskStatus
  initialData?: Task | null
  onSubmit: (data: CreateTaskInput) => Promise<void>
  isLoading?: boolean
}

export function TaskDialog({
  open,
  onOpenChange,
  processId,
  initialStatus = 'todo',
  initialData,
  onSubmit,
  isLoading,
}: TaskDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      process_id: processId,
      title: '',
      description: '',
      status: initialStatus,
      priority: 'medium',
      assignee: '',
      order_index: 0,
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          process_id: initialData.process_id,
          title: initialData.title,
          description: initialData.description ?? '',
          status: initialData.status,
          priority: initialData.priority,
          assignee: initialData.assignee ?? '',
          deadline: initialData.deadline
            ? new Date(initialData.deadline).toISOString().slice(0, 16)
            : undefined,
          order_index: initialData.order_index,
        })
      } else {
        reset({
          process_id: processId,
          title: '',
          description: '',
          status: initialStatus,
          priority: 'medium',
          assignee: '',
          order_index: 0,
        })
      }
    }
  }, [open, initialData, initialStatus, processId, reset])

  const title = initialData ? 'Editar Tarefa' : 'Nova Tarefa'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('process_id')} />

          <div className="space-y-1">
            <Label htmlFor="task-title">Título *</Label>
            <Input
              id="task-title"
              placeholder="Descreva a tarefa..."
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="task-desc">Descrição</Label>
            <Textarea
              id="task-desc"
              placeholder="Detalhes adicionais..."
              rows={2}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                defaultValue={initialData?.status ?? initialStatus}
                onValueChange={(v) => setValue('status', v as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Prioridade</Label>
              <Select
                defaultValue={initialData?.priority ?? 'medium'}
                onValueChange={(v) => setValue('priority', v as CreateTaskInput['priority'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="task-assignee">Responsável</Label>
              <Input
                id="task-assignee"
                placeholder="Nome..."
                {...register('assignee')}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="task-deadline">Prazo</Label>
              <Input
                id="task-deadline"
                type="datetime-local"
                {...register('deadline')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : initialData ? 'Salvar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
