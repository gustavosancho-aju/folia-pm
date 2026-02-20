import Link from 'next/link'
import { Users, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function GlobalMenuPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gestão de Empresas</h1>
        <p className="text-lg text-muted-foreground">
          Escolha uma área para começar
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card CRM */}
        <Link href="/crm" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary cursor-pointer">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">CRM</h2>
                <p className="text-muted-foreground">
                  Gerencie leads e acompanhe o funil de vendas com quadro Kanban
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">Leads</span>
                <span className="px-2 py-1 bg-muted rounded">Pipeline</span>
                <span className="px-2 py-1 bg-muted rounded">Conversão</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card Projetos Fechados */}
        <Link href="/projects" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-2 hover:border-green-600 cursor-pointer">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Projetos Fechados</h2>
                <p className="text-muted-foreground">
                  Acesse empresas com contratos fechados e gerencie processos
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">Clientes</span>
                <span className="px-2 py-1 bg-muted rounded">Processos</span>
                <span className="px-2 py-1 bg-muted rounded">Tarefas</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">Pipeline Completo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Lead → Contato → Proposta → Negociação → Fechado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">Gestão Completa</p>
            <p className="text-sm text-muted-foreground mt-1">
              Processos e tarefas por empresa
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">Tempo Real</p>
            <p className="text-sm text-muted-foreground mt-1">
              Atualizações automáticas via Supabase
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
