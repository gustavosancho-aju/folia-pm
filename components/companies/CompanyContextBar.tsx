'use client'

import { useCompanyStore } from '@/stores/companyStore'
import { useEffect } from 'react'
import { Building2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CompanyContextBar({ companyId }: { companyId: string }) {
  const { companies, fetchCompanies } = useCompanyStore()

  useEffect(() => {
    if (companies.length === 0) {
      fetchCompanies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const company = companies.find(c => c.id === companyId)

  if (!company) return null

  return (
    <div className="border-b border-border bg-muted/30 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Empresa</p>
          <p className="font-semibold text-sm">{company.name}</p>
        </div>
      </div>

      <Link href="/projects">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Projetos
        </Button>
      </Link>
    </div>
  )
}
