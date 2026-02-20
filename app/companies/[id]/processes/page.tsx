'use client'

import { use, useState } from 'react'
import { Plus } from 'lucide-react'
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

export default function CompanyProcessesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = use(params)
  const { processes, isLoading } = useProcesses(companyId)
  const { viewMode, createProcess, updateProcess } = useProcessStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ProcessWithTaskCounts | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(data: CreateProcessInput) {
    setSubmitting(true)
    // Add company_id to the data
    await createProcess({ ...data, company_id: companyId })
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
            {processes.length} processo{processes.length !== 1 ? 's' : ''} nesta empresa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : processes.length === 0 ? (
        <EmptyState
          icon="FolderKanban"
          title="Nenhum processo criado"
          description="Comece criando um novo processo para esta empresa"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Processo
            </Button>
          }
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
            <DialogTitle>Criar Novo Processo</DialogTitle>
          </DialogHeader>
          <ProcessForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
          </DialogHeader>
          <ProcessForm
            defaultValues={editTarget ?? undefined}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
