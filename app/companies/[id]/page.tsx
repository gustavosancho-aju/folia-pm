'use client'

import { use } from 'react'
import { useProcesses } from '@/hooks/useProcesses'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ProcessProgressRing } from '@/components/dashboard/ProcessProgressRing'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'

export default function CompanyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = use(params)
  const { processes, summary, isLoading } = useProcesses(companyId)

  if (isLoading && processes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos processos desta empresa</p>
        </div>
        <Link href={`/companies/${companyId}/processes/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      {summary && <SummaryCards summary={summary} />}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Rings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Progresso dos Processos</CardTitle>
            </CardHeader>
            <CardContent>
              {processes.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {processes.slice(0, 6).map((process) => (
                    <ProcessProgressRing key={process.id} process={process} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Nenhum processo cadastrado ainda
                  </p>
                  <Link href={`/companies/${companyId}/processes/new`}>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Processo
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity processes={processes} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href={`/companies/${companyId}/processes`}>
            <Button variant="outline">Ver Todos os Processos</Button>
          </Link>
          <Link href={`/companies/${companyId}/processes/new`}>
            <Button>Criar Novo Processo</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
