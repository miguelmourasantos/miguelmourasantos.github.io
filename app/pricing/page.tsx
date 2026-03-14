'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: '0',
    description: 'Para começar',
    features: [
      '1 organização',
      'Até 3 usuários',
      '10GB armazenamento',
      'Suporte básico',
      'Dashboard básico',
    ],
    cta: 'Começar Agora',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: '99',
    description: 'Para empresas em crescimento',
    features: [
      'Organizações ilimitadas',
      'Até 50 usuários',
      '1TB armazenamento',
      'Suporte prioritário',
      'Dashboard avançado',
      'Relatórios personalizados',
      'API acesso',
    ],
    cta: 'Começar Teste Grátis',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Personalizado',
    description: 'Para grandes organizações',
    features: [
      'Tudo do Pro',
      'Usuários ilimitados',
      'Armazenamento ilimitado',
      'Suporte 24/7',
      'SSO e segurança avançada',
      'SLA garantido',
      'Integração customizada',
    ],
    cta: 'Contatar Vendas',
    highlighted: false,
  },
]

export default function PricingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Planos e Preços</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano perfeito para sua empresa. Todos incluem suporte email
            e acesso a novas funcionalidades.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${
                plan.highlighted
                  ? 'ring-2 ring-primary scale-105 md:scale-105'
                  : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">
                    R$ {plan.price}
                  </span>
                  {plan.price !== 'Personalizado' && (
                    <span className="text-muted-foreground">/mês</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="text-primary mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {user ? (
                  <Link href="/dashboard">
                    <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/register">
                    <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Posso trocar de plano a qualquer momento?',
                a: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A mudança será aplicada no próximo ciclo de cobrança.',
              },
              {
                q: 'Existe período de teste?',
                a: 'Sim! Todos os planos pagos incluem 14 dias de teste gratuito sem necessidade de cartão de crédito.',
              },
              {
                q: 'Como funciona a cobrança?',
                a: 'A cobrança é mensal e automática. Você pode cancelar sua inscrição a qualquer momento sem penalidades.',
              },
              {
                q: 'Vocês oferecem desconto anual?',
                a: 'Sim! Planos pagos anuais recebem 20% de desconto. Contate nosso time de vendas para mais detalhes.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-3">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
