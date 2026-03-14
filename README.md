# Miguel Tech SaaS Platform

Uma plataforma SaaS moderna, escalável e pronta para produção. Construída com Next.js 15, TypeScript, Supabase e Tailwind CSS.

## Características Principais

✅ **Autenticação Segura** - JWT com Supabase Auth  
✅ **Multi-Tenant** - Suporte para múltiplas organizações com RLS  
✅ **Dashboard Moderno** - Interface intuitiva e responsiva  
✅ **TypeScript Full-Stack** - Type-safe em toda a aplicação  
✅ **API Serverless** - Next.js API Routes  
✅ **Pronto para Monetização** - Estrutura para planos (free/pro/enterprise)  

## Stack Tecnológico

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (JWT)
- **Deployment**: Vercel

## Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Criar Tabelas no Banco de Dados

Veja o arquivo [DEVELOPMENT.md](./DEVELOPMENT.md) para instruções SQL.

### 4. Rodar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

## Estrutura do Projeto

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── auth/                 # Páginas de auth
│   ├── dashboard/            # Páginas autenticadas
│   └── layout.tsx            # Layout raiz
├── components/               # Componentes React
│   ├── ui/                   # shadcn/ui components
│   └── dashboard/            # Componentes do dashboard
├── lib/                      # Lógica compartilhada
│   ├── supabase/             # Clientes Supabase
│   ├── services/             # Serviços de negócio
│   ├── hooks/                # Custom hooks
│   └── types/                # Tipos TypeScript
└── middleware.ts             # Middleware de autenticação
```

## Documentação Completa

Acesse os guias para entender a plataforma em detalhes:

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Resumo do que foi implementado (LEIA ISTO PRIMEIRO)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura técnica e design decisions
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guia de desenvolvimento
- **[STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)** - Como integrar Stripe
- **[NEXT_STEPS_CHECKLIST.md](./NEXT_STEPS_CHECKLIST.md)** - Checklist de próximos passos

## Funcionalidades Implementadas

### Fase 1: Configuração Base ✅
- [x] Setup Next.js 15 com TypeScript
- [x] Tailwind CSS + shadcn/ui
- [x] Supabase integração
- [x] Layout raiz e estrutura de rotas
- [x] Estilos globais e theme

### Fase 2: Autenticação ✅
- [x] Página de Login
- [x] Página de Registro
- [x] API de Login/Register
- [x] JWT com Supabase Auth
- [x] Hook useAuth() customizado
- [x] Middleware de proteção de rotas
- [x] API para perfil do usuário

### Fase 3: Dashboard ✅
- [x] Layout do dashboard com sidebar
- [x] Página inicial do dashboard
- [x] Página de Organizações
- [x] Página de Configurações
- [x] Componentes de Card e metricas

### Fase 4: Modelo de Dados ✅
- [x] Schema SQL completo
- [x] Tipos TypeScript
- [x] API de Organizações
- [x] Suporte para multi-tenant

### Fase 5: Preparação Monetização 🔄
- [ ] Integração Stripe
- [ ] Planos e limites
- [ ] Controle de acesso por plano
- [ ] Webhooks de pagamento

### Fase 6: Documentação ✅
- [x] ARCHITECTURE.md
- [x] DEVELOPMENT.md
- [x] README.md

## Próximos Passos

1. **Executar Scripts SQL** - Criar tabelas no Supabase
2. **Ativar RLS** - Row Level Security em produção
3. **Integração Stripe** - Adicionar suporte a pagamentos
4. **Email Service** - Configurar notificações
5. **Admin Dashboard** - Painel de administração
6. **Mobile App** - React Native (opcional)

## Deployment

### Vercel (Recomendado)

```bash
# Push para GitHub
git push origin main

# Deployment automático via Vercel
# (Conecte seu repositório em https://vercel.com)
```

### Variáveis de Ambiente no Vercel

1. Acesse projeto no Vercel
2. Settings > Environment Variables
3. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Scripts Disponíveis

```bash
# Development
npm run dev          # Rodar dev server

# Build
npm run build        # Build para produção
npm start            # Iniciar prod server

# Linting
npm run lint         # ESLint
npm run format       # Prettier
```

## Segurança

- ✅ JWT tokens com Supabase Auth
- ✅ Row Level Security (RLS) no banco
- ✅ Middleware de proteção de rotas
- ✅ Validação de input em APIs
- ✅ HTTP-only cookies para sessão
- ✅ CORS configurado

## Performance

- ✅ Server-side rendering com Next.js
- ✅ Image optimization
- ✅ Code splitting automático
- ✅ Caching de dados
- ✅ Vercel Edge Network

## Contribuindo

Veja [DEVELOPMENT.md](./DEVELOPMENT.md) para instruções detalhadas sobre como contribuir e adicionar novas features.

## Suporte

Para problemas ou dúvidas:
1. Verifique a documentação em [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Veja troubleshooting em [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Abra uma issue no GitHub

## Licença

MIT - veja LICENSE para detalhes

---

**Status**: 🚀 Em Desenvolvimento Ativo

**Última Atualização**: 2024
