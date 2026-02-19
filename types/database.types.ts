export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProcessStatus = 'active' | 'paused' | 'completed'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface ProcessCategory {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Process {
  id: string
  title: string
  description: string | null
  status: ProcessStatus
  progress: number
  color: string
  deadline: string | null
  category_id: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  process_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assignee: string | null
  deadline: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface ProcessWithTaskCounts extends Process {
  total_tasks: number
  todo_count: number
  in_progress_count: number
  review_count: number
  done_count: number
}

export interface ProcessSummary {
  total: number
  active: number
  completed: number
  overdue: number
}

export interface Database {
  public: {
    Tables: {
      processes: {
        Row: Process
        Insert: Omit<Process, 'id' | 'created_at' | 'updated_at' | 'progress'> & {
          id?: string
          progress?: number
        }
        Update: Partial<Omit<Process, 'id' | 'created_at'>>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Task, 'id' | 'created_at'>>
      }
      process_categories: {
        Row: ProcessCategory
        Insert: Omit<ProcessCategory, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<ProcessCategory, 'id' | 'created_at'>>
      }
    }
    Views: {
      process_summary: {
        Row: ProcessSummary
      }
      processes_with_task_counts: {
        Row: ProcessWithTaskCounts
      }
    }
  }
}
