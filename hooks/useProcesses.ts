'use client'

import { useEffect } from 'react'
import { useProcessStore } from '@/stores/processStore'

export function useProcesses() {
  const store = useProcessStore()

  useEffect(() => {
    store.fetchProcesses()
    store.fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return store
}
