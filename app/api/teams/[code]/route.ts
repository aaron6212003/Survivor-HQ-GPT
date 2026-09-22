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
    for (const weekGames of liveWeeks) for (const eg of weekGames) {
      espnMap.set(`${eg.homeTeamId}_${eg.awayTeamId}`, eg);
      espnMap.set(`${eg.awayTeamId}_${eg.homeTeamId}`, eg);
    }

    const teamGames = allGames
      .filter((g) => g.home_team_id === team.id || g.away_team_id === team.id)
      .map((g) => {
        const isHome = g.home_team_id === team.id;
        const oppId = isHome ? g.away_team_id : g.home_team_id;
        const opponent = teamMap.get(oppId);

        const espnMatch = espnMap.get(`${g.home_team_id}_${g.away_team_id}`);

        let status = g.status;
        let homeScore = g.home_score;
        let awayScore = g.away_score;
        let winnerTeamId = g.winner_team_id;
        let statusDetail = g.game_date && g.game_time ? `${g.game_date} • ${g.game_time} ET` : 'Scheduled';

        if (espnMatch) {
          if (espnMatch.isCompleted) {
            status = 'final';
          } else if (espnMatch.statusState === 'in') {
            status = 'in_progress';
          }
          if (espnMatch.homeScore !== undefined) homeScore = espnMatch.homeScore;
          if (espnMatch.awayScore !== undefined) awayScore = espnMatch.awayScore;
          if (espnMatch.winnerTeamId) winnerTeamId = espnMatch.winnerTeamId;
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

    return NextResponse.json(
      {
        team,
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

