import { z } from 'zod'

export const createProcessSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').nullable().optional(),
  status: z.enum(['active', 'paused', 'completed']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  deadline: z.string().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
})

export const updateProcessSchema = createProcessSchema.partial()

export const createTaskSchema = z.object({
  process_id: z.string().uuid('ID do processo inválido'),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignee: z.string().max(100).nullable().optional(),
  deadline: z.string().nullable().optional(),
  order_index: z.number().int().min(0),
})

export const updateTaskSchema = createTaskSchema.omit({ process_id: true }).partial()

export const reorderTasksSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string().uuid(),
      order_index: z.number().int().min(0),
      status: z.enum(['todo', 'in_progress', 'review', 'done']),
    })
  ),
})

export type CreateProcessInput = z.infer<typeof createProcessSchema>
export type UpdateProcessInput = z.infer<typeof updateProcessSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>
