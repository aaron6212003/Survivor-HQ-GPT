-- Pickem HQ Pro: server-only entitlements and optional cosmetic preferences.
begin;
create table if not exists public.hq_user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro')),
  source text not null default 'manual' check (source in ('manual','web','app_store')),
  active_until timestamptz,
  updated_at timestamptz not null default now()
);
create table if not exists public.hq_developer_pro_overrides (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists public.hq_profile_customizations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'default' check (theme in ('default','blackout','midnight','ice','classic')),
  banner text not null default 'none' check (banner in ('none','sideline','stadium','film-room')),
  accent text not null default 'emerald' check (accent in ('emerald','ice','gold','crimson','violet')),
  frame text not null default 'none' check (frame in ('none','line','champion','classic')),
  app_icon text not null default 'default' check (app_icon in ('default','midnight','ice')),
  badge_preferences jsonb not null default '[]'::jsonb check (jsonb_typeof(badge_preferences)='array'),
  updated_at timestamptz not null default now()
);
create table if not exists public.hq_user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null check (achievement_key in ('survive_5_weeks','survive_10_weeks','pool_champion','perfect_pickem_week')),
  unlocked_at timestamptz not null default now(),
  primary key (user_id,achievement_key)
);
create table if not exists public.hq_league_customizations (
  league_id uuid primary key references public.hq_leagues(id) on delete cascade,
  logo_url text,
  banner text not null default 'default' check (banner in ('default','stadium','film-room','midnight')),
  accent text not null default 'emerald' check (accent in ('emerald','ice','gold','crimson','violet')),
  theme text not null default 'default' check (theme in ('default','blackout','midnight','classic')),
  trophy text not null default 'standard' check (trophy in ('standard','cup','shield','star')),
  chat_style text not null default 'default' check (chat_style in ('default','compact','classic')),
  updated_at timestamptz not null default now()
);
alter table public.hq_user_entitlements enable row level security;
alter table public.hq_developer_pro_overrides enable row level security;
alter table public.hq_profile_customizations enable row level security;
alter table public.hq_user_achievements enable row level security;
alter table public.hq_league_customizations enable row level security;
revoke all on public.hq_user_entitlements,public.hq_developer_pro_overrides,public.hq_profile_customizations,public.hq_user_achievements,public.hq_league_customizations from public,anon,authenticated;
grant select,insert,update,delete on public.hq_user_entitlements,public.hq_developer_pro_overrides,public.hq_profile_customizations,public.hq_user_achievements,public.hq_league_customizations to service_role;
comment on table public.hq_user_entitlements is 'Trusted entitlement source. Future Stripe/App Store webhooks write this table.';
comment on table public.hq_developer_pro_overrides is 'Server-only development override; endpoint allows only the authenticated Pickem HQ owner.';
commit;
