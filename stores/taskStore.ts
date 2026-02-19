'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Task, TaskStatus } from '@/types/database.types'
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchTasks: (processId: string) => Promise<void>
  createTask: (data: CreateTaskInput) => Promise<Task | null>
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (tasks: { id: string; order_index: number; status: TaskStatus }[]) => Promise<void>
  initRealtime: (processId: string) => () => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (processId) => {
    set({ isLoading: true, error: null })
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('process_id', processId)
      .order('order_index', { ascending: true })

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }
    set({ tasks: data ?? [], isLoading: false })
  },

  createTask: async (input) => {
    const optimistic: Task = {
      id: crypto.randomUUID(),
      process_id: input.process_id,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      assignee: input.assignee ?? null,
      deadline: input.deadline ?? null,
      order_index: input.order_index ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    set(s => ({ tasks: [...s.tasks, optimistic] }))

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!res.ok) {
      set(s => ({ tasks: s.tasks.filter(t => t.id !== optimistic.id) }))
      return null
    }

    const created = await res.json()
    set(s => ({
      tasks: s.tasks.map(t => t.id === optimistic.id ? created : t)
    }))
    return created
  },

  updateTask: async (id, data) => {
    const prev = get().tasks
    set(s => ({
      tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t)
    }))

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      set({ tasks: prev })
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }))

    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      set({ tasks: prev })
    }
  },

  reorderTasks: async (reorderedTasks) => {
    // Optimistic: apply new positions locally
    set(s => ({
      tasks: s.tasks.map(t => {
        const reordered = reorderedTasks.find(r => r.id === t.id)
        if (reordered) return { ...t, order_index: reordered.order_index, status: reordered.status }
        return t
      })
    }))

    const res = await fetch('/api/tasks/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: reorderedTasks }),
    })

    if (!res.ok) {
      // Re-fetch on failure
      const processId = get().tasks[0]?.process_id
      if (processId) get().fetchTasks(processId)
    }
  },

  initRealtime: (processId) => {
    const supabase = createClient()
    const channel = supabase
      .channel(`tasks-${processId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `process_id=eq.${processId}`,
      }, () => {
        get().fetchTasks(processId)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))
