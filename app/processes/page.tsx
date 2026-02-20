'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function ProcessesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to projects page after 2 seconds
    const timer = setTimeout(() => {
      router.push('/projects')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Nova Estrutura de Processos</h2>
            <p className="text-muted-foreground mb-4">
              Os processos agora são gerenciados dentro de cada Projeto Fechado.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecionando para Projetos Fechados...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
