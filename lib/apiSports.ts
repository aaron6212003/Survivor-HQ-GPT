type Injury = { player: string; position?: string; status?: string };
type Cached = { expiresAt: number; byTeam: Map<string, Injury[]> };
const globalCache = globalThis as typeof globalThis & { pickemHqInjuryCache?: Cached };

/** API-NFL's league injury report is fetched at most once every six hours. */
export async function getNflInjuries() {
  const cached = globalCache.pickemHqInjuryCache;
  if (cached && cached.expiresAt > Date.now()) return cached.byTeam;
  const key = process.env.API_NFL_KEY;
  if (!key) return new Map<string, Injury[]>();
  try {
    const response = await fetch('https://v1.american-football.api-sports.io/injuries?league=1&season=2026', { headers: { 'x-apisports-key': key }, cache: 'no-store' });
    if (!response.ok) throw new Error(`API-NFL returned ${response.status}`);
    const payload = await response.json();
    const byTeam = new Map<string, Injury[]>();
    for (const item of payload.response || []) {
      const team = String(item.team?.name || '').toLowerCase();
      if (!team) continue;
      const injuries = byTeam.get(team) || [];
      injuries.push({ player: item.player?.name || item.player?.firstname || 'Player', position: item.player?.position, status: item.player?.reason || item.type || item.status });
      byTeam.set(team, injuries);
    }
    globalCache.pickemHqInjuryCache = { byTeam, expiresAt: Date.now() + 6 * 60 * 60_000 };
    return byTeam;
  } catch { return cached?.byTeam || new Map<string, Injury[]>(); }
}
