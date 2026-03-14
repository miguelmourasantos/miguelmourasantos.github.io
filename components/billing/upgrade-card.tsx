'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscription } from '@/lib/hooks/useSubscription'
import Link from 'next/link'

export function PlanUpgradeCard() {
  const { plan } = useSubscription()

  if (plan === 'pro' || plan === 'enterprise') {
    return null
  }

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="text-lg">Upgrade para Pro</CardTitle>
        <CardDescription>
          Desbloqueie organizações ilimitadas, mais membros e recursos avançados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">Plano Atual</p>
            <p className="text-muted-foreground">Gratuito</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Próximo Plano</p>
            <p className="text-muted-foreground">R$ 99/mês</p>
          </div>
        </div>
        <Link href="/pricing" className="block">
          <Button className="w-full">Ver Planos</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
