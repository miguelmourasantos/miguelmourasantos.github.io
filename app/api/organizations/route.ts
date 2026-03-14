import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/slug'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Get user's organizations
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', user.id)

    if (orgsError) {
      return NextResponse.json(
        { error: 'Erro ao buscar organizações' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      organizations: orgs,
    })
  } catch (error) {
    console.error('[v0] Erro ao buscar organizações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da organização é obrigatório' },
        { status: 400 }
      )
    }

    const slug = generateSlug(name)

    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        description,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { organization: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Erro ao criar organização:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
