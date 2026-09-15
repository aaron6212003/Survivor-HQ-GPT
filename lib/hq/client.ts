'use client';
import {supabase} from '@/lib/supabaseClient';
export async function hq(input:Record<string,unknown>) {
 const {data,error}=await supabase.auth.getSession();
 if(error||!data.session) throw new Error('Please sign in to continue.');
 const response=await fetch('/api/hq',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify(input),signal:AbortSignal.timeout(55000)});
 const payload=await response.json();
 if(!response.ok) throw new Error(payload.error||'Your request could not be completed.');
 return payload;
}
