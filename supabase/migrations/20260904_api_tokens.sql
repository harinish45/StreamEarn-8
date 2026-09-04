-- Run this once in the Supabase SQL editor for this project before using the
-- "API access" section in Settings or the /api/mcp endpoint. Nothing in the
-- app runs migrations automatically -- this is a one-time manual step.

create table if not exists public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'API token',
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists api_tokens_owner_id_idx on public.api_tokens(owner_id);

alter table public.api_tokens enable row level security;

-- Only the owning user can see or manage their own tokens via the normal
-- session-authenticated client. The /api/mcp route resolves a token to its
-- owner using the service-role admin client, which bypasses RLS by design
-- (the same pattern already used by src/lib/supabase/admin.ts elsewhere in
-- this app), so this policy only needs to cover the browser-facing path.
create policy "owner can manage own api tokens" on public.api_tokens
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
