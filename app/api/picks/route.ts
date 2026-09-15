import { NextResponse } from 'next/server';
import {
  getAllPicks,
  setPick,
  setBulkPicks,
  updatePickStatus,
  getAllEntries,
  getAllTeams,
  getGamesForWeek,
  getSettings,
} from '@/lib/db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const weekParam = searchParams.get('week');
    const settings = getSettings();
    const week = weekParam ? parseInt(weekParam, 10) : settings.current_week;

    const entries = getAllEntries();
    const teams = getAllTeams();
    const games = getGamesForWeek(week);
    const allPicks = getAllPicks();

    return NextResponse.json(
      {
        week,
        settings,
        entries,
        teams,
        games,
        picks: allPicks,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body.picks)) {
      setBulkPicks(body.picks);
      return NextResponse.json({ success: true, count: body.picks.length });
    }

    const { entryId, week, teamId, status } = body;

    if (!entryId || !week || !teamId) {
      return NextResponse.json({ error: 'Missing required parameters: entryId, week, teamId' }, { status: 400 });
    }

    setPick(entryId, week, teamId, status || 'pending');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body.locks)) {
      for (const item of body.locks) {
        if (item.entryId && item.week && item.status) {
          updatePickStatus(item.entryId, item.week, item.status);
        }
      }
      return NextResponse.json({ success: true, count: body.locks.length });
    }

    const { entryId, week, status } = body;

    if (!entryId || !week || !status) {
      return NextResponse.json({ error: 'Missing required parameters: entryId, week, status' }, { status: 400 });
    }

    updatePickStatus(entryId, week, status);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
