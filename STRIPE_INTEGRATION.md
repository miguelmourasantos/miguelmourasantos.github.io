# Integração com Stripe - Guia de Implementação

## Overview

Este guia explica como integrar Stripe para processar pagamentos de subscrições na plataforma Miguel Tech SaaS.

## Arquitetura

```
┌─────────────────┐
│  Cliente React  │
└────────┬────────┘
         │
    1. POST /api/billing/checkout
         │
┌────────▼────────────┐
│ Next.js API Route   │
│ (criar session)     │
└────────┬────────────┘
         │
    2. POST /stripe/checkout-session
         │
┌────────▼────────────┐
│  Stripe API         │
│  (retorna URL)      │
└────────┬────────────┘
         │
    3. Redirect para Stripe
         │
    4. Webhook: charge.succeeded
         │
┌────────▼────────────┐
│ Webhook Handler     │
│ (/api/webhooks)     │
└────────┬────────────┘
         │
    5. Atualizar DB
```

## Setup Stripe

### 1. Criar Conta Stripe

1. Acesse https://dashboard.stripe.com
2. Sign up e ative a conta
3. Anote as chaves:
   - `Publishable Key` (pk_live_...)
   - `Secret Key` (sk_live_...)

### 2. Configurar Variáveis de Ambiente

Adicione ao `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Instalar Cliente Stripe

```bash
npm install stripe @stripe/react-stripe-js
```

## Implementar Checkout

### 1. Criar Rota de Checkout

```typescript
// /app/api/billing/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { priceId, organizationId } = await request.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        organizationId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('[v0] Erro ao criar checkout session:', error)
    return NextResponse.json(
      { error: 'Erro ao processar checkout' },
      { status: 500 }
    )
  }
}
```

### 2. Criar Componente de Checkout

```tsx
// components/billing/stripe-checkout.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function StripeCheckout({ priceId, organizationId }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, organizationId }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Processando...' : 'Fazer Upgrade'}
    </Button>
  )
}
```

## Implementar Webhooks

### 1. Criar Handler de Webhook

```typescript
// /app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('[v0] Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const organizationId = session.metadata?.organizationId

        // Atualizar subscription no banco
        await supabase
          .from('subscriptions')
          .upsert({
            organization_id: organizationId,
            stripe_subscription_id: session.subscription,
            plan: 'pro',
            status: 'active',
          })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Cancelar subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Marcar como past_due
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
```

### 2. Configurar Webhook no Stripe

1. Dashboard Stripe > Webhooks
2. Add endpoint
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Selecionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copiar `Signing Secret` para `.env.local`

## Testing

### Testando Localmente

```bash
# 1. Instalar Stripe CLI
# Seguir: https://stripe.com/docs/stripe-cli

# 2. Fazer login
stripe login

# 3. Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 4. Usar cartão de teste
# Stripe oferece cartões de teste no ambiente de teste
```

### Cartões de Teste

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **Expiração**: 12/34
- **CVC**: 123

## Segurança

1. **Sempre verificar assinatura de webhook**
2. **Usar `STRIPE_SECRET_KEY` apenas no servidor**
3. **Validar dados no webhook antes de atualizar DB**
4. **Implementar idempotência (verificar se já processado)**

## Próximos Passos

1. [ ] Criar UI de checkout
2. [ ] Implementar handleSucessoCheckout
3. [ ] Testar com Stripe CLI
4. [ ] Configurar webhooks em produção
5. [ ] Implementar retry logic
6. [ ] Adicionar notificações por email

## Referências

- Stripe Docs: https://stripe.com/docs
- Stripe React: https://stripe.com/docs/stripe-js/react
- Webhooks: https://stripe.com/docs/webhooks
