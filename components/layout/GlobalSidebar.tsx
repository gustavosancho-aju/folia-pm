'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/projects', label: 'Projetos Fechados', icon: CheckCircle2 },
]

export function GlobalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col">
      {/* Logo/Header */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">Folia PM</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          CRM e Gestão de Projetos
        </p>
      </div>
    </aside>
  )
}
