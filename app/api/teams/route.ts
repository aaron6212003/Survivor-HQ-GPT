import { NextResponse } from 'next/server';
import { getAllTeams } from '@/lib/db';

export async function GET() {
  try {
    const teams = getAllTeams();
    return NextResponse.json({ teams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
