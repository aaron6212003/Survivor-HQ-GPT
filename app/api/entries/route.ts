import { NextResponse } from 'next/server';
import { getAllEntries, updateEntry, getActivityLogs } from '@/lib/db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = getAllEntries();
    const activityLogs = getActivityLogs(30);
    return NextResponse.json({ entries, activityLogs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name } = body;
    if (!id || !name) {
      return NextResponse.json({ error: 'Missing required parameters: id, name' }, { status: 400 });
    }
    updateEntry(id, name);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
