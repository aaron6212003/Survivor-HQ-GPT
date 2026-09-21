import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type OddsGame = { away: string; home: string; spread: string | null; total: string | null; updatedAt: string };
type Cache = { expiresAt: number; games: OddsGame[]; updatedAt: string; notice?: string };
const globalCache = globalThis as typeof globalThis & { survivorOddsCache?: Cache };

function refreshWindow() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now);
  const day = parts.find(p => p.type === 'weekday')?.value;
  const hour = Number(parts.find(p => p.type === 'hour')?.value || 0);
  const gameWindow = (day === 'Thu' && hour >= 18) || (day === 'Sun' && hour >= 11) || (day === 'Mon' && hour >= 18);
  return gameWindow ? 30 * 60_000 : 6 * 60 * 60_000;
}

export async function GET() {
  const cached = globalCache.survivorOddsCache;
  if (cached && cached.expiresAt > Date.now()) return NextResponse.json({ ...cached, cached: true }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  const key = process.env.ODDS_API_KEY;
  if (!key) return NextResponse.json({ games: [], updatedAt: null, notice: 'Lines are not configured yet.' });

  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${encodeURIComponent(key)}&regions=us&markets=spreads,totals&oddsFormat=american`, { cache: 'no-store' });
    const remaining = Number(response.headers.get('x-requests-remaining') || '500');
    if (remaining < 100) {
      const result = { games: cached?.games || [], updatedAt: cached?.updatedAt || new Date().toISOString(), notice: 'Lines are paused to preserve this month’s free allowance.' };
      globalCache.survivorOddsCache = { ...result, expiresAt: Date.now() + 6 * 60 * 60_000 };
      return NextResponse.json(result);
    }
    if (!response.ok) throw new Error(`Odds provider returned ${response.status}`);
    const data = await response.json();
    const updatedAt = new Date().toISOString();
    const games: OddsGame[] = data.map((event: any) => {
      const bookmaker = event.bookmakers?.[0];
      const spreadMarket = bookmaker?.markets?.find((market: any) => market.key === 'spreads');
      const totalMarket = bookmaker?.markets?.find((market: any) => market.key === 'totals');
      const homeSpread = spreadMarket?.outcomes?.find((outcome: any) => outcome.name === event.home_team)?.point;
      const total = totalMarket?.outcomes?.[0]?.point;
      return { away: event.away_team, home: event.home_team, spread: typeof homeSpread === 'number' ? `${homeSpread > 0 ? '+' : ''}${homeSpread}` : null, total: typeof total === 'number' ? String(total) : null, updatedAt };
    });
    globalCache.survivorOddsCache = { games, updatedAt, expiresAt: Date.now() + refreshWindow() };
    return NextResponse.json({ games, updatedAt, cached: false }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  } catch {
    return NextResponse.json({ games: cached?.games || [], updatedAt: cached?.updatedAt || null, notice: 'Lines are temporarily unavailable.' });
  }
}
