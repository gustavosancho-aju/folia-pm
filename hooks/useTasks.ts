'use client'

import { useEffect } from 'react'
import { useTaskStore } from '@/stores/taskStore'

export function useTasks(processId: string) {
  const store = useTaskStore()

  useEffect(() => {
    if (!processId) return
    store.fetchTasks(processId)
    const cleanup = store.initRealtime(processId)
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId])

  return store
}
