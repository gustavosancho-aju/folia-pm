'use client'

import { useCompanies } from '@/hooks/useCompanies'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import type { CompanyStatus } from '@/types/database.types'
import { CompanyCard } from './CompanyCard'
import { CompanyFormDialog } from './CompanyFormDialog'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { useState } from 'react'

const COLUMNS: { id: CompanyStatus, label: string, color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'contact', label: 'Contato', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'proposal', label: 'Proposta', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'negotiation', label: 'Negociação', color: 'bg-orange-100 dark:bg-orange-900' },
  { id: 'closed', label: 'Fechado', color: 'bg-green-100 dark:bg-green-900' },
]

export function CRMKanban() {
  const { companies, updateCompanyStatus, isLoading } = useCompanies()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter out 'lost' companies (they shouldn't appear in CRM)
  const activeCompanies = companies.filter(c => c.status !== 'lost')

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const companyId = result.draggableId
    const newStatus = result.destination.droppableId as CompanyStatus

    updateCompanyStatus(companyId, newStatus)
  }

  if (isLoading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      {/* Header with New Company Button */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {activeCompanies.length} empresa{activeCompanies.length !== 1 ? 's' : ''} ativa{activeCompanies.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(column => {
            const columnCompanies = activeCompanies.filter(c => c.status === column.id)

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Column Header */}
                <div className={`${column.color} rounded-lg p-3 mb-3 border`}>
                  <h3 className="font-semibold text-sm">
                    {column.label} ({columnCompanies.length})
                  </h3>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver
                          ? 'bg-muted/50 border-2 border-dashed border-primary'
                          : 'border-2 border-transparent'
                      }`}
                    >
                      {columnCompanies.map((company, index) => (
                        <Draggable
                          key={company.id}
                          draggableId={company.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'opacity-50' : ''}
                            >
                              <CompanyCard company={company} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty State */}
                      {columnCompanies.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                          Nenhuma empresa
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* Company Form Dialog */}
      <CompanyFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
