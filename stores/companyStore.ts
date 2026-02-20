'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Company, CompanyWithStats, CompanyStatus } from '@/types/database.types'
import type { CreateCompanyInput, UpdateCompanyInput } from '@/lib/validations'

interface CompanyState {
  companies: CompanyWithStats[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchCompanies: () => Promise<void>
  createCompany: (data: CreateCompanyInput) => Promise<Company | null>
  updateCompany: (id: string, data: UpdateCompanyInput) => Promise<void>
  deleteCompany: (id: string) => Promise<void>
  updateCompanyStatus: (id: string, status: CompanyStatus) => Promise<void>
  initRealtime: () => () => void
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null })
    const res = await fetch('/api/companies')
    if (!res.ok) {
      set({ error: 'Falha ao carregar empresas', isLoading: false })
      return
    }
    const data = await res.json()
    set({ companies: data, isLoading: false })
  },

  createCompany: async (input) => {
    // Optimistic update
    const optimistic: CompanyWithStats = {
      id: crypto.randomUUID(),
      name: input.name,
      cnpj: input.cnpj ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      contact_person: input.contact_person ?? null,
      linkedin_url: input.linkedin_url ?? null,
      instagram_url: input.instagram_url ?? null,
      website_url: input.website_url ?? null,
      estimated_value: input.estimated_value ?? null,
      expected_close_date: input.expected_close_date ?? null,
      lead_source: input.lead_source ?? null,
      status: input.status,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_processes: 0,
      completed_processes: 0,
      active_processes: 0,
      avg_progress: 0,
      last_activity: null,
    }

    set(s => ({ companies: [optimistic, ...s.companies] }))

    const res = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!res.ok) {
      // Revert optimistic update
      set(s => ({
        companies: s.companies.filter(c => c.id !== optimistic.id),
        error: 'Erro ao criar empresa'
      }))
      return null
    }

    const created = await res.json()
    set(s => ({
      companies: s.companies.map(c =>
        c.id === optimistic.id ? { ...optimistic, id: created.id } : c
      )
    }))
    return created
  },

  updateCompany: async (id, data) => {
    const res = await fetch(`/api/companies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      set({ error: 'Erro ao atualizar empresa' })
      return
    }

    await get().fetchCompanies()
  },

  deleteCompany: async (id) => {
    const prev = get().companies
    set(s => ({ companies: s.companies.filter(c => c.id !== id) }))

    const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      set({ companies: prev, error: 'Erro ao deletar empresa' })
    }
  },

  updateCompanyStatus: async (id, status) => {
    // Optimistic update for drag-and-drop
    const prev = get().companies
    set(s => ({
      companies: s.companies.map(c =>
        c.id === id ? { ...c, status } : c
      )
    }))

    const res = await fetch(`/api/companies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      // Revert on error
      set({ companies: prev, error: 'Erro ao atualizar status' })
    }
  },

  initRealtime: () => {
    const supabase = createClient()
    const channel = supabase
      .channel('companies-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => {
        get().fetchCompanies()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))
