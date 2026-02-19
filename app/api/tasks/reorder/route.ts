import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { reorderTasksSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const parsed = reorderTasksSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updates = parsed.data.tasks.map(({ id, order_index, status }) =>
    supabase
      .from('tasks')
      .update({ order_index, status })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)
  if (errors.length > 0) {
    return NextResponse.json({ error: 'Partial update failure' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
