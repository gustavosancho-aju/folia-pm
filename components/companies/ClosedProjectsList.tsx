'use client'

import { useCompanies } from '@/hooks/useCompanies'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, FolderKanban, TrendingUp, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ClosedProjectsList() {
  const { companies, isLoading } = useCompanies()

  const closedCompanies = companies.filter(c => c.status === 'closed')

  if (isLoading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (closedCompanies.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <Building2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Nenhum projeto fechado</h3>
              <p className="text-sm text-muted-foreground">
                Quando você fechar contratos com empresas, elas aparecerão aqui
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {closedCompanies.length} projeto{closedCompanies.length !== 1 ? 's' : ''} fechado{closedCompanies.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {closedCompanies.map(company => (
          <Link key={company.id} href={`/companies/${company.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                    {company.contact_person && (
                      <p className="text-sm text-muted-foreground truncate">
                        {company.contact_person}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>
                      {company.total_processes} processo{company.total_processes !== 1 ? 's' : ''}
                      {company.completed_processes > 0 && (
                        <span className="text-muted-foreground">
                          {' '}({company.completed_processes} concluído{company.completed_processes !== 1 ? 's' : ''})
                        </span>
                      )}
                    </span>
                  </div>

                  {company.avg_progress > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>Progresso médio: {company.avg_progress.toFixed(0)}%</span>
                    </div>
                  )}

                  {company.estimated_value && company.estimated_value > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        R$ {company.estimated_value.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  )}

                  {company.last_activity && (
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                      Última atividade{' '}
                      {formatDistanceToNow(new Date(company.last_activity), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
