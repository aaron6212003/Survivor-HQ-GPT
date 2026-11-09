-- One saved MNF Bingo board per signed-in player and NFL event.
create table if not exists public.hq_bingo_boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  season integer not null,
  week integer not null,
  board jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, event_id)
);

alter table public.hq_bingo_boards enable row level security;

create policy "Players can view their own Bingo boards"
on public.hq_bingo_boards for select
using (auth.uid() = user_id);

create policy "Players can create their own Bingo boards"
on public.hq_bingo_boards for insert
with check (auth.uid() = user_id);

create policy "Players can update their own Bingo boards"
on public.hq_bingo_boards for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
