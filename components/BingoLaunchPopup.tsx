'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {useAccount} from './AccountProvider';
import {supabase} from '@/lib/supabaseClient';
import {apiUrl} from '@/lib/apiUrl';

export default function BingoLaunchPopup(){
 const {session,loading}=useAccount();const pathname=usePathname();const [open,setOpen]=useState(false);
 const [result,setResult]=useState<{event:any;completed:string[];board:string[]}|null>(null);
 useEffect(()=>{if(loading||!session||pathname==='/bingo'||pathname==='/login')return;let cancelled=false;(async()=>{try{const {data}=await supabase.auth.getSession();if(!data.session)return;const response=await fetch(apiUrl('/api/bingo?recap=1'),{headers:{Authorization:`Bearer ${data.session.access_token}`},cache:'no-store'});const payload=await response.json();const key=`pickem-hq-bingo-recap-${session.user.id}-${payload.event?.id||''}`;if(!cancelled&&payload.event?.status==='final'&&payload.board?.length===25&&!localStorage.getItem(key)){setResult(payload);setOpen(true);}}catch{}})();return()=>{cancelled=true;};},[loading,session?.user.id,pathname]);
 function dismiss(){setOpen(false);try{if(result?.event?.id)localStorage.setItem(`pickem-hq-bingo-recap-${session?.user.id}-${result.event.id}`,'1');}catch{}}
 if(!open)return null;
 const completed=result?.completed.filter(id=>result.board.includes(id)).length||0;
 return <div className="bingo-launch" role="dialog" aria-modal="true" aria-labelledby="bingo-launch-title"><button className="bingo-launch__backdrop" aria-label="Close Bingo results" onClick={dismiss}/><section className="bingo-launch__card"><button autoFocus className="bingo-launch__close" aria-label="Close" onClick={dismiss}>×</button><div className="bingo-launch__glow"/><div className="bingo-launch__content"><p className="bingo-launch__eyebrow"><span/> BINGO RESULTS</p><h2 id="bingo-launch-title">You hit<br/><em>{completed} of 24</em><br/>squares.</h2><p>{result?.event?.away?.name} at {result?.event?.home?.name} is final. Your board is saved in Bingo history.</p><div className="bingo-launch__mini-board" aria-hidden="true">{Array.from({length:25},(_,index)=><i key={index} className={index===12?'is-free':''}/>)}</div><div className="bingo-launch__actions"><Link href="/bingo" className="sports-primary" onClick={dismiss}>Open history <b>→</b></Link><button className="sports-action" onClick={dismiss}>Done</button></div><small>More Bingo events are coming soon.</small></div></section></div>;
}
