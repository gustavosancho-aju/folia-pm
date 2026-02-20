import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCompanySchema } from '@/lib/validations'
import { z } from 'zod'

const uuidSchema = z.string().uuid()

function validateId(id: string) {
  const result = uuidSchema.safeParse(id)
  if (!result.success) {
    return NextResponse.json(
      { error: 'ID inválido' },
      { status: 400 }
    )
  }
  return null
}

/**
 * GET /api/companies/[id]
 * Returns a single company with statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invalid = validateId(id)
    if (invalid) return invalid

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('companies_with_stats')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Empresa não encontrada' },
          { status: 404 }
        )
      }

      console.error('Error fetching company:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in GET /api/companies/[id]:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao carregar empresa' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/companies/[id]
 * Updates a company
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invalid = validateId(id)
    if (invalid) return invalid

    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validation = updateCompanySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Update company
    const { data, error } = await supabase
      .from('companies')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Empresa não encontrada' },
          { status: 404 }
        )
      }

      // Check for unique constraint violation (CNPJ)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'CNPJ já cadastrado' },
          { status: 409 }
        )
      }

      console.error('Error updating company:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in PATCH /api/companies/[id]:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao atualizar empresa' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/companies/[id]
 * Deletes a company (cascades to processes and tasks)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invalid = validateId(id)
    if (invalid) return invalid

    const supabase = await createClient()

    // Check if company exists first
    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      )
    }

    const { error } = await supabase.from('companies').delete().eq('id', id)

    if (error) {
      console.error('Error deleting company:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/companies/[id]:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao deletar empresa' },
      { status: 500 }
    )
  }
}
