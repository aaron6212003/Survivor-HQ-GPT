import { NextResponse } from 'next/server';
import { getAllGames, getAllTeams } from '@/lib/db';
import { fetchEspnLiveScoreboard } from '@/lib/espnApi';

const cache = globalThis as typeof globalThis & { hqTeamsCache?: { at:number; teams:any[] } };
export const dynamic = 'force-dynamic';

export async function GET() {
  const cached = cache.hqTeamsCache;
  if (cached && Date.now() - cached.at < 10 * 60_000) return NextResponse.json({ teams: cached.teams, cached: true });
  const teams = getAllTeams(); const games = getAllGames();
  const playedWeeks = Array.from(new Set(games.filter(game => game.kickoff_at && Date.parse(game.kickoff_at) <= Date.now()).map(game => game.week)));
  const liveWeeks = await Promise.all(playedWeeks.map(fetchEspnLiveScoreboard));
  const results = new Map<string, { homeScore?:number; awayScore?:number; complete:boolean }>();
  for (const week of liveWeeks) for (const game of week) results.set(`${game.homeTeamId}_${game.awayTeamId}`, { homeScore: game.homeScore, awayScore: game.awayScore, complete: game.isCompleted });
  const records = new Map(teams.map(team => [team.id, { wins:0, losses:0, ties:0 }]));
  for (const game of games) {
    const live = results.get(`${game.home_team_id}_${game.away_team_id}`);
    if (!live?.complete || typeof live.homeScore !== 'number' || typeof live.awayScore !== 'number') continue;
    const homeScore = live.homeScore; const awayScore = live.awayScore;
    const home = records.get(game.home_team_id)!; const away = records.get(game.away_team_id)!;
    if (homeScore > awayScore) { home.wins++; away.losses++; } else if (awayScore > homeScore) { away.wins++; home.losses++; } else { home.ties++; away.ties++; }
  }
  const response = teams.map(team => ({ ...team, ...(records.get(team.id) || {}) })); cache.hqTeamsCache = { at: Date.now(), teams: response };
  return NextResponse.json({ teams: response }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
}
