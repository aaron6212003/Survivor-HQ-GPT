'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAccount} from './AccountProvider';
export default function Navbar(){
 const path=usePathname();const {session,boot}=useAccount();
 const favoriteTeam=boot?.profile?.favorite_team;
 const links=[['Leagues','/leagues'],['My picks','/picks'],['NFL schedule','/schedule'],['Profile','/login']];
 return <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-[#080b10]/95 backdrop-blur-xl"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="flex justify-between items-center gap-3 py-3"><Link href="/" className="font-black tracking-[.12em] text-sm text-emerald-300">SURVIVOR <span className="text-white">HQ</span></Link><Link className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200" href="/login">{session?`${boot?.profile?.avatar||'🏈'} ${boot?.profile?.display_name||'My account'}${favoriteTeam?` · ${favoriteTeam}`:''}`:'Sign in / Sign up'}</Link></div><nav aria-label="Main navigation" className="flex overflow-x-auto gap-1 pb-3">{links.map(([name,url])=><Link key={url} href={url} className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-bold ${path===url?'border-emerald-400 text-emerald-300':'border-transparent text-slate-400 hover:border-slate-600 hover:text-white'}`}>{name}</Link>)}</nav></div></header>;
}
