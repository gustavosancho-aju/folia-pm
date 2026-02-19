'use client'

import { useState } from 'react'
import { Plus, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProcessTable } from '@/components/processes/ProcessTable'
import { ProcessKanban } from '@/components/processes/ProcessKanban'
import { ProcessForm } from '@/components/processes/ProcessForm'
import { ViewToggle } from '@/components/processes/ViewToggle'
import { EmptyState } from '@/components/shared/EmptyState'
import { useProcesses } from '@/hooks/useProcesses'
import { useProcessStore } from '@/stores/processStore'
import type { ProcessWithTaskCounts } from '@/types/database.types'
import type { CreateProcessInput } from '@/lib/validations'

export default function ProcessesPage() {
  const { processes, isLoading } = useProcesses()
  const { viewMode, createProcess, updateProcess } = useProcessStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ProcessWithTaskCounts | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(data: CreateProcessInput) {
    setSubmitting(true)
    await createProcess(data)
    setSubmitting(false)
    setCreateOpen(false)
  }

  async function handleEdit(data: CreateProcessInput) {
    if (!editTarget) return
    setSubmitting(true)
    await updateProcess(editTarget.id, data)
    setSubmitting(false)
    setEditTarget(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Processos</h2>
          <p className="text-muted-foreground">
            {processes.length} processo{processes.length !== 1 ? 's' : ''} no total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : processes.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum processo encontrado"
          description="Crie seu primeiro processo para começar a organizar suas atividades."
          action={{ label: 'Criar Processo', onClick: () => setCreateOpen(true) }}
        />
      ) : viewMode === 'table' ? (
        <ProcessTable processes={processes} onEdit={setEditTarget} />
      ) : (
        <ProcessKanban processes={processes} onEdit={setEditTarget} />
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Processo</DialogTitle>
          </DialogHeader>
          <ProcessForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isLoading={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ProcessForm
              initialData={editTarget}
              onSubmit={handleEdit}
              onCancel={() => setEditTarget(null)}
              isLoading={submitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
