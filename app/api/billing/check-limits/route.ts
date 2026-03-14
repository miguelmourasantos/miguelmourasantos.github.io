import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkResourceLimit } from '@/lib/services/pricing'

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

    // Get user subscription plan
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single()

    if (subError && subError.code !== 'PGRST116') {
      console.error('[v0] Erro ao buscar subscription:', subError)
      return NextResponse.json(
        { error: 'Erro ao verificar plano' },
        { status: 400 }
      )
    }

    const userPlan = (subscription?.plan || 'free') as 'free' | 'pro' | 'enterprise'

    // Get count of organizations for this user
    const { count: orgCount, error: countError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    const organizationCount = orgCount || 0

    // Check if user can create new organization
    const canCreate = checkResourceLimit(userPlan, 'organizations', organizationCount)

    if (!canCreate) {
      return NextResponse.json(
        {
          error: `Limite de organizações atingido para seu plano (${organizationCount})`,
          current: organizationCount,
          limit: userPlan === 'free' ? 1 : 'ilimitado',
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      canCreate: true,
      plan: userPlan,
      organizationCount,
    })
  } catch (error) {
    console.error('[v0] Erro ao verificar limite de organização:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
