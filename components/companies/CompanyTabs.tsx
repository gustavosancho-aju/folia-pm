'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutDashboard, FolderKanban } from 'lucide-react'

export function CompanyTabs({ companyId }: { companyId: string }) {
  const pathname = usePathname()
  const router = useRouter()

  // Determine active tab based on pathname
  const activeTab = pathname.includes('/processes') ? 'processes' : 'dashboard'

  const handleTabChange = (value: string) => {
    if (value === 'dashboard') {
      router.push(`/companies/${companyId}`)
    } else if (value === 'processes') {
      router.push(`/companies/${companyId}/processes`)
    }
  }

  return (
    <div className="border-b border-border px-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="h-12 bg-transparent border-b-0 p-0">
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="processes"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
          >
            <FolderKanban className="h-4 w-4" />
            Processos
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
