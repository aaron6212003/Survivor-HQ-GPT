# Survivor HQ — development copy

This is a working copy of the supplied archive. The original archive is untouched.

## Verified practice league

Open `/test-league`. This is the working multi-player practice flow for Survivor and straight Pick’em. It uses clearly labeled simulated games and no buy-ins. It does not claim to be a live NFL competition.

- Create a league and join with a code or invitation link.
- One entry per player; up to 50 players per league.
- Each player gets a private access key. Keep it for another device or browser. It grants control of that player, including commissioner controls for the creator. There is no email recovery yet.
- Picks are saved on the server, scoped to the player and league, and hidden from others until lock.
- The commissioner locks the round and records all four practice results. Joining closes at the first lock.
- Survivor: one pick, no team reuse, loss/tie/missing pick eliminates.
- Pick’em: one point per correct pick, zero for ties/missing picks.
- Results are final and score once. Eight practice rounds; the same eight teams repeat.
- Use Refresh to fetch other players’ changes. The server always checks the current lock state before saving.

## Run locally

Requires Node 20+ and npm. The hosted practice API requires the Supabase environment variables described below.

```sh
npm ci
npm test
npm run build
npm start -- --hostname 127.0.0.1
```

Open http://127.0.0.1:3000/test-league.

## Shared storage and deployment

The hosted API uses Supabase table `hq_practice_leagues`. Apply the versioned SQL in `supabase/migrations/202609150001_practice_leagues.sql`. It is additive and leaves the original tables and account untouched.

Configure these Vercel environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and **server-only** `SUPABASE_SERVICE_ROLE_KEY`. Never prefix the service key with `NEXT_PUBLIC_` or include it in a client bundle. The table denies direct public and signed-in client access. Only the server reads/writes it; validated player keys authorize actions.

Each update compares the stored revision. A conflict retries after reading the latest state and revalidating the rules. That prevents lost saves and enforces locks during simultaneous requests across Vercel instances.

The browser stores each player's original access key; the database stores only its hash. The practice flow does not yet use Supabase account sign-in or email recovery. A private key grants control of its player. Share invitation codes, never private keys.

The local file adapter is retained only for regression tests. Hosted practice saves no longer depend on a local file or one server process. Legacy NFL routes still have the limitations below.

## Checks added

`npm test` runs multi-player scenarios covering creation, joining, duplicate names, invalid access, cross-league access, commissioner-only operations, hidden picks, pick replacement, invalid matchups, lock enforcement, late joining, missing picks, elimination, reuse, tie scoring, cumulative Pick’em scoring, and protection against double scoring.

`npm run build` compiles and type-checks all existing app routes. Browser QA also exercised create, submit, and join as another player. Repository tests cover simultaneous joins and a pick racing a commissioner lock.

## Existing app audit / next release gates

The original pages remain available as the original workspace. They are not yet safe to treat as a multi-user live league:

1. **Unify persistence and identity.** Legacy routes use global JSON entries; browser caches and Supabase use incompatible records. Several write endpoints do not authenticate callers.
2. **Repair real league creation/joining.** Existing creation can invent a local ID after a failed insert; joining only navigates. Supply versioned Supabase migrations with membership/ownership policies and transactional creation/joining.
3. **Move real picks to the same league model.** Pick’em remains browser-only in the original route. Remove success fallbacks and add authenticated, league-scoped entry and pick APIs.
4. **Verify live NFL data.** Audit schedule sources, kickoff/time zones, final scores, tie rules, postponements, season boundaries and result corrections. The practice route deliberately avoids depending on that data.
5. **Build complete league administration.** Real deadlines, multiple entries, invitations, account recovery, round history, commissioner audit trail and correction workflows.
6. **Remote release.** Review actual Supabase schema/configuration, configure durable hosted persistence, add request rate limits, and exercise two independent devices before inviting friends.

One existing issue is already fixed: rejected password logins no longer fabricate a logged-in user.
