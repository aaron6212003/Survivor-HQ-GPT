'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {useAccount} from './AccountProvider';
import ScoreTicker from './ScoreTicker';
import ProfileAvatar from './ProfileAvatar';

const primaryLinks=[['Leagues','/leagues'],['My picks','/picks'],['NFL','/schedule'],['Matrix','/matrix']];
const moreLinks=[['Teams','/teams'],['Bingo','/bingo'],['Settings','/settings']];

export default function Navbar(){
 const path=usePathname();const {session,boot}=useAccount();const [moreOpen,setMoreOpen]=useState(false);
 const favoriteTeam=boot?.profile?.favorite_team;
 const moreActive=moreLinks.some(([,url])=>path===url);
 const linkClass=(active:boolean)=>`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-bold ${active?'border-emerald-400 text-emerald-300':'border-transparent text-slate-400 hover:border-slate-600 hover:text-white'}`;
 return <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-[#080b10]/95 backdrop-blur-xl"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="flex justify-between items-center gap-3 py-3"><Link href="/" className="font-black tracking-[.12em] text-sm text-emerald-300">PICKEM <span className="text-white">HQ</span></Link><Link className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-200" href={session?"/settings":"/login"}>{session?<><ProfileAvatar avatar={boot?.profile?.avatar} name={boot?.profile?.display_name} className="h-7 w-7 shrink-0 text-sm"/><span className="max-w-[12rem] truncate">{boot?.profile?.display_name||'My account'}{favoriteTeam?` · ${favoriteTeam}`:''}</span></>:'Sign in / Sign up'}</Link></div><ScoreTicker/><nav aria-label="Main navigation" className="relative flex gap-1 pb-3">{primaryLinks.map(([name,url])=><Link key={url} href={url} className={linkClass(path===url)}>{name}</Link>)}<button type="button" aria-expanded={moreOpen} aria-haspopup="menu" onClick={()=>setMoreOpen(value=>!value)} className={linkClass(moreActive||moreOpen)}>More <span aria-hidden="true">⌄</span></button>{moreOpen&&<div role="menu" className="absolute right-0 top-full z-50 mt-1 min-w-40 rounded-xl border border-slate-700 bg-slate-950 p-1 shadow-2xl">{moreLinks.map(([name,url])=><Link role="menuitem" key={url} href={url} onClick={()=>setMoreOpen(false)} className={`block rounded-lg px-3 py-2 text-sm font-bold ${path===url?'bg-emerald-950 text-emerald-300':'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>{name}</Link>)}</div>}</nav></div></header>;
}
