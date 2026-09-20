create table if not exists public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_account_id text,
  account_email text,
  account_name text,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_integrations_provider_check check (provider in ('google','github')),
  constraint user_integrations_owner_provider_key unique (owner_id, provider)
);

create index if not exists user_integrations_owner_updated_idx
  on public.user_integrations(owner_id, updated_at desc);

alter table public.user_integrations enable row level security;

drop policy if exists user_integrations_select_own on public.user_integrations;
drop policy if exists user_integrations_insert_own on public.user_integrations;
drop policy if exists user_integrations_update_own on public.user_integrations;
drop policy if exists user_integrations_delete_own on public.user_integrations;

create policy user_integrations_select_own
  on public.user_integrations for select
  using ((select auth.uid()) = owner_id);

create policy user_integrations_insert_own
  on public.user_integrations for insert
  with check ((select auth.uid()) = owner_id);

create policy user_integrations_update_own
  on public.user_integrations for update
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy user_integrations_delete_own
  on public.user_integrations for delete
  using ((select auth.uid()) = owner_id);
