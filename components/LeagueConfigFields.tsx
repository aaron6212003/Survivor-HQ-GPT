'use client';

export const field='sports-field mt-2 p-3';
export const primary='sports-primary px-5 py-3';
export const panel='sports-panel p-5 sm:p-6';
export const defaults={name:'',format:'survivor',maxEntries:5,tiebreaker:'monday-total',tiesLose:true};

export default function LeagueConfigFields({value,onChange,existing=false}:{value:any;onChange:(v:any)=>void;existing?:boolean}) {
 const set=(key:string,next:any)=>onChange({...value,[key]:next});
 const setFormat=(format:string)=>onChange({...value,format,maxEntries:format==='survivor'?value.maxEntries||100:1,tiesLose:format==='survivor'?value.tiesLose!==false:true});
 const survivor=value.format==='survivor';
 return <div className="space-y-4">
  <label className="block">League name<input className={field} value={value.name} onChange={e=>set('name',e.target.value)} minLength={2} maxLength={60} required/></label>
  <div className="grid sm:grid-cols-2 gap-4">
   <label>Format<select className={field} value={value.format} disabled={existing} onChange={e=>setFormat(e.target.value)}><option value="survivor">Survivor</option><option value="pickem">Straight Pick’em</option></select></label>
   {survivor&&<label>Lives per player<select className={field} value={value.maxEntries} onChange={e=>set('maxEntries',Number(e.target.value))}>{[1,2,3,5,10,25,50,100].map(count=><option key={count} value={count}>{count===100?'Unlimited':'Up to '+count}</option>)}</select><small className="mt-1 block text-slate-500">Choose how many lives each person may enter. Unlimited has a 100-life safety cap.</small></label>}
   {!survivor&&<div className="rounded-xl border border-sky-900 bg-sky-950/30 p-3 text-sm text-sky-100"><strong>Monday Night tiebreaker</strong><p className="mt-1">Each player predicts the total points in Monday night’s game. The closest prediction breaks a tied record.</p></div>}
  </div>
  <p className="rounded-xl border border-sky-900 bg-sky-950/30 p-3 text-sm text-sky-100">{survivor?'Survivor locks each matchup at its own kickoff. Thursday locks Thursday only; Sunday and Monday stay available until their own games begin.':'Straight Pick’em locks the entire weekly card at the first game kickoff, normally Thursday night. Submit every pick before then.'}</p>
  {survivor?<>
   <label className="flex gap-3"><input type="checkbox" checked={value.tiesLose} onChange={e=>set('tiesLose',e.target.checked)}/>A tied game eliminates the Survivor life</label>
   <p className="text-sm text-slate-500">Players choose how many lives to enter, up to this limit. Each life gets one team per week, and cannot reuse a team.</p>
  </>:<p className="text-sm text-slate-500">Every member receives one season record. Pick every game each week; correct picks build your record.</p>}
  <p className="text-sm text-slate-500">Rules become fixed once picks are submitted or games start.</p>
 </div>;
}
