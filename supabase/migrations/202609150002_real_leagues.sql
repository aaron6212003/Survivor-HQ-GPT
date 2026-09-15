begin;
create table if not exists public.hq_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (length(display_name) between 2 and 40),
 avatar text not null default '🏈',
 updated_at timestamptz not null default now()
);
create table if not exists public.hq_leagues (
 id uuid primary key,
 code text unique not null check (code ~ '^[A-Z2-9]{6}$'),
 member_ids uuid[] not null,
 state jsonb not null check (jsonb_typeof(state)='object' and state->>'id'=id::text and state->>'code'=code),
 revision bigint not null default 1,
 created_at timestamptz not null default now()
);
create index if not exists hq_leagues_members on public.hq_leagues using gin(member_ids);
create table if not exists public.hq_nfl_weeks (
 season integer not null,
 week integer not null check (week between 1 and 18),
 games jsonb not null check (jsonb_typeof(games)='array'),
 updated_at timestamptz not null,
 primary key(season,week)
);
alter table public.hq_profiles enable row level security;
alter table public.hq_leagues enable row level security;
alter table public.hq_nfl_weeks enable row level security;
revoke all on public.hq_profiles,public.hq_leagues,public.hq_nfl_weeks from public,anon,authenticated;
grant select,insert,update,delete on public.hq_profiles,public.hq_leagues,public.hq_nfl_weeks to service_role;
comment on table public.hq_leagues is 'Real account-based leagues. Server authenticates Supabase users, validates ownership and game deadlines, and uses revision-checked writes.';
commit;
