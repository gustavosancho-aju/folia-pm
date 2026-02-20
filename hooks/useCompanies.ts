'use client'

import { useEffect } from 'react'
import { useCompanyStore } from '@/stores/companyStore'

export function useCompanies() {
  const store = useCompanyStore()

  useEffect(() => {
    store.fetchCompanies()
    const cleanup = store.initRealtime()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return store
}
