'use client'

import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ProcessProgressRing } from '@/components/dashboard/ProcessProgressRing'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useProcessStore } from '@/stores/processStore'

export default function DashboardPage() {
  const { processes, summary, isLoading, fetchProcesses, fetchSummary, initRealtime } = useProcessStore()

  useEffect(() => {
    fetchProcesses()
    fetchSummary()
    const cleanup = initRealtime()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeProcesses = processes.filter(p => p.status === 'active')

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            Acompanhe seus processos em tempo real
          </p>
        </div>
        <Button asChild>
          <Link href="/processes/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Active Processes Grid + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Rings — takes 2/3 */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Processos Ativos</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/processes">Ver todos</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : activeProcesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm text-muted-foreground mb-3">Nenhum processo ativo</p>
              <Button size="sm" asChild>
                <Link href="/processes/new">Criar Processo</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activeProcesses.map((process) => (
                <ProcessProgressRing key={process.id} process={process} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity — 1/3 */}
        <div>
          <RecentActivity processes={processes} />
        </div>
      </div>
    </div>
  )
}
