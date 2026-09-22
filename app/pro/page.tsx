'use client';
import Link from 'next/link';

export default function ProPage(){
 return <div className="mx-auto max-w-3xl space-y-5">
  <header className="stadium-header rounded-2xl p-7">
   <p className="score-label text-emerald-200">PICKEM HQ</p>
   <h1 className="mt-2 text-4xl font-black">More is on the way.</h1>
   <p className="mt-3 max-w-xl text-slate-300">Pickem HQ is launching with every planning tool open to everyone. A future membership will add optional extras without getting in the way of the core game.</p>
  </header>
  <section className="sports-panel p-6">
   <p className="score-label text-emerald-300">COMING SOON</p>
   <h2 className="mt-2 text-2xl font-black">A little more, when it is worth it.</h2>
   <p className="mt-2 max-w-xl text-sm text-slate-400">The Survivor Matrix, advanced filters, planned picks, and future-window research are already included. There is nothing to buy today.</p>
   <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4"><b>Deeper research</b><p className="mt-1 text-slate-400">More matchup context when the data is reliable.</p></div>
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4"><b>League tools</b><p className="mt-1 text-slate-400">Helpful commissioner controls and recaps.</p></div>
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4"><b>Personal touches</b><p className="mt-1 text-slate-400">Optional ways to make your account feel like yours.</p></div>
   </div>
  </section>
  <Link href="/matrix" className="sports-action sports-action--primary">Open Survivor Matrix</Link>
 </div>
}
