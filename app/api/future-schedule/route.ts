import { NextResponse } from 'next/server';
import { getAllTeams, getAllGames } from '@/lib/db';

export async function GET() {
  try {
    const teams = getAllTeams();
    const games = getAllGames();
    const teamMap = new Map(teams.map((t) => [t.id, t]));

    const matrix = teams.map((team) => {
      const weekMatchups: { [week: number]: { isHome: boolean; isBye: boolean; opponent?: any } } = {};

      for (let w = 1; w <= 18; w++) {
        if (team.bye_week === w) {
          weekMatchups[w] = { isHome: false, isBye: true };
          continue;
        }

        const game = games.find((g) => g.week === w && (g.home_team_id === team.id || g.away_team_id === team.id));
        if (game) {
          const isHome = game.home_team_id === team.id;
          const oppId = isHome ? game.away_team_id : game.home_team_id;
          const oppTeam = teamMap.get(oppId);

          weekMatchups[w] = {
            isHome,
            isBye: false,
            opponent: oppTeam
              ? {
                  id: oppTeam.id,
                  code: oppTeam.code,
                  name: oppTeam.name,
                  logo: oppTeam.logo_url,
                }
              : { code: oppId },
          };
        } else {
          weekMatchups[w] = { isHome: false, isBye: true };
        }
      }

      return {
        team,
        weeks: weekMatchups,
      };
    });

    return NextResponse.json({
      teams,
      matrix,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
