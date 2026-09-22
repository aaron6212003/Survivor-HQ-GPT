'use client';

import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {useAccount} from '@/components/AccountProvider';
import {hq} from '@/lib/hq/client';

const colors:Record<string,string>={BUF:'#1670d2',PHI:'#008a91',BAL:'#4730aa',GB:'#225e48',KC:'#e51b3e',TB:'#d50d2e'};
const all=['ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN','DET','GB','HOU','IND','JAX','KC','LV','LAC','LAR','MIA','MIN','NE','NO','NYG','NYJ','PHI','PIT','SEA','SF','TB','TEN','WAS'];
const windows=[2,3,4,6,8,18];
type Planned=Record<number,string>;

export default function Matrix(){
 const {session,boot}=useAccount();
 const pools=(boot?.leagues||[]).filter((league:any)=>league.format==='survivor');
 const [id,setId]=useState(''); const [data,setData]=useState<any>(); const [entry,setEntry]=useState('');
 const [location,setLocation]=useState<'all'|'home'|'away'>('all'); const [availability,setAvailability]=useState<'all'|'available'|'used'>('available');
 const [start,setStart]=useState(boot?.meta?.week||1); const [length,setLength]=useState(4); const [twoPlus,setTwoPlus]=useState(false); const [planned,setPlanned]=useState<Planned>({});
 useEffect(()=>{if(!id&&pools[0])setId(pools[0].id)},[pools.length,id]);
 useEffect(()=>{if(boot?.meta?.week&&start===1)setStart(boot.meta.week)},[boot?.meta?.week]);
 useEffect(()=>{if(id)hq({action:'matrix',leagueId:id}).then(setData)},[id]);
 useEffect(()=>{if(data&&!entry)setEntry(data.entries[0]?.id)},[data,entry]);
 useEffect(()=>{if(!entry)return;try{setPlanned(JSON.parse(localStorage.getItem(`pickemhq-plan-${id}-${entry}`)||'{}'))}catch{setPlanned({})}},[id,entry]);
 useEffect(()=>{if(entry)localStorage.setItem(`pickemhq-plan-${id}-${entry}`,JSON.stringify(planned))},[id,entry,planned]);
 if(!session)return <Link href="/login?next=/matrix" className="sports-action">Sign in to use the Survivor Matrix</Link>;
 const visible=Array.from({length:Math.min(length,19-start)},(_,index)=>start+index);
 const teamCodes=new Map<string,string>(Object.values(data?.schedules||{}).flatMap((games:any)=>games.flatMap((game:any)=>[[String(game.home.id),game.home.code],[String(game.away.id),game.away.code]])));
 const used=new Set((data?.picks||[]).filter((pick:any)=>pick.entryId===entry).map((pick:any)=>teamCodes.get(String(pick.teamId))).filter(Boolean));
 const rows=useMemo(()=>all.map(code=>{
  const cells=visible.map(week=>{const game=data?.schedules?.[week]?.find((item:any)=>item.home.code===code||item.away.code===code);return game?{op:game.home.code===code?game.away.code:game.home.code,away:game.home.code===code}:null});
  const viable=cells.filter((cell:any)=>cell&&(location==='all'||(location==='home'?!cell.away:cell.away))).length;
  const isUsed=used.has(code);
  const availabilityMatch=availability==='all'||(availability==='available'?!isUsed:isUsed);
  return {code,cells,viable,isUsed,match:availabilityMatch&&(!twoPlus||viable>=2)};
 }),[data,visible,location,availability,twoPlus,entry]);
 const plan=(week:number,team:string)=>{if(used.has(team))return;setPlanned(current=>current[week]===team?Object.fromEntries(Object.entries(current).filter(([key])=>Number(key)!==week)):{...current,[week]:team});};
 const clearPlan=()=>setPlanned({});
 const planCount=Object.keys(planned).length;
 return <div className="matrix-page">
  <header className="matrix-hero">
   <div><p className="score-label text-emerald-200">PICKEM HQ PRO · SURVIVOR PLANNER</p><h1>Schedule Matrix</h1></div>
   <p>Compare your future options without losing the season’s context.</p>
  </header>
  <section className="matrix-toolbar" aria-label="Survivor Matrix controls">
   <select aria-label="Survivor league" value={id} onChange={event=>setId(event.target.value)}>{pools.map((pool:any)=><option key={pool.id} value={pool.id}>{pool.name}</option>)}</select>
   <select aria-label="Survivor entry" value={entry} onChange={event=>setEntry(event.target.value)}>{data?.entries?.map((item:any)=><option key={item.id} value={item.id}>Entry {item.entryNumber||item.name}</option>)}</select>
   <label>From<select value={start} onChange={event=>setStart(+event.target.value)}>{Array.from({length:18},(_,index)=>index+1).map(week=><option key={week} value={week}>W{week}</option>)}</select></label>
   <label>View<select value={length} onChange={event=>setLength(+event.target.value)}>{windows.map(window=><option key={window} value={window}>{window===18?'Full':`${window} weeks`}</option>)}</select></label>
  </section>
  <section className="matrix-filterbar" aria-label="Matrix filters">
   <div className="matrix-chipset" aria-label="Location filter">{([['all','All games'],['home','Home'],['away','Away']] as const).map(([value,label])=><button key={value} type="button" className={location===value?'is-active':''} onClick={()=>setLocation(value)}>{label}</button>)}</div>
   <div className="matrix-chipset" aria-label="Availability filter">{([['available','Available'],['all','All'],['used','Used']] as const).map(([value,label])=><button key={value} type="button" className={availability===value?'is-active':''} onClick={()=>setAvailability(value)}>{label}</button>)}</div>
   <button type="button" className={`matrix-toggle ${twoPlus?'is-active':''}`} onClick={()=>setTwoPlus(!twoPlus)}>2+ options</button>
   {planCount>0&&<button type="button" className="matrix-clear" onClick={clearPlan}>Clear {planCount} plan{planCount===1?'':'s'}</button>}
  </section>
  <div className="matrix-summary"><strong>Weeks {visible[0]}–{visible.at(-1)}</strong><span>{rows.filter(row=>row.match).length} teams match · tap a matchup to plan it</span></div>
  <section className="matrix-scroll" aria-label="Survivor planning grid"><table className="matrix-table" style={{minWidth:132+visible.length*82}}><thead><tr><th>TEAM</th>{visible.map(week=><th key={week}>W{week}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.code} className={!row.match?'is-dim':''}><th><i style={{background:colors[row.code]||'#3a6175'}}/><span><b>{row.code}</b>{row.isUsed?<small>used</small>:<small>{row.viable} spot{row.viable===1?'':'s'}</small>}</span></th>{row.cells.map((cell:any,index)=>{const week=visible[index];const isPlan=planned[week]===row.code;const locationDim=cell&&location!=='all'&&(location==='home'?cell.away:!cell.away);return <td key={week} className={!cell||locationDim?'is-dim':''}>{cell&&<button type="button" disabled={row.isUsed} aria-pressed={isPlan} onClick={()=>plan(week,row.code)} className={isPlan?'is-planned':''} style={{borderColor:colors[row.code]||'#3a6175'}}>{isPlan?'✓ ':''}{cell.away?'@ ':''}{cell.op}</button>}</td>})}</tr>)}</tbody></table></section>
  <p className="matrix-note">Available means the team has not been used by this entry. Planned picks stay on this device and never submit a real Survivor selection.</p>
 </div>;
}
