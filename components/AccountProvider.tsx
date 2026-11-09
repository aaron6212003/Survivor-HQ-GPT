'use client';
import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '@/lib/supabaseClient';
import {hq} from '@/lib/hq/client';
const AccountContext=createContext<any>(null);
const bootCache=new Map<string,any>();
const cacheKey=(userId:string)=>`pickem-hq-bootstrap:${userId}`;
function readBoot(userId:string){if(bootCache.has(userId))return bootCache.get(userId);try{const raw=sessionStorage.getItem(cacheKey(userId));if(raw){const cached=JSON.parse(raw);if(Date.now()-cached.savedAt<300000){bootCache.set(userId,cached.value);return cached.value;}}}catch{}return null;}
function writeBoot(userId:string,value:any){bootCache.set(userId,value);try{sessionStorage.setItem(cacheKey(userId),JSON.stringify({savedAt:Date.now(),value}));}catch{}}
function timeout<T>(promise: Promise<T>, milliseconds: number) {return Promise.race([promise,new Promise<T>((_,reject)=>setTimeout(()=>reject(new Error('Session restore timed out.')),milliseconds))]);}

export function AccountProvider({children}:{children:React.ReactNode}) {
 const [session,setSession]=useState<Session|null>(null);const [loading,setLoading]=useState(true);const [boot,setBoot]=useState<any>(null);const [error,setError]=useState('');
 useEffect(()=>{let active=true;void timeout(supabase.auth.getSession(),8000).then(({data,error})=>{if(active){setSession(data.session);if(error)setError(error.message);}}).catch(()=>{if(active){setSession(null);setError('Your session could not be restored. Please sign in again.');}}).finally(()=>{if(active)setLoading(false);});const {data}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){setSession(next);setLoading(false);if(!next)setBoot(null);}});return ()=>{active=false;data.subscription.unsubscribe();};},[]);
 const refresh=useCallback(async({quiet=false}:{quiet?:boolean}={})=>{if(!session?.user.id)return; if(!quiet)setError('');try{const data=await hq({action:'bootstrap'});writeBoot(session.user.id,data);setBoot(data);return data;}catch(e){if(!quiet)setError(e instanceof Error?e.message:'Could not load your account.');}},[session?.user.id]);
 useEffect(()=>{if(!session?.user.id){setBoot(null);return;}const cached=readBoot(session.user.id);if(cached)setBoot(cached);void refresh({quiet:!!cached});},[session?.user.id,refresh]);
 return <AccountContext.Provider value={{session,loading,boot,error,refresh}}>{children}</AccountContext.Provider>;
}
export function useAccount(){return useContext(AccountContext);}
