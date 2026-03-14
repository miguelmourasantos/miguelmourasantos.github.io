-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_stats enable row level security;

-- Users RLS Policies
drop policy if exists "Users can view their own data" on public.users;
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own data" on public.users;
create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Organizations RLS Policies - view own or member's organizations
drop policy if exists "Users can view their organizations" on public.organizations;
create policy "Users can view their organizations" on public.organizations
  for select using (
    owner_id = auth.uid() or exists(
      select 1 from public.team_members tm
      join public.teams t on tm.team_id = t.id
      where t.organization_id = organizations.id and tm.user_id = auth.uid()
    )
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations" on public.organizations
  for insert with check (owner_id = auth.uid());

drop policy if exists "Organization owners can update" on public.organizations;
create policy "Organization owners can update" on public.organizations
  for update using (owner_id = auth.uid());

-- Teams RLS Policies - view if member
drop policy if exists "Team members can view teams" on public.teams;
create policy "Team members can view teams" on public.teams
  for select using (
    exists(
      select 1 from public.team_members tm
      where tm.team_id = teams.id and tm.user_id = auth.uid()
    )
  );

-- Team Members RLS Policies
drop policy if exists "Users can view their team memberships" on public.team_members;
create policy "Users can view their team memberships" on public.team_members
  for select using (user_id = auth.uid());

-- Subscriptions RLS Policies
drop policy if exists "Users can view their subscriptions" on public.subscriptions;
create policy "Users can view their subscriptions" on public.subscriptions
  for select using (user_id = auth.uid());

-- Usage Stats RLS Policies
drop policy if exists "Users can view their usage stats" on public.usage_stats;
create policy "Users can view their usage stats" on public.usage_stats
  for select using (user_id = auth.uid());

drop policy if exists "Users can insert usage stats" on public.usage_stats;
create policy "Users can insert usage stats" on public.usage_stats
  for insert with check (user_id = auth.uid());
