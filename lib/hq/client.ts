'use client';
import {supabase} from '@/lib/supabaseClient';
import {apiUrl} from '@/lib/apiUrl';
export async function hq(input:Record<string,unknown>) {
 const {data,error}=await supabase.auth.getSession();
 if(error||!data.session) throw new Error('Please sign in to continue.');
 let response:Response;
 try {response=await fetch(apiUrl('/api/hq'),{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify(input),signal:AbortSignal.timeout(55000)});} catch {
  throw new Error('Pickem HQ could not reach the game service. Check your connection and try again.');
 }
 const payload=await response.json().catch(()=>({error:'The game service returned an invalid response. Please try again.'}));
 if(!response.ok) throw new Error(payload.error||'Your request could not be completed.');
 return payload;
}
