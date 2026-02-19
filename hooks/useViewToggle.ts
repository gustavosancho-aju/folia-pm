'use client'

import { useProcessStore } from '@/stores/processStore'

export function useViewToggle() {
  const { viewMode, setViewMode } = useProcessStore()
  return { viewMode, setViewMode }
}
