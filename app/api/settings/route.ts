import { NextResponse } from 'next/server';
import { getSettings, updateSettings, resetPoolData } from '@/lib/db';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    updateSettings(body);
    const updated = getSettings();
    return NextResponse.json({ settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'reset') {
      resetPoolData();
      return NextResponse.json({ success: true, message: 'Pool reset to seed default data successfully.' });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
