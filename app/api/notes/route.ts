import { NextResponse } from 'next/server';
import { getNotesForEntry, saveNote } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get('entryId');
    if (!entryId) {
      return NextResponse.json({ error: 'entryId query parameter is required' }, { status: 400 });
    }
    const notes = getNotesForEntry(entryId);
    return NextResponse.json({ notes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entryId, week, noteText } = body;

    if (!entryId || !week) {
      return NextResponse.json({ error: 'Missing entryId or week' }, { status: 400 });
    }

    saveNote(entryId, week, noteText || '');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
