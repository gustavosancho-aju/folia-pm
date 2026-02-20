'use client'

import { useEffect } from 'react'
import { useProcessStore } from '@/stores/processStore'

export function useProcesses(companyId?: string) {
  const store = useProcessStore()

  useEffect(() => {
    if (companyId) {
      // Fetch processes filtered by company
      store.fetchProcessesByCompany(companyId)
    } else {
      // Fetch all processes (for backward compatibility)
      store.fetchProcesses()
    }
    store.fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  return store
}
