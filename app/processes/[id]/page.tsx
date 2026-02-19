'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskBoard } from '@/components/tasks/TaskBoard'
import { ProcessForm } from '@/components/processes/ProcessForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DeadlineBadge } from '@/components/shared/DeadlineBadge'
import { PROCESS_STATUS_COLORS, PROCESS_STATUS_LABELS } from '@/lib/constants'
import { useTasks } from '@/hooks/useTasks'
import { useProcessStore } from '@/stores/processStore'
import type { ProcessWithTaskCounts } from '@/types/database.types'
import type { CreateProcessInput } from '@/lib/validations'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { getProgressColor } from '@/lib/utils'

export default function ProcessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { processes, fetchProcesses, updateProcess, deleteProcess, initRealtime } = useProcessStore()
  const { tasks } = useTasks(id)

  const [process, setProcess] = useState<ProcessWithTaskCounts | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    if (processes.length === 0) {
      fetchProcesses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const found = processes.find(p => p.id === id) ?? null
    setProcess(found)
  }, [processes, id])

  // Init realtime for process updates
  useEffect(() => {
    const cleanup = initRealtime()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!process) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded bg-muted animate-pulse" />
        <div className="mt-6 flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 w-64 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  async function handleEdit(data: CreateProcessInput) {
    setEditLoading(true)
    await updateProcess(id, data)
    setEditLoading(false)
    setEditOpen(false)
  }

  async function handleDelete() {
    await deleteProcess(id)
    router.push('/processes')
  }

  const chartData = [{ value: process.progress, fill: getProgressColor(process.progress) }]

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-2 text-muted-foreground"
        onClick={() => router.push('/processes')}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Processos
      </Button>

      {/* Process header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Progress ring */}
          <div className="relative h-20 w-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  cornerRadius={10}
                  angleAxisId={0}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold">{process.progress}%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: process.color }}
              />
              <h2 className="text-2xl font-bold">{process.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={PROCESS_STATUS_COLORS[process.status]} variant="outline">
                {PROCESS_STATUS_LABELS[process.status]}
              </Badge>
              <DeadlineBadge deadline={process.deadline} />
              <span className="text-sm text-muted-foreground">
                {process.done_count}/{process.total_tasks} tarefas concluídas
              </span>
            </div>
            {process.description && (
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{process.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            Nova Tarefa
          </Button>
          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard processId={id} tasks={tasks} />

      {/* Edit Process Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
          </DialogHeader>
          <ProcessForm
            initialData={process}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
            isLoading={editLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Process Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir processo"
        description="Esta ação é irreversível. Todas as tarefas serão excluídas junto com o processo."
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}
