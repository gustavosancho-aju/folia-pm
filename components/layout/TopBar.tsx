'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/processes': 'Processos',
  '/processes/new': 'Novo Processo',
}

function getTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname]
  if (pathname.startsWith('/processes/')) return 'Detalhes do Processo'
  return 'Folia PM'
}

export function TopBar() {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
