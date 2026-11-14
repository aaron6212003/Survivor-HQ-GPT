'use client';

import {useEffect,useMemo,useState} from 'react';
import {isNativeApp} from '@/lib/supabaseClient';
import {panel,primary} from './LeagueConfigFields';

type Status='checking'|'off'|'on'|'unsupported';
type PreferenceKey='dayBefore'|'beforeKickoff';
type Preferences=Record<PreferenceKey,boolean>;

const preferenceStorageKey='pickemhq.notification-preferences.v1';
const reminderIds:Record<PreferenceKey,number>={dayBefore:910011,beforeKickoff:910010};
const defaultPreferences:Preferences={dayBefore:true,beforeKickoff:true};

export default function LeagueNotifications({league}:{league:any}) {
 const [status,setStatus]=useState<Status>('checking');
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 const [preferences,setPreferences]=useState<Preferences>(defaultPreferences);
 const missing=useMemo(()=>{
  if(league.config?.format!=='survivor')return 0;
  const managed=new Set(league.managedEntryIds||[]);
  return league.entries.filter((entry:any)=>managed.has(entry.id)&&entry.alive&&!league.picks.some((pick:any)=>pick.entryId===entry.id&&pick.week===league.activeWeek)).length;
 },[league]);
 const earliest=useMemo(()=>[...(league.games||[])].filter((game:any)=>game.status==='scheduled'&&Date.parse(game.kickoff)>Date.now()).sort((a:any,b:any)=>Date.parse(a.kickoff)-Date.parse(b.kickoff))[0],[league.games]);

 useEffect(()=>{
  try {const saved=window.localStorage.getItem(preferenceStorageKey);if(saved)setPreferences({...defaultPreferences,...JSON.parse(saved)});} catch {}
  let active=true;
  async function check(){
   if(!isNativeApp){if(active)setStatus('unsupported');return;}
   try {const {LocalNotifications}=await import('@capacitor/local-notifications');const permissions=await LocalNotifications.checkPermissions();if(active)setStatus(permissions.display==='granted'?'on':'off');}
   catch {if(active)setStatus('unsupported');}
  }
  void check();
  return()=>{active=false;};
 },[]);

 function persist(next:Preferences){setPreferences(next);try{window.localStorage.setItem(preferenceStorageKey,JSON.stringify(next));}catch{}}
 async function changePreference(key:PreferenceKey){
  const enabled=!preferences[key]; const next={...preferences,[key]:enabled};persist(next);setMessage(`${key==='dayBefore'?'Day-before':'30-minute'} reminders turned ${enabled?'on':'off'}.`);
  if(!enabled&&isNativeApp){try{const {LocalNotifications}=await import('@capacitor/local-notifications');await LocalNotifications.cancel({notifications:[{id:reminderIds[key]}]});}catch{}}
 }
 async function enable(){setBusy(true);setMessage('');try{const {LocalNotifications}=await import('@capacitor/local-notifications');const permissions=await LocalNotifications.requestPermissions();if(permissions.display!=='granted')throw new Error('Notifications are off. Allow them in iPhone Settings, then try again.');setStatus('on');setMessage('Notifications are on for Pickem HQ.');}catch(error){setMessage(error instanceof Error?error.message:'Notifications could not be enabled.');}finally{setBusy(false);}}
 async function test(){setBusy(true);setMessage('');try{const {LocalNotifications}=await import('@capacitor/local-notifications');await LocalNotifications.schedule({notifications:[{id:910001,title:'Pickem HQ',body:'Your NFL reminders are ready.',schedule:{at:new Date(Date.now()+10000)},sound:'default'}]});setMessage('Test scheduled. You should see it in about 10 seconds.');}catch{setMessage('The test notification could not be scheduled.');}finally{setBusy(false);}}
 async function scheduleSlate(){
  if(!earliest)return;
  if(!preferences.dayBefore&&!preferences.beforeKickoff){setMessage('Choose at least one reminder type first.');return;}
  setBusy(true);setMessage('');
  try{
   const {LocalNotifications}=await import('@capacitor/local-notifications');const kickoff=new Date(earliest.kickoff);const notifications:any[]=[];
   const beforeKickoff=new Date(kickoff.getTime()-30*60*1000);
   if(preferences.beforeKickoff&&beforeKickoff.getTime()>Date.now()+5000)notifications.push({id:reminderIds.beforeKickoff,title:'Pickem HQ · Picks due soon',body:missing?`${missing} ${missing===1?'life needs':'lives need'} a pick before ${earliest.away.code} at ${earliest.home.code}.`:`${earliest.away.code} at ${earliest.home.code} starts in 30 minutes. Check your picks.`,schedule:{at:beforeKickoff},sound:'default'});
   const dayBefore=new Date(kickoff.getTime()-24*60*60*1000);
   if(preferences.dayBefore&&dayBefore.getTime()>Date.now()+5000)notifications.push({id:reminderIds.dayBefore,title:'Pickem HQ · NFL picks',body:missing?`You still have ${missing} ${missing===1?'life':'lives'} without a pick.`:'Your next NFL game is tomorrow. Review your picks.',schedule:{at:dayBefore},sound:'default'});
   await LocalNotifications.cancel({notifications:[{id:reminderIds.beforeKickoff},{id:reminderIds.dayBefore}]});
   if(!notifications.length)throw new Error('That kickoff is too close for a new reminder. Use the test button instead.');
   await LocalNotifications.schedule({notifications});setMessage(`Your selected reminders are scheduled for ${earliest.away.code} at ${earliest.home.code}.`);
  }catch(error){setMessage(error instanceof Error?error.message:'The reminders could not be scheduled.');}finally{setBusy(false);}
 }
 const choices:{key:PreferenceKey;title:string;detail:string}[]=[
  {key:'dayBefore',title:'Day-before pick reminder',detail:'A heads-up the day before your first scheduled kickoff.'},
  {key:'beforeKickoff',title:'30-minute pick reminder',detail:'A final reminder before your first scheduled kickoff.'},
 ];
 return <section className={panel}>
  <p className="score-label text-emerald-300">NOTIFICATION CENTER</p><h2 className="mt-1 text-xl font-black">Pick reminders</h2>
  {status==='unsupported'?<p className="mt-2 text-sm text-slate-400">Notifications are available in the Pickem HQ iPhone app.</p>:<>
   <p className="mt-2 text-sm text-slate-400">Choose which reminders this phone receives. Your choices stay on this device.</p>
   {missing>0&&<p className="mt-3 rounded-xl border border-amber-800 bg-amber-950/35 p-3 text-sm text-amber-200">{missing} {missing===1?'life needs':'lives need'} a pick this week.</p>}
   {status==='on'&&<div className="mt-4 space-y-2">{choices.map(choice=><button key={choice.key} type="button" aria-pressed={preferences[choice.key]} onClick={()=>void changePreference(choice.key)} className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${preferences[choice.key]?'border-emerald-500/70 bg-emerald-950/35':'border-slate-700 bg-slate-950/35'}`}><span><span className="block font-bold text-slate-100">{choice.title}</span><span className="mt-1 block text-sm text-slate-400">{choice.detail}</span></span><span className={`rounded-full px-3 py-1 text-xs font-black ${preferences[choice.key]?'bg-emerald-400 text-slate-950':'bg-slate-800 text-slate-300'}`}>{preferences[choice.key]?'ON':'OFF'}</span></button>)}</div>}
   <div className="mt-5 flex flex-wrap gap-3">{status!=='on'?<button disabled={busy} className={primary} onClick={enable}>{busy?'Working…':'Turn on notifications'}</button>:<><button disabled={busy} className={primary} onClick={test}>Send test in 10 seconds</button><button disabled={busy||!earliest} className="sports-action" onClick={scheduleSlate}>Schedule this week’s reminders</button></>}</div>
   {message&&<p role="status" className="mt-4 text-sm text-emerald-300">{message}</p>}
  </>}
 </section>;
}
