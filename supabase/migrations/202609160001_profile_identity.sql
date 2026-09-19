-- Survivor HQ profile identity and cosmetic preferences
alter table public.hq_profiles
 add column if not exists favorite_team text,
 add column if not exists jersey_number integer,
 add column if not exists bio text;
alter table public.hq_profiles
 drop constraint if exists hq_profiles_favorite_team_check;
alter table public.hq_profiles
 add constraint hq_profiles_favorite_team_check check (favorite_team is null or favorite_team in ('ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN','DET','GB','HOU','IND','JAX','KC','LV','LAC','LAR','MIA','MIN','NE','NO','NYG','NYJ','PHI','PIT','SEA','SF','TB','TEN','WAS'));
alter table public.hq_profiles
 drop constraint if exists hq_profiles_jersey_number_check;
alter table public.hq_profiles
 add constraint hq_profiles_jersey_number_check check (jersey_number is null or jersey_number between 0 and 99);
alter table public.hq_profiles
 drop constraint if exists hq_profiles_bio_length_check;
alter table public.hq_profiles
 add constraint hq_profiles_bio_length_check check (bio is null or length(bio) <= 80);
