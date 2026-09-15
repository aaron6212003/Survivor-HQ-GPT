import { NextResponse } from 'next/server';
import { getAllEntries, getAllPicks, getAllTeams } from '@/lib/db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teams = getAllTeams();
    const entries = getAllEntries();
    const picks = getAllPicks();

    const matrix = teams.map((team) => {
      const entryStatuses: { [entryId: string]: { status: 'AVAILABLE' | 'USED'; week?: number } } = {};

      for (const entry of entries) {
        const usedPick = picks.find((p) => p.entry_id === entry.id && p.team_id === team.id);
        if (usedPick) {
          entryStatuses[entry.id] = {
            status: 'USED',
            week: usedPick.week,
          };
        } else {
          entryStatuses[entry.id] = {
            status: 'AVAILABLE',
          };
        }
      }

      return {
        team,
        entries: entryStatuses,
      };
    });

    return NextResponse.json({
      teams,
      entries,
      matrix,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
