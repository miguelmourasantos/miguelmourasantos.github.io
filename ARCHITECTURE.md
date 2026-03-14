# Miguel Tech SaaS Platform - Arquitetura

## Visão Geral

Esta é uma plataforma SaaS completa, escalável e pronta para produção, construída com Next.js 15, TypeScript, Supabase e Tailwind CSS. A arquitetura foi projetada para suportar múltiplas organizações (multi-tenant), autenticação segura e preparação para monetização.

## Stack Tecnológico

### Frontend
- **Next.js 15** - React framework com App Router
- **TypeScript** - Type safety completo
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Componentes UI reutilizáveis
- **React Hooks** - State management client-side

### Backend
- **Next.js API Routes** - Serverless backend
- **Supabase** - Backend-as-a-Service com PostgreSQL
- **Supabase Auth** - Autenticação JWT
- **Row Level Security (RLS)** - Segurança multi-tenant

### Deployment
- **Vercel** - Deployment automático
- **GitHub** - Version control e CI/CD

## Estrutura de Diretórios

```
/vercel/share/v0-project/
├── app/
│   ├── api/              # API Routes (serverless functions)
│   ├── auth/             # Páginas de autenticação (login, register)
│   ├── dashboard/        # Páginas autenticadas (dashboard, settings)
│   ├── page.tsx          # Página inicial (landing)
│   ├── layout.tsx        # Layout raiz
│   └── globals.css       # Estilos globais
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   └── dashboard/        # Componentes específicos do dashboard
├── lib/
│   ├── supabase/         # Clientes Supabase (client, server)
│   ├── services/         # Serviços de negócio (auth, etc)
│   ├── hooks/            # Custom React hooks (useAuth)
│   ├── types/            # Tipos TypeScript compartilhados
│   └── utils/            # Funções utilitárias
├── middleware.ts         # Middleware Next.js (auth protection)
├── scripts/              # Scripts de inicialização
└── public/               # Ativos estáticos
```

## Model de Dados

### Usuários (users)
- `id` (UUID) - Foreign key da autenticação Supabase
- `email` (TEXT) - Email único
- `first_name`, `last_name` (TEXT) - Nome
- `avatar_url` (TEXT) - URL do avatar
- `plan` (TEXT) - Plano (free/pro/enterprise)
- `created_at`, `updated_at` (TIMESTAMP)

### Organizações (organizations)
- `id` (UUID) - Chave primária
- `name`, `slug` (TEXT) - Nome e slug único
- `description` (TEXT) - Descrição
- `avatar_url` (TEXT) - Logo da org
- `owner_id` (UUID) - FK para users (dono)
- `created_at`, `updated_at` (TIMESTAMP)

### Times (teams)
- `id` (UUID) - Chave primária
- `organization_id` (UUID) - FK para organizations
- `name`, `description` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### Membros de Time (team_members)
- `id` (UUID) - Chave primária
- `team_id` (UUID) - FK para teams
- `user_id` (UUID) - FK para users
- `role` (TEXT) - owner/admin/member
- `created_at` (TIMESTAMP)

### Subscrições (subscriptions)
- `id` (UUID) - Chave primária
- `user_id`, `organization_id` (UUID) - Foreign keys
- `plan` (TEXT) - free/pro/enterprise
- `status` (TEXT) - active/canceled/past_due
- `stripe_subscription_id` (TEXT) - ID do Stripe
- `current_period_start/end` (TIMESTAMP)
- `cancel_at_period_end` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### Estatísticas de Uso (usage_stats)
- `id` (UUID) - Chave primária
- `user_id`, `organization_id` (UUID) - Foreign keys
- `metric` (TEXT) - Nome da métrica
- `value` (INTEGER) - Valor da métrica
- `timestamp` (TIMESTAMP)

## Fluxo de Autenticação

1. **Registro**: 
   - Usuário submete email/senha
   - API cria conta em `auth.users` (Supabase Auth)
   - API cria perfil em `users` table
   - Cookie de sessão é setado

2. **Login**:
   - Supabase Auth valida credenciais
   - JWT token é gerado
   - Cookie é setado (httpOnly, secure)

3. **Proteção de Rotas**:
   - Middleware valida JWT em cada request
   - Redireciona para login se não autenticado

4. **Cliente**:
   - `useAuth()` hook gerencia estado do usuário
   - Refresh automático de sessão

## Row Level Security (RLS)

Cada tabela tem RLS ativado para garantir que:
- Usuários só veem suas próprias organizações
- Membros de times só veem dados do seu time
- Organizações só veem dados dos seus usuários

Exemplo:
```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orgs"
ON organizations FOR SELECT
USING (owner_id = auth.uid());
```

## Fluxo de Multi-Tenant

1. Usuário cria organização (é o `owner_id`)
2. Usuário convida outros usuários para o time
3. Cada usuário tem acesso apenas aos dados da sua organização
4. RLS garante isso automaticamente no banco

## Camadas de Negócio

### API Routes (`/app/api`)
- Recebem requests HTTP
- Validam autenticação
- Delegam para Services
- Retornam JSON responses

### Services (`/lib/services`)
- Contêm lógica de negócio
- Não dependem de HTTP
- Reutilizáveis em múltiplos contextos

### Components
- UI pura (display + user interaction)
- Chamam APIs ou Services
- State management local com hooks

### Hooks (`/lib/hooks`)
- Custom hooks para lógica compartilhada
- `useAuth()` para state de autenticação
- Podem fazer fetch de dados

## Padrões de Erro

```typescript
// API responses
{
  "error": "Mensagem de erro",
  "status": 400
}

// Tratamento no cliente
try {
  const response = await fetch('/api/...')
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error)
  }
  // Handle success
} catch (error) {
  toast({
    title: 'Erro',
    description: error.message,
    variant: 'destructive'
  })
}
```

## Próximos Passos

1. **Criar Tabelas**: Execute o script SQL para criar as tabelas
2. **Configurar RLS**: Ativar Row Level Security em produção
3. **Integração Stripe**: Implementar webhooks de pagamento
4. **Email Service**: Configurar notificações por email
5. **Analytics**: Adicionar tracking de uso
6. **Admin Dashboard**: Criar painel para admins

## Deployment

```bash
# Deploy automático via Vercel
git push origin main

# Variáveis de ambiente necessárias
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Development

```bash
# Instalar dependências
npm install

# Rodar dev server
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```
