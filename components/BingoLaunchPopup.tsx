'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {useAccount} from './AccountProvider';

const DISMISS_KEY='pickem-hq-bingo-promo-dismissed';
export default function BingoLaunchPopup(){
 const {session,loading}=useAccount();const pathname=usePathname();const [open,setOpen]=useState(false);
 useEffect(()=>{if(loading||!session||pathname==='/bingo'||pathname==='/login')return;try{if(!sessionStorage.getItem(DISMISS_KEY))setOpen(true);}catch{setOpen(true);}},[loading,session?.user.id,pathname]);
 function dismiss(){setOpen(false);try{sessionStorage.setItem(DISMISS_KEY,'1');}catch{}}
 if(!open)return null;
 return <div className="bingo-launch" role="dialog" aria-modal="true" aria-labelledby="bingo-launch-title"><button className="bingo-launch__backdrop" aria-label="Close Monday Night Bingo promotion" onClick={dismiss}/><section className="bingo-launch__card"><button autoFocus className="bingo-launch__close" aria-label="Close" onClick={dismiss}>×</button><div className="bingo-launch__glow"/><div className="bingo-launch__content"><p className="bingo-launch__eyebrow"><span/> MONDAY NIGHT EVENT</p><h2 id="bingo-launch-title">One game.<br/><em>One board.</em><br/>Bingo.</h2><p>Build your own board for Monday night. We mark every square automatically as the game unfolds.</p><div className="bingo-launch__mini-board" aria-hidden="true">{Array.from({length:25},(_,index)=><i key={index} className={index===12?'is-free':''}/>)}</div><div className="bingo-launch__actions"><Link href="/bingo" className="sports-primary" onClick={dismiss}>Build my board <b>→</b></Link><button className="sports-action" onClick={dismiss}>Maybe later</button></div><small>Free to play · Live NFL tracking</small></div></section></div>;
}
