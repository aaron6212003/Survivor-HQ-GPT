import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'https://pickemhq.co',
  'https://www.pickemhq.co',
  'capacitor://localhost',
  'ionic://localhost',
]);

function apiCors(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();
  const headers = apiCors(request);
  if (request.method === 'OPTIONS') return new NextResponse(null, { status: 204, headers });
  const response = NextResponse.next();
  Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
  return response;
}

export const config = { matcher: '/api/:path*' };
