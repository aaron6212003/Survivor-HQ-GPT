-- Additive: leaves the existing account, league tables, and records untouched.
-- Practice league data is accessible only through the app's validated server API.
begin;
create table if not exists public.hq_practice_leagues (
  code text primary key check (code ~ '^[A-F0-9]{8}$'),
  state jsonb not null check (jsonb_typeof(state) = 'object' and state->>'code' = code),
  revision bigint not null default 1 check (revision > 0),
  created_at timestamptz not null default now()
);
alter table public.hq_practice_leagues enable row level security;
revoke all on public.hq_practice_leagues from public, anon, authenticated;
grant select, insert, update on public.hq_practice_leagues to service_role;
comment on table public.hq_practice_leagues is 'Friends beta practice leagues. Server-only access; optimistic revision checks prevent concurrent lost updates.';
commit;
