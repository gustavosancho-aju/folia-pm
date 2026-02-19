'use client'

import { LayoutList, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useViewToggle } from '@/hooks/useViewToggle'

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewToggle()

  return (
    <div className="flex items-center rounded-lg border border-border p-1">
      <Button
        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => setViewMode('table')}
        aria-label="Visualização em tabela"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
        size="sm"
        className="h-7 px-2"
        onClick={() => setViewMode('kanban')}
        aria-label="Visualização kanban"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  )
}
