-- Keep existing profile records; restrict the old public email-bearing profile table.
alter policy "Read Profiles" on public.profiles using (auth.uid() = id);
