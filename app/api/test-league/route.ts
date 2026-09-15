import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { transactPractice } from '@/lib/practiceRepository.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ error: 'Shared leagues are not configured on this deployment yet.' }, { status: 503 });
    if (Number(req.headers.get('content-length')) > 16384) throw new Error('Request too large.');
    const raw = await req.text();
    if (raw.length > 16384) throw new Error('Request too large.');
    const input = JSON.parse(raw);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid request.');
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    return NextResponse.json(await transactPractice(client, input, req.headers.get('authorization')?.replace(/^Bearer /, '') || ''), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save. Try again.' }, { status: 400 });
  }
}
