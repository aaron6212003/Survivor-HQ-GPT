'use client';

import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {useAccount} from './AccountProvider';
import {hq} from '@/lib/hq/client';
import LeagueNotifications from './LeagueNotifications';
import AppLoader from './AppLoader';
import {field,panel} from './LeagueConfigFields';

export default function AppSettings(){
 const {session,loading,boot}=useAccount();
 const survivorLeagues=useMemo(()=>boot?.leagues?.filter((league:any)=>league.format==='survivor'&&!league.archived)||[],[boot]);
 const [leagueId,setLeagueId]=useState(''); const [league,setLeague]=useState<any>(null); const [error,setError]=useState('');
 useEffect(()=>{if(!leagueId&&survivorLeagues[0])setLeagueId(survivorLeagues[0].id);},[leagueId,survivorLeagues]);
 useEffect(()=>{if(!leagueId)return;let active=true;setLeague(null);setError('');hq({action:'view',leagueId}).then(data=>{if(active)setLeague(data.league);}).catch(reason=>{if(active)setError(reason instanceof Error?reason.message:'Could not load this league.');});return()=>{active=false;};},[leagueId]);
 if(loading)return <AppLoader/>;
 if(!session)return <section className={panel}><h1 className="text-2xl font-black">App settings</h1><p className="mt-2 text-slate-400">Sign in to manage Pickem HQ notifications.</p><Link className="mt-5 inline-block text-emerald-300 underline" href="/login?next=/settings">Sign in</Link></section>;
 return <div className="mx-auto max-w-3xl space-y-5"><header><p className="score-label text-emerald-300">PICKEM HQ</p><h1 className="mt-1 text-3xl font-black">App settings</h1><p className="mt-2 text-slate-400">Manage alerts and reminders for this phone.</p></header>{!survivorLeagues.length?<section className={panel}><h2 className="text-xl font-black">No Survivor leagues yet</h2><p className="mt-2 text-slate-400">Join or create a Survivor league to schedule NFL pick reminders.</p><Link className="mt-4 inline-block text-emerald-300 underline" href="/leagues">View leagues</Link></section>:<><label className="block text-sm font-bold">Reminder league<select className={field} value={leagueId} onChange={e=>setLeagueId(e.target.value)}>{survivorLeagues.map((item:any)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{error?<section className={panel}><p className="text-rose-300">{error}</p></section>:league?<LeagueNotifications league={league}/>:<AppLoader/>}</>}</div>;
}
