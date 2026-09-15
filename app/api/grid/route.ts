import { NextResponse } from 'next/server';
import { getAllEntries, getAllPicks, getAllTeams, getSettings } from '@/lib/db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = getAllEntries();
    const picks = getAllPicks();
    const teams = getAllTeams();
    const settings = getSettings();
    const teamMap = new Map(teams.map((t) => [t.id, t]));

    const grid = entries.map((entry) => {
      const entryPicks = picks.filter((p) => p.entry_id === entry.id);
      const weeksMap: { [week: number]: any } = {};

      for (let w = 1; w <= 18; w++) {
        const pick = entryPicks.find((p) => p.week === w);
        if (pick && pick.team_id) {
          const t = teamMap.get(pick.team_id);
          weeksMap[w] = {
            pickId: pick.id,
            teamId: pick.team_id,
            teamCode: t?.code || pick.team_id,
            teamLogo: t?.logo_url,
            status: pick.status,
          };
        } else {
          weeksMap[w] = null;
        }
      }

      return {
        entry,
        weeks: weeksMap,
      };
    });

    return NextResponse.json({
      settings,
      grid,
      teams,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
