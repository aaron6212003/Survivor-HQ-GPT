'use client';
export default function EntryPicker({entries,current,onChange}:{entries:any[];current:string;onChange:(id:string)=>void}) {
 return <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">{entries.map(e=><button key={e.id} type="button" onClick={()=>onChange(e.id)} className={`rounded-xl border px-3 py-3 text-left ${current===e.id?'border-emerald-400 bg-emerald-950 text-white':'border-slate-700 bg-slate-900 text-slate-300'} ${e.alive===false?'opacity-50':''}`}><span className="block font-bold">{e.name}</span><span className="block text-xs mt-1">{e.alive===false?`Eliminated · W${e.eliminatedWeek}`:'Ready'}</span></button>)}</div>;
}
