import { NextResponse } from 'next/server';
import { getSettings, getDashboardSummaries, getAllEntries } from '@/lib/db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = getSettings();
    const summaries = getDashboardSummaries(settings.current_week);
    const entries = getAllEntries();

    const totalEntries = entries.length;
    const aliveCount = entries.filter((e) => e.status === 'alive').length;
    const eliminatedCount = totalEntries - aliveCount;
    const pendingPicksCount = summaries.filter(
      (s) => s.entry.status === 'alive' && (!s.currentPick || s.currentPick.status === 'pending')
    ).length;

    return NextResponse.json(
      {
        settings,
        totalEntries,
        aliveCount,
        eliminatedCount,
        pendingPicksCount,
        summaries,
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
