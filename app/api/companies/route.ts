import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCompanySchema } from '@/lib/validations'

/**
 * GET /api/companies
 * Returns all companies with statistics
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('companies_with_stats')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching companies:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar empresas' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in GET /api/companies:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao carregar empresas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/companies
 * Creates a new company
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validation = createCompanySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Insert company
    const { data, error } = await supabase
      .from('companies')
      .insert(validation.data)
      .select()
      .single()

    if (error) {
      console.error('Error creating company:', error)

      // Check for unique constraint violation (CNPJ)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'CNPJ já cadastrado' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Erro ao criar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/companies:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao criar empresa' },
      { status: 500 }
    )
  }
}
