import { use } from 'react'
import { GlobalSidebar } from '@/components/layout/GlobalSidebar'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompanyContextBar } from '@/components/companies/CompanyContextBar'
import { CompanyTabs } from '@/components/companies/CompanyTabs'

export default function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="flex h-screen bg-background">
      <GlobalSidebar />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CompanyContextBar companyId={id} />
        <TopBar />
        <CompanyTabs companyId={id} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
