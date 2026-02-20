'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProcessForm } from '@/components/processes/ProcessForm'
import { useProcessStore } from '@/stores/processStore'
import type { CreateProcessInput } from '@/lib/validations'

export default function NewProcessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = use(params)
  const router = useRouter()
  const { createProcess } = useProcessStore()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(data: CreateProcessInput) {
    setIsLoading(true)
    // Add company_id to the data
    const result = await createProcess({ ...data, company_id: companyId })
    setIsLoading(false)
    if (result) {
      router.push(`/companies/${companyId}/processes/${result.id}`)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Novo Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessForm
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/companies/${companyId}/processes`)}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
