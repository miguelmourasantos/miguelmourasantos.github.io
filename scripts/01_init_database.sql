-- Users table (handled by Supabase Auth, but we add custom fields)
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

-- Enable RLS
alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_stats enable row level security;

-- Users RLS Policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Organizations RLS Policies
create policy "Users can view their organizations" on public.organizations
  for select using (
    owner_id = auth.uid() or exists(
      select 1 from public.team_members tm
      join public.teams t on tm.team_id = t.id
      where t.organization_id = organizations.id and tm.user_id = auth.uid()
    )
  );

create policy "Users can create organizations" on public.organizations
  for insert with check (owner_id = auth.uid());

create policy "Organization owners can update" on public.organizations
  for update using (owner_id = auth.uid());

-- Teams RLS Policies
create policy "Team members can view teams" on public.teams
  for select using (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = teams.id and tm.user_id = auth.uid()
    )
  );

-- Team Members RLS Policies
create policy "Users can view their team memberships" on public.team_members
  for select using (user_id = auth.uid());

-- Subscriptions RLS Policies
create policy "Users can view their subscriptions" on public.subscriptions
  for select using (user_id = auth.uid());

-- Usage Stats RLS Policies
create policy "Users can view their usage stats" on public.usage_stats
  for select using (user_id = auth.uid());

create policy "Users can insert usage stats" on public.usage_stats
  for insert with check (user_id = auth.uid());
