'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAccount} from './AccountProvider';
export default function Navbar(){
 const path=usePathname();const {session,boot}=useAccount();
 const links=[['Leagues','/leagues'],['My picks','/picks'],['Entries','/entries'],['NFL schedule','/schedule'],['Profile','/login']];
 return <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B0E14]/95 backdrop-blur"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="flex justify-between items-center gap-3 py-4"><Link href="/" className="font-black tracking-wide text-lg text-emerald-400">🏈 SURVIVOR HQ</Link><Link className="text-sm text-slate-300" href="/login">{session?`${boot?.profile?.avatar||'🏈'} ${boot?.profile?.display_name||'My account'}`:'Sign in / Sign up'}</Link></div><nav aria-label="Main navigation" className="flex overflow-x-auto gap-1 pb-3">{links.map(([name,url])=><Link key={url} href={url} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${path===url?'bg-emerald-400 text-slate-950':'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{name}</Link>)}</nav></div></header>;
}
