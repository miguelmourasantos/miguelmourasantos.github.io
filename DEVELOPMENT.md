# Guia de Desenvolvimento - Miguel Tech SaaS

## Setup Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Criar Tabelas no Supabase

Acesse o SQL Editor no Supabase e execute:

```sql
-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Team Members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Usage Stats table
CREATE TABLE public.usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### 3. Ativar RLS (Row Level Security)

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
```

## Adicionar Nova Feature

### Exemplo: Adicionar Campo em Usuários

1. **Migration**: Criar script SQL em `/scripts`
```sql
ALTER TABLE public.users ADD COLUMN phone_number TEXT;
```

2. **Type**: Atualizar em `/lib/types/domain.ts`
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // New field
  // ...
}
```

3. **Component**: Usar em componentes
```tsx
<Input 
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleChange}
/>
```

4. **API**: Atualizar endpoint
```typescript
const { firstName, phoneNumber } = await request.json()

await supabase
  .from('users')
  .update({ 
    first_name: firstName,
    phone_number: phoneNumber 
  })
```

## Adicionar Nova Página

### Estrutura Padrão

```
/app/dashboard/new-feature/
├── page.tsx           # Página principal
├── layout.tsx         # Layout (opcional)
└── components/        # Componentes específicos
```

### Template de Página

```tsx
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'

export default function NewFeaturePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/auth/login')
  }, [user, router])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Nova Feature</h1>
      {/* Seu conteúdo aqui */}
    </div>
  )
}
```

## Adicionar Nova API Route

```typescript
// /app/api/feature/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Sua lógica aqui
    return NextResponse.json({ /* response */ })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}
```

## Testing

### Testar Autenticação

```bash
# 1. Registrar novo usuário em http://localhost:3000/auth/register
# 2. Verificar email em Supabase > Authentication > Users
# 3. Acessar dashboard em http://localhost:3000/dashboard
```

### Testar API

```bash
# GET com autenticação
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:3000/api/users/me

# POST
curl -X POST http://localhost:3000/api/organizations \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Minha Org"}'
```

## Debugging

### Ativar Console Logs

```typescript
console.log('[v0] Debug message:', variable)
```

### Verificar Autenticação

```typescript
const { data, error } = await supabase.auth.getUser()
console.log('[v0] User:', data.user)
console.log('[v0] Error:', error)
```

### Inspecionar Requests

```typescript
// No navegador: DevTools > Network tab
// Ver headers de autenticação e response bodies
```

## Common Issues

### "Não autorizado" em API

- Verificar se token JWT é válido
- Verificar variáveis de ambiente
- Verificar RLS policies no Supabase

### Tabelas não encontradas

- Executar scripts SQL em Supabase
- Verificar permissões no Supabase

### Componentes não atualizando

- Verificar se está usando `'use client'`
- Verificar estado e efeitos colaterais
- Limpar cache do navegador

## Performance Tips

1. **Use SWR para data fetching**: Caching automático
2. **Lazy load componentes**: `dynamic()` para splitting
3. **Optimize images**: Usar Next.js Image component
4. **Database queries**: Usar índices no Supabase

## Próximas Implementações

- [ ] Email notifications via SendGrid
- [ ] Stripe integration para payments
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Mobile app com React Native
