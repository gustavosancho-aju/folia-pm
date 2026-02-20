import { z } from 'zod'

// ========================================
// COMPANY SCHEMAS
// ========================================

export const createCompanySchema = z.object({
  // Dados básicos
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  cnpj: z.string().regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'CNPJ inválido').optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  contact_person: z.string().max(100, 'Nome muito longo').optional(),

  // Redes sociais
  linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
  instagram_url: z.string().url('URL inválida').optional().or(z.literal('')),
  website_url: z.string().url('URL inválida').optional().or(z.literal('')),

  // Informações comerciais
  estimated_value: z.number().positive('Valor deve ser positivo').optional(),
  expected_close_date: z.string().optional(), // ISO date string
  lead_source: z.string().max(100).optional(),

  // Status e notas
  status: z.enum(['lead', 'contact', 'proposal', 'negotiation', 'closed', 'lost']),
  notes: z.string().max(1000, 'Observações muito longas').optional(),
})

export const updateCompanySchema = createCompanySchema.partial()

// ========================================
// PROCESS SCHEMAS
// ========================================

export const createProcessSchema = z.object({
  company_id: z.string().uuid('ID de empresa inválido'),
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

// ========================================
// TYPE EXPORTS
// ========================================

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
export type CreateProcessInput = z.infer<typeof createProcessSchema>
export type UpdateProcessInput = z.infer<typeof updateProcessSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>
