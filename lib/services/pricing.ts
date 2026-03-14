// Limites de recursos por plano
export const PLAN_LIMITS = {
  free: {
    organizations: 1,
    teamMembers: 3,
    storage: 10 * 1024 * 1024 * 1024, // 10GB
    apiRequests: 1000,
  },
  pro: {
    organizations: Infinity,
    teamMembers: 50,
    storage: 1024 * 1024 * 1024 * 1024, // 1TB
    apiRequests: 100000,
  },
  enterprise: {
    organizations: Infinity,
    teamMembers: Infinity,
    storage: Infinity,
    apiRequests: Infinity,
  },
}

// Preços em centavos (para integração com Stripe)
export const STRIPE_PRICES = {
  pro: {
    monthly: 9900, // R$ 99
    annual: 99000, // R$ 990 (com 10% desconto)
  },
  enterprise: null, // Personalizado
}

// Funcionalidades por plano
export const PLAN_FEATURES = {
  free: [
    'Dashboard básico',
    '1 organização',
    'Até 3 membros',
    'Suporte por email',
  ],
  pro: [
    'Tudo do Free',
    'Organizações ilimitadas',
    'Até 50 membros',
    'Dashboard avançado',
    'Relatórios personalizados',
    'API acesso',
    'Suporte prioritário',
  ],
  enterprise: [
    'Tudo do Pro',
    'Membros ilimitados',
    'Armazenamento ilimitado',
    'Suporte 24/7',
    'SSO e segurança avançada',
    'SLA garantido',
    'Integração customizada',
  ],
}

// Verificar acesso a feature baseado no plano
export function hasFeatureAccess(plan: 'free' | 'pro' | 'enterprise', feature: string): boolean {
  const features = PLAN_FEATURES[plan]
  const allFeatures = [
    ...PLAN_FEATURES.free,
    ...PLAN_FEATURES.pro,
    ...PLAN_FEATURES.enterprise,
  ]
  
  const featureIndex = allFeatures.indexOf(feature)
  
  if (plan === 'free') {
    return PLAN_FEATURES.free.includes(feature)
  } else if (plan === 'pro') {
    return [...PLAN_FEATURES.free, ...PLAN_FEATURES.pro].includes(feature)
  } else {
    return true
  }
}

// Verificar limite de recurso
export function checkResourceLimit(
  plan: 'free' | 'pro' | 'enterprise',
  resource: keyof typeof PLAN_LIMITS['free'],
  current: number
): boolean {
  const limit = PLAN_LIMITS[plan][resource]
  return current < limit
}
