'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export interface Subscription {
  id: string
  userId: string
  organizationId: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due'
  stripeSubscriptionId?: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/billing/subscription')
        if (!response.ok) throw new Error('Erro ao buscar subscrição')

        const data = await response.json()
        setSubscription(data.subscription)
        setPlan(data.plan)
      } catch (err) {
        setError(err as Error)
        setPlan('free')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  const upgradeToProPlan = async (organizationId: string) => {
    try {
      const response = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          plan: 'pro',
        }),
      })

      if (!response.ok) throw new Error('Erro ao fazer upgrade')

      const data = await response.json()
      setSubscription(data.subscription)
      setPlan('pro')
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const cancelSubscription = async () => {
    try {
      // TODO: Implementar cancelamento de subscrição
      setPlan('free')
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    subscription,
    plan,
    isLoading,
    error,
    upgradeToProPlan,
    cancelSubscription,
  }
}
