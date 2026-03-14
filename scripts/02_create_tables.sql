-- Users table (custom fields alongside Supabase Auth)
create table if not exists public.users (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Organizations table
create table if not exists public.organizations (
  id uuid not null primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  avatar_url text,
  owner_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Teams table
create table if not exists public.teams (
  id uuid not null primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Team Members table
create table if not exists public.team_members (
  id uuid not null primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone not null default now(),
  unique(team_id, user_id)
);

-- Subscriptions table
create table if not exists public.subscriptions (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan text not null check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Usage Stats table
create table if not exists public.usage_stats (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric text not null,
  value integer not null default 0,
  timestamp timestamp with time zone not null default now()
);
