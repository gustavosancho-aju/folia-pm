'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProcessForm } from '@/components/processes/ProcessForm'
import { useProcessStore } from '@/stores/processStore'
import type { CreateProcessInput } from '@/lib/validations'

export default function NewProcessPage() {
  const router = useRouter()
  const { createProcess } = useProcessStore()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(data: CreateProcessInput) {
    setIsLoading(true)
    const result = await createProcess(data)
    setIsLoading(false)
    if (result) {
      router.push(`/processes/${result.id}`)
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
            onCancel={() => router.push('/processes')}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
