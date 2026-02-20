import { GlobalSidebar } from '@/components/layout/GlobalSidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <GlobalSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
