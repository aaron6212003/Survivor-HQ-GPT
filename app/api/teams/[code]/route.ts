import { NextResponse } from 'next/server';
import { getTeamByCode, getAllGames, getAllTeams } from '@/lib/db';
import { fetchEspnLiveScoreboard } from '@/lib/espnApi';

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

    // Fetch live ESPN data for Week 1 (and current season)
    const espnLiveGames = await fetchEspnLiveScoreboard(1);
    const espnMap = new Map<string, any>();
    for (const eg of espnLiveGames) {
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

