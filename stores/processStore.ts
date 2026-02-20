'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { ProcessWithTaskCounts, ProcessSummary, ProcessStatus } from '@/types/database.types'
import type { CreateProcessInput, UpdateProcessInput } from '@/lib/validations'

interface ProcessState {
  processes: ProcessWithTaskCounts[]
  summary: ProcessSummary | null
  isLoading: boolean
  error: string | null
  viewMode: 'table' | 'kanban'
  activeCompanyId: string | null

  // Actions
  setViewMode: (mode: 'table' | 'kanban') => void
  fetchProcesses: () => Promise<void>
  fetchProcessesByCompany: (companyId: string) => Promise<void>
  fetchSummary: () => Promise<void>
  createProcess: (data: CreateProcessInput) => Promise<ProcessWithTaskCounts | null>
  updateProcess: (id: string, data: UpdateProcessInput) => Promise<void>
  deleteProcess: (id: string) => Promise<void>
  initRealtime: () => () => void
}

export const useProcessStore = create<ProcessState>((set, get) => ({
  processes: [],
  summary: null,
  isLoading: false,
  error: null,
  viewMode: 'table',
  activeCompanyId: null,

  setViewMode: (mode) => set({ viewMode: mode }),

  fetchProcesses: async () => {
    set({ isLoading: true, error: null })
    const res = await fetch('/api/processes')
    if (!res.ok) {
      set({ error: 'Falha ao carregar processos', isLoading: false })
      return
    }
    const data = await res.json()
    set({ processes: data, isLoading: false })
  },

  fetchProcessesByCompany: async (companyId: string) => {
    set({ isLoading: true, error: null, activeCompanyId: companyId })
    const supabase = createClient()

    const { data, error } = await supabase
      .from('processes_with_task_counts')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: 'Erro ao carregar processos', isLoading: false })
      return
    }

    set({ processes: data || [], isLoading: false })
  },

  fetchSummary: async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('process_summary')
      .select('*')
      .single()
    if (!error && data) {
      set({ summary: data as ProcessSummary })
    }
  },

  createProcess: async (input) => {
    const optimistic: ProcessWithTaskCounts = {
      id: crypto.randomUUID(),
      company_id: input.company_id,
      title: input.title,
      description: input.description ?? null,
      status: (input.status ?? 'active') as ProcessStatus,
      progress: 0,
      color: input.color ?? '#6366f1',
      deadline: input.deadline ?? null,
      category_id: input.category_id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_tasks: 0,
      todo_count: 0,
      in_progress_count: 0,
      review_count: 0,
      done_count: 0,
    }

    set(s => ({ processes: [optimistic, ...s.processes] }))

    const res = await fetch('/api/processes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!res.ok) {
      // Revert optimistic update
      set(s => ({ processes: s.processes.filter(p => p.id !== optimistic.id) }))
      return null
    }

    const created = await res.json()
    set(s => ({
      processes: s.processes.map(p => p.id === optimistic.id ? { ...created, total_tasks: 0, todo_count: 0, in_progress_count: 0, review_count: 0, done_count: 0 } : p)
    }))
    return created
  },

  updateProcess: async (id, data) => {
    // Optimistic update
    set(s => ({
      processes: s.processes.map(p => p.id === id ? { ...p, ...data } : p)
    }))

    const res = await fetch(`/api/processes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      // Revert by re-fetching with correct scope
      const companyId = get().activeCompanyId
      if (companyId) {
        get().fetchProcessesByCompany(companyId)
      } else {
        get().fetchProcesses()
      }
    }
  },

  deleteProcess: async (id) => {
    const prev = get().processes
    set(s => ({ processes: s.processes.filter(p => p.id !== id) }))

    const res = await fetch(`/api/processes/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      set({ processes: prev })
    }
  },

  initRealtime: () => {
    const supabase = createClient()
    const channel = supabase
      .channel('processes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'processes' }, () => {
        const companyId = get().activeCompanyId
        if (companyId) {
          get().fetchProcessesByCompany(companyId)
        } else {
          get().fetchProcesses()
        }
        get().fetchSummary()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        const companyId = get().activeCompanyId
        if (companyId) {
          get().fetchProcessesByCompany(companyId)
        } else {
          get().fetchProcesses()
        }
        get().fetchSummary()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))
