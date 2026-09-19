create table if not exists public.planner_sticky_pages (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Main',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planner_sticky_notes (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  page_id uuid not null references public.planner_sticky_pages(id) on delete cascade,
  text text not null default '',
  color text not null default 'lemon',
  style text not null default 'plain',
  x double precision not null default 24,
  y double precision not null default 24,
  rotation double precision not null default 0,
  done boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint planner_sticky_notes_color_check check (color in ('lemon','blush','sky','mint','peach','lilac')),
  constraint planner_sticky_notes_style_check check (style in ('plain','lined','grid','legal','stripe'))
);

create index if not exists planner_sticky_pages_owner_updated_idx on public.planner_sticky_pages(owner_id, updated_at desc);
create index if not exists planner_sticky_notes_owner_page_updated_idx on public.planner_sticky_notes(owner_id, page_id, updated_at desc);

alter table public.planner_sticky_pages enable row level security;
alter table public.planner_sticky_notes enable row level security;

drop policy if exists planner_sticky_pages_select_own on public.planner_sticky_pages;
drop policy if exists planner_sticky_pages_insert_own on public.planner_sticky_pages;
drop policy if exists planner_sticky_pages_update_own on public.planner_sticky_pages;
drop policy if exists planner_sticky_pages_delete_own on public.planner_sticky_pages;
create policy planner_sticky_pages_select_own on public.planner_sticky_pages for select using ((select auth.uid()) = owner_id);
create policy planner_sticky_pages_insert_own on public.planner_sticky_pages for insert with check ((select auth.uid()) = owner_id);
create policy planner_sticky_pages_update_own on public.planner_sticky_pages for update using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy planner_sticky_pages_delete_own on public.planner_sticky_pages for delete using ((select auth.uid()) = owner_id);

drop policy if exists planner_sticky_notes_select_own on public.planner_sticky_notes;
drop policy if exists planner_sticky_notes_insert_own on public.planner_sticky_notes;
drop policy if exists planner_sticky_notes_update_own on public.planner_sticky_notes;
drop policy if exists planner_sticky_notes_delete_own on public.planner_sticky_notes;
create policy planner_sticky_notes_select_own on public.planner_sticky_notes for select using ((select auth.uid()) = owner_id);
create policy planner_sticky_notes_insert_own on public.planner_sticky_notes for insert with check ((select auth.uid()) = owner_id);
create policy planner_sticky_notes_update_own on public.planner_sticky_notes for update using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy planner_sticky_notes_delete_own on public.planner_sticky_notes for delete using ((select auth.uid()) = owner_id);

