import { NextResponse } from 'next/server';
import { adminClient,hqAction } from '@/lib/hq/server.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function POST(req:Request) {
 try {
  if(Number(req.headers.get('content-length'))>32768) throw new Error('Request is too large.');
  const raw=await req.text();if(raw.length>32768) throw new Error('Request is too large.');
  const input=JSON.parse(raw);if(!input||Array.isArray(input)||typeof input!=='object') throw new Error('Invalid request.');
  const client=adminClient();
  const token=req.headers.get('authorization')?.replace(/^Bearer /,'');
  if(!token) return NextResponse.json({error:'Please sign in to continue.'},{status:401});
  const {data,error}=await client.auth.getUser(token);
  if(error||!data.user) return NextResponse.json({error:'Your session has expired. Please sign in again.'},{status:401});
  const result=await hqAction(client,data.user,input);
  return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
 } catch(error) {return NextResponse.json({error:error instanceof Error?error.message:'Unable to complete this action.'},{status:400});}
}
