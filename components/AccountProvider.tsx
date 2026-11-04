'use client';
import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '@/lib/supabaseClient';
import {hq} from '@/lib/hq/client';
const AccountContext=createContext<any>(null);

function timeout<T>(promise: Promise<T>, milliseconds: number) {
 return Promise.race([
  promise,
  new Promise<T>((_,reject)=>setTimeout(()=>reject(new Error('Session restore timed out.')),milliseconds)),
 ]);
}

export function AccountProvider({children}:{children:React.ReactNode}) {
 const [session,setSession]=useState<Session|null>(null);const [loading,setLoading]=useState(true);const [boot,setBoot]=useState<any>(null);const [error,setError]=useState('');
 useEffect(()=>{
  let active=true;
  void timeout(supabase.auth.getSession(),8000)
   .then(({data,error})=>{if(active){setSession(data.session);if(error)setError(error.message);}})
   .catch(()=>{if(active){setSession(null);setError('Your session could not be restored. Please sign in again.');}})
   .finally(()=>{if(active)setLoading(false);});
  const {data}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){setSession(next);setLoading(false);if(!next)setBoot(null);}});
  return ()=>{active=false;data.subscription.unsubscribe();};
 },[]);
 const refresh=useCallback(async()=>{setError('');try{const data=await hq({action:'bootstrap'});setBoot(data);return data;}catch(e){setError(e instanceof Error?e.message:'Could not load your account.');}},[]);
 useEffect(()=>{if(session)void refresh();else setBoot(null);},[session?.user.id,refresh]);
 return <AccountContext.Provider value={{session,loading,boot,error,refresh}}>{children}</AccountContext.Provider>;
}
export function useAccount(){return useContext(AccountContext);}
