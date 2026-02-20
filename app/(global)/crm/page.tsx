import { CRMKanban } from '@/components/companies/CRMKanban'

export default function CRMPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">CRM</h1>
        <p className="text-muted-foreground">
          Gerencie leads e acompanhe o funil de vendas
        </p>
      </div>

      <CRMKanban />
    </div>
  )
}
