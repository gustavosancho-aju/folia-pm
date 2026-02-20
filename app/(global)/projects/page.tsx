import { ClosedProjectsList } from '@/components/companies/ClosedProjectsList'

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Projetos Fechados</h1>
        <p className="text-muted-foreground">
          Empresas com contratos fechados e seus processos
        </p>
      </div>

      <ClosedProjectsList />
    </div>
  )
}
