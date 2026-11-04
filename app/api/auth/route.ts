import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ytequbujojswljdybbmw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZXF1YnVqb2pzd2xqZHliYm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzODMyNjYsImV4cCI6MjEwNDk1OTI2Nn0.zqWwuQL-LCYROyIN5EDgllh5m4r2QRVFVG6v3KsgZd0';

function authClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.action !== 'login') return NextResponse.json({ error: 'Invalid authentication request.' }, { status: 400 });
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
    const { data, error } = await authClient().auth.signInWithPassword({ email, password });
    if (error || !data.session) return NextResponse.json({ error: error?.message || 'Unable to sign in.' }, { status: 401 });
    return NextResponse.json({ session: data.session }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Pickem HQ could not reach the account service. Please try again.' }, { status: 503 });
  }
}
