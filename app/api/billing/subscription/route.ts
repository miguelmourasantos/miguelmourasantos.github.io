import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Get subscription info
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (subError && subError.code === 'PGRST116') {
      // No subscription found, user is on free plan
      return NextResponse.json({
        subscription: null,
        plan: 'free',
        status: 'active',
      })
    }

    if (subError) {
      return NextResponse.json(
        { error: 'Erro ao buscar informações de subscrição' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      subscription,
      plan: subscription?.plan || 'free',
      status: subscription?.status || 'active',
    })
  } catch (error) {
    console.error('[v0] Erro ao buscar subscription:', error)
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

    const { organizationId, plan } = await request.json()

    if (!organizationId || !plan) {
      return NextResponse.json(
        { error: 'Organização e plano são obrigatórios' },
        { status: 400 }
      )
    }

    // Create or update subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        organization_id: organizationId,
        plan,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      subscription: data,
    })
  } catch (error) {
    console.error('[v0] Erro ao criar subscription:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
