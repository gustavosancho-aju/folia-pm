'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskBoard } from '@/components/tasks/TaskBoard'
import { ProcessForm } from '@/components/processes/ProcessForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DeadlineBadge } from '@/components/shared/DeadlineBadge'
import { PROCESS_STATUS_LABELS } from '@/lib/constants'
import { useProcessStore } from '@/stores/processStore'
import type { ProcessWithTaskCounts } from '@/types/database.types'
import type { CreateProcessInput } from '@/lib/validations'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { getProgressColor } from '@/lib/utils'
import Link from 'next/link'

export default function ProcessDetailPage({
  params
}: {
  params: Promise<{ id: string; pid: string }>
}) {
  const { id: companyId, pid: processId } = use(params)
  const router = useRouter()

  const { processes, fetchProcessesByCompany, updateProcess, deleteProcess, initRealtime } = useProcessStore()

  const [process, setProcess] = useState<ProcessWithTaskCounts | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    if (processes.length === 0) {
      fetchProcessesByCompany(companyId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  useEffect(() => {
    const found = processes.find(p => p.id === processId) ?? null
    setProcess(found)
  }, [processes, processId])

  // Init realtime for process updates
  useEffect(() => {
    const cleanup = initRealtime()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleEdit(data: CreateProcessInput) {
    setEditLoading(true)
    await updateProcess(processId, data)
    setEditLoading(false)
    setEditOpen(false)
  }

  async function handleDelete() {
    await deleteProcess(processId)
    router.push(`/companies/${companyId}/processes`)
  }

  if (!process) {
    return <div className="text-center py-12">Carregando...</div>
  }

  const progressData = [{ name: 'Progress', value: process.progress, fill: getProgressColor(process.progress) }]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Link href={`/companies/${companyId}/processes`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight mb-2">{process.title}</h2>
            {process.description && (
              <p className="text-muted-foreground mb-4">{process.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" style={{ backgroundColor: process.color + '20', borderColor: process.color }}>
                {PROCESS_STATUS_LABELS[process.status]}
              </Badge>
              {process.deadline && <DeadlineBadge deadline={process.deadline} />}
              <span className="text-sm text-muted-foreground">
                {process.total_tasks} tarefa{process.total_tasks !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress Ring */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width={100} height={100}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={10}
                data={progressData}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={30} />
              </RadialBarChart>
            </ResponsiveContainer>
            <span className="text-sm font-medium -mt-2">{process.progress}%</span>
          </div>

          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard processId={processId} />

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
          </DialogHeader>
          <ProcessForm
            defaultValues={process}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
            isLoading={editLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Deletar Processo"
        description={`Tem certeza que deseja deletar "${process.title}"? Todas as tarefas associadas também serão deletadas. Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        variant="destructive"
      />
    </div>
  )
}
