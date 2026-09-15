import { NextResponse } from 'next/server';
import { getAllPicks, getSettings, getAllTeams } from '@/lib/db';
import { getLiveMergedSchedule } from '@/lib/espnApi';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const settings = getSettings();
    const weekParam = searchParams.get('week');
    const week = weekParam ? parseInt(weekParam, 10) : settings.current_week;

    const baseGames = await getLiveMergedSchedule(week);
    const teams = getAllTeams();
    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const picks = getAllPicks();

    // Attach home_team and away_team objects + pick count info
    const gamesWithPickInfo = baseGames.map((game) => {
      const homePicks = picks.filter((p) => p.week === week && p.team_id === game.home_team_id);
      const awayPicks = picks.filter((p) => p.week === week && p.team_id === game.away_team_id);

      return {
        ...game,
        home_team: teamMap.get(game.home_team_id),
        away_team: teamMap.get(game.away_team_id),
        homePickCount: homePicks.length,
        awayPickCount: awayPicks.length,
        homePickEntryIds: homePicks.map((p) => p.entry_id),
        awayPickEntryIds: awayPicks.map((p) => p.entry_id),
      };
    });

    return NextResponse.json(
      {
        week,
        currentWeek: settings.current_week,
        games: gamesWithPickInfo,
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
