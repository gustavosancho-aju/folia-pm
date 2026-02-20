import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Building2, TrendingUp, Calendar } from 'lucide-react'
import type { CompanyWithStats } from '@/types/database.types'
import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function CompanyCard({ company }: { company: CompanyWithStats }) {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-card">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{company.name}</h4>

            {company.contact_person && (
              <p className="text-sm text-muted-foreground truncate">
                {company.contact_person}
              </p>
            )}

            <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>{company.total_processes} processo{company.total_processes !== 1 ? 's' : ''}</span>
              </div>

              {company.estimated_value && company.estimated_value > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>R$ {company.estimated_value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              )}

              {company.expected_close_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Prev: {new Date(company.expected_close_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>

            {company.last_activity && (
              <p className="text-xs text-muted-foreground mt-2">
                Atualizado {formatDistance(new Date(company.last_activity), new Date(), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
