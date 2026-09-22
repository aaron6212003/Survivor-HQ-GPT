import { NextResponse } from 'next/server';
import { getTeamByCode, getAllGames, getAllTeams } from '@/lib/db';
import { fetchEspnLiveScoreboard } from '@/lib/espnApi';

const liveCache = new Map<string, { at: number; games: Awaited<ReturnType<typeof fetchEspnLiveScoreboard>> }>();
async function liveWeek(week: number) {
  const cached = liveCache.get(String(week));
  if (cached && Date.now() - cached.at < 10 * 60_000) return cached.games;
  const games = await fetchEspnLiveScoreboard(week);
  liveCache.set(String(week), { at: Date.now(), games });
  return games;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { code: string } }) {
  try {
    const code = params.code.toUpperCase();
    const team = getTeamByCode(code);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const allGames = getAllGames();
    const allTeams = getAllTeams();
    const teamMap = new Map(allTeams.map((t) => [t.id, t]));

    // Refresh only weeks that have reached kickoff. Results are shared in a short server cache.
    const playedWeeks = Array.from(new Set(allGames.filter((game) => {
      const kickoff = game.kickoff_at ? Date.parse(game.kickoff_at) : (game.game_date ? Date.parse(`${game.game_date} ${game.game_time || '00:00'}`) : NaN);
      return Number.isFinite(kickoff) && kickoff <= Date.now();
    }).map((game) => game.week)));
    const liveWeeks = await Promise.all(playedWeeks.map(liveWeek));
    const espnMap = new Map<string, any>();
    for (let index = 0; index < liveWeeks.length; index += 1) {
      const week = playedWeeks[index];
      for (const eg of liveWeeks[index]) {
        espnMap.set(`${week}:${eg.homeTeamId}_${eg.awayTeamId}`, eg);
        espnMap.set(`${week}:${eg.awayTeamId}_${eg.homeTeamId}`, eg);
      }
    }

    const teamGames = allGames
      .filter((g) => g.home_team_id === team.id || g.away_team_id === team.id)
      .map((g) => {
        const isHome = g.home_team_id === team.id;
        const oppId = isHome ? g.away_team_id : g.home_team_id;
        const opponent = teamMap.get(oppId);

        const espnMatch = espnMap.get(`${g.week}:${g.home_team_id}_${g.away_team_id}`);

        // The bundled schedule deliberately supplies only fixtures. Completed scores must
        // come from the live scoreboard so placeholder results can never affect records.
        let status: 'scheduled' | 'in_progress' | 'final' = 'scheduled';
        let homeScore: number | undefined;
        let awayScore: number | undefined;
        let winnerTeamId: string | undefined;
        let statusDetail = g.game_date && g.game_time ? `${g.game_date} • ${g.game_time} ET` : 'Scheduled';

        if (espnMatch) {
          if (espnMatch.isCompleted) status = 'final';
          else if (espnMatch.statusState === 'in') status = 'in_progress';
          homeScore = espnMatch.homeScore;
          awayScore = espnMatch.awayScore;
          winnerTeamId = espnMatch.winnerTeamId;
          statusDetail = espnMatch.statusDetail || statusDetail;
        }

        let result: 'WIN' | 'LOSS' | 'TIE' | undefined = undefined;
        if (status === 'final' && winnerTeamId) {
          if (winnerTeamId === team.id) result = 'WIN';
          else result = 'LOSS';
        } else if (status === 'final' && !winnerTeamId) {
          result = 'TIE';
        }

        return {
          id: g.id,
          week: g.week,
          status,
          statusDetail,
          game_date: g.game_date,
          game_time: g.game_time,
          tv_network: espnMatch?.tvNetwork || g.tv_network,
          isHome,
          opponent,
          teamScore: isHome ? homeScore : awayScore,
          oppScore: isHome ? awayScore : homeScore,
          result,
        };
      });

    const liveRecord = teamGames.reduce((record, game) => {
      if (game.status !== 'final' || !game.result) return record;
      if (game.result === 'WIN') record.wins += 1;
      else if (game.result === 'LOSS') record.losses += 1;
      else record.ties += 1;
      return record;
    }, { wins: 0, losses: 0, ties: 0 });

    return NextResponse.json(
      {
        team: { ...team, ...liveRecord },
        schedule: teamGames,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

