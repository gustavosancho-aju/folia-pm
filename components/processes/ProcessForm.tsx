'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProcessSchema, type CreateProcessInput } from '@/lib/validations'
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
import { PROCESS_COLORS, PROCESS_STATUS_LABELS } from '@/lib/constants'
import type { Process } from '@/types/database.types'

interface ProcessFormProps {
  initialData?: Partial<Process>
  onSubmit: (data: CreateProcessInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProcessForm({ initialData, onSubmit, onCancel, isLoading }: ProcessFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProcessInput>({
    resolver: zodResolver(createProcessSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'active',
      color: initialData?.color ?? '#6366f1',
      deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : undefined,
    },
  })

  const selectedColor = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Nome do processo..."
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva o processo..."
          rows={3}
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            defaultValue={initialData?.status ?? 'active'}
            onValueChange={(v) => setValue('status', v as CreateProcessInput['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROCESS_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="deadline">Prazo</Label>
          <Input
            id="deadline"
            type="datetime-local"
            {...register('deadline')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex flex-wrap gap-2">
          {PROCESS_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className="h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{ backgroundColor: color }}
              aria-label={`Cor ${color}`}
            >
              {selectedColor === color && (
                <span className="flex h-full w-full items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Processo'}
        </Button>
      </div>
    </form>
  )
}
