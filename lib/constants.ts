import type { ProcessStatus, TaskStatus, TaskPriority } from '@/types/database.types'

export const PROCESS_STATUS_LABELS: Record<ProcessStatus, string> = {
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
}

export const PROCESS_STATUS_COLORS: Record<ProcessStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  in_progress: 'Em Andamento',
  review: 'Em Revisão',
  done: 'Concluído',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export const TASK_STATUS_COLUMN_COLORS: Record<TaskStatus, string> = {
  todo: 'border-slate-200 dark:border-slate-700',
  in_progress: 'border-blue-200 dark:border-blue-800',
  review: 'border-purple-200 dark:border-purple-800',
  done: 'border-green-200 dark:border-green-800',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export const TASK_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

export const PROCESS_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899',
  '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
]
