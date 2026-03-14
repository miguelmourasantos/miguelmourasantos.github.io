#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Erro: Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
});

const setupDatabase = async () => {
  try {
    console.log('[v0] Iniciando setup do banco de dados...\n');

    // Create users table
    console.log('[v0] Criando tabela users...');
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL UNIQUE,
          first_name TEXT,
          last_name TEXT,
          avatar_url TEXT,
          plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `,
    });
    if (usersError) console.error('[v0] Erro em users:', usersError);
    else console.log('[v0] ✓ Tabela users criada\n');

    // Create organizations table
    console.log('[v0] Criando tabela organizations...');
    const { error: orgsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.organizations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          avatar_url TEXT,
          owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `,
    });
    if (orgsError) console.error('[v0] Erro em organizations:', orgsError);
    else console.log('[v0] ✓ Tabela organizations criada\n');

    // Create teams table
    console.log('[v0] Criando tabela teams...');
    const { error: teamsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.teams (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `,
    });
    if (teamsError) console.error('[v0] Erro em teams:', teamsError);
    else console.log('[v0] ✓ Tabela teams criada\n');

    // Create team_members table
    console.log('[v0] Criando tabela team_members...');
    const { error: membersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.team_members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          UNIQUE(team_id, user_id)
        );
      `,
    });
    if (membersError) console.error('[v0] Erro em team_members:', membersError);
    else console.log('[v0] ✓ Tabela team_members criada\n');

    // Create subscriptions table
    console.log('[v0] Criando tabela subscriptions...');
    const { error: subsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.subscriptions (
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
      `,
    });
    if (subsError) console.error('[v0] Erro em subscriptions:', subsError);
    else console.log('[v0] ✓ Tabela subscriptions criada\n');

    // Create usage_stats table
    console.log('[v0] Criando tabela usage_stats...');
    const { error: statsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.usage_stats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
          metric TEXT NOT NULL,
          value INTEGER NOT NULL DEFAULT 0,
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `,
    });
    if (statsError) console.error('[v0] Erro em usage_stats:', statsError);
    else console.log('[v0] ✓ Tabela usage_stats criada\n');

    console.log('[v0] ✓ Setup do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('[v0] Erro ao setupar banco de dados:', error);
    process.exit(1);
  }
};

setupDatabase();
