'use client';
import { useEffect, useRef, useState } from 'react';

type Access = { code: string; token: string };
type League = { code: string; name: string; format: string; round: number; phase: string; me: string; games: { id: string; home: string; away: string }[]; members: { id: string; name: string; commissioner: boolean; alive: boolean; points: number; submitted: number }[]; picks: { memberId: string; round: number; gameId: string; team: string }[]; results: Record<string, Record<string, string>> };
const field = 'w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white';
const button = 'rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-40 hover:bg-emerald-300';
export default function TestLeague() {
  const [league, setLeague] = useState<League | null>(null);
  const [access, setAccess] = useState<Access>({ code: '', token: '' });
  const [saved, setSaved] = useState<Access[]>([]);
  const [mode, setMode] = useState('create');
  const [name, setName] = useState('Friends practice league');
  const [playerName, setPlayerName] = useState('');
  const [format, setFormat] = useState('survivor');
  const [code, setCode] = useState('');
  const [restoreToken, setRestoreToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem('hq_practice_access') || '[]')); } catch {}
    const invitation = new URLSearchParams(window.location.search).get('code');
    if (invitation) { setCode(invitation); setMode('join'); }
  }, []);
  async function act(action: string, extra: Record<string, unknown> = {}, credentials = access) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/test-league', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${credentials.token}` }, body: JSON.stringify({ code: credentials.code, action, ...extra }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save.');
      const next = { code: data.code, token: data.token || credentials.token };
      setAccess(next); setLeague(data);
      if (action === 'next') setResults({});
      const updated = [...saved.filter(s => s.code !== next.code || s.token !== next.token), next];
      setSaved(updated);
      try { localStorage.setItem('hq_practice_access', JSON.stringify(updated)); } catch { setNotice('Browser storage is unavailable. Copy your player key before leaving.'); }
      if (action === 'pick') setNotice('Pick saved on the server.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Connection failed. Please retry.'); }
    finally { pending.current = false; setBusy(false); }
  }
  const me = league?.members.find(m => m.id === league.me);
  async function copyInvite() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/test-league?code=${league?.code}`); setNotice('Invite link copied.'); }
    catch { setNotice(`Share this league code: ${league?.code}`); }
  }
  return <div className="max-w-5xl mx-auto space-y-6">
    <header className="rounded-3xl border border-emerald-900 bg-gradient-to-br from-emerald-950 to-slate-900 p-6 sm:p-9">
      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Friends beta · Practice games</p>
      <h1 className="text-3xl sm:text-4xl font-black mt-3">{league?.name || 'Let’s play a test league.'}</h1>
      <p className="text-slate-300 mt-3 max-w-2xl">Shared picks, real members, and results you control. These four practice matchups repeat each round; they are not the live NFL schedule. No buy-ins.</p>
    </header>
    {error && <div role="alert" className="p-4 rounded-xl border border-rose-700 bg-rose-950 text-rose-200">{error}</div>}
    {notice && <div role="status" className="p-4 rounded-xl bg-emerald-950 text-emerald-200">{notice}</div>}
    {!league ? <div className="grid md:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <div className="flex flex-wrap gap-2">{['create', 'join', 'restore'].map(m => <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`px-4 py-2 rounded-lg capitalize ${mode === m ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800'}`}>{m === 'restore' ? 'Restore access' : m}</button>)}</div>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); void act(mode === 'restore' ? 'view' : mode, mode === 'create' ? { name, playerName, format } : mode === 'join' ? { code, playerName } : {}, { code, token: mode === 'restore' ? restoreToken.trim() : '' }); }}>
          {mode === 'create' ? <><label className="block">League name<input className={`${field} mt-2`} value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={60}/></label><label className="block">Format<select className={`${field} mt-2`} value={format} onChange={e => setFormat(e.target.value)}><option value="survivor">Survivor</option><option value="pickem">Straight Pick’em</option></select></label></> : <label className="block">League code<input className={`${field} mt-2 uppercase`} value={code} onChange={e => setCode(e.target.value)} required maxLength={8}/></label>}
          {mode !== 'restore' ? <label className="block">Your display name<input className={`${field} mt-2`} value={playerName} onChange={e => setPlayerName(e.target.value)} required minLength={2} maxLength={60} autoComplete="nickname"/></label> : <label className="block">Private player key<input className={`${field} mt-2`} type="password" value={restoreToken} onChange={e => setRestoreToken(e.target.value)} required/></label>}
          <button className={`${button} w-full`} disabled={busy}>{busy ? 'Connecting…' : mode === 'create' ? 'Create practice league' : mode === 'join' ? 'Join league' : 'Restore my player'}</button>
        </form>
      </section>
      <section className="p-6 space-y-5"><h2 className="text-xl font-bold">A complete practice round</h2><ol className="list-decimal pl-5 text-slate-300 space-y-3"><li>Create a league and share its invite.</li><li>Friends join and save picks on their devices.</li><li>The commissioner locks picks and enters practice results.</li><li>Check standings and start another round.</li></ol><p className="text-sm text-slate-400">One entry per player. Survivor: one team per round, no reuse; ties and missed picks eliminate. Pick’em: one point per correct winner; ties and missed picks earn zero. Picks stay hidden from other players until locked.</p>
        {saved.length > 0 && <div className="space-y-2"><h3 className="font-bold">Saved player access</h3>{saved.map((s, i) => <button className="block w-full text-left p-3 rounded-xl bg-slate-800" disabled={busy} key={s.token} onClick={() => act('view', {}, s)}>Open {s.code} · Player {i + 1}</button>)}</div>}
      </section>
    </div> : <>
      <div className="flex flex-wrap items-center gap-3"><span className="rounded-full px-4 py-2 bg-slate-800">{league.format === 'survivor' ? 'Survivor' : 'Pick’em'} · Round {league.round} · {league.phase}</span><span className="text-slate-400">Playing as {me?.name}{me?.commissioner ? ' · Commissioner' : ''}</span><button className="text-emerald-400 underline" disabled={busy} onClick={() => act('view')}>Refresh</button><button className="text-slate-400 underline" disabled={busy} onClick={() => { setLeague(null); setShowKey(false); setNotice(''); }}>Switch league / player</button></div>
      <section className="rounded-2xl border border-slate-800 p-5 flex flex-wrap items-center gap-4"><div className="flex-1"><p className="text-sm text-slate-400">Invite code</p><p className="font-mono text-2xl tracking-widest">{league.code}</p></div><button className={button} onClick={copyInvite}>Copy invite link</button><button className="text-sm underline" onClick={() => setShowKey(!showKey)}>My private player key</button>{showKey && <div className="w-full text-sm text-slate-300">Keep this key to restore your player on another device. Anyone with it can act as you.<input readOnly aria-label="Private player key" value={access.token} className={`${field} mt-2 font-mono`} onFocus={e => e.target.select()}/></div>}</section>
      <section><h2 className="text-xl font-bold mb-2">Your picks</h2><p className="text-slate-400 mb-4">{league.phase !== 'open' ? 'This round is locked.' : !me?.alive ? 'Your Survivor entry is eliminated. You can follow the remaining players below.' : league.format === 'survivor' ? 'Choose one team. You can change it until the commissioner locks the round.' : 'Choose a winner for each game. Each selection saves immediately.'}</p><div className="grid sm:grid-cols-2 gap-4">{league.games.map(game => <div key={game.id} className="rounded-2xl p-4 bg-slate-900 border border-slate-800"><p className="text-xs text-slate-500 mb-3">Practice matchup {game.id}</p><div className="grid grid-cols-2 gap-3">{[game.away, game.home].map(team => { const selected = league.picks.some(p => p.memberId === league.me && p.round === league.round && p.team === team); const used = league.format === 'survivor' && league.picks.some(p => p.memberId === league.me && p.round < league.round && p.team === team); return <button key={team} aria-pressed={selected} disabled={busy || league.phase !== 'open' || !me?.alive || used} onClick={() => act('pick', { gameId: game.id, team })} className={`rounded-xl py-5 font-black border ${selected ? 'bg-emerald-400 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-700'} disabled:cursor-default ${used ? 'opacity-30' : ''}`}>{team}<span className="block text-xs font-normal mt-1">{used ? 'Already used' : selected ? '✓ Saved' : team === game.home ? 'Home' : 'Away'}</span></button>; })}</div>{league.results[league.round]?.[game.id] && <p className="mt-3 text-emerald-300">Result: {league.results[league.round][game.id]}</p>}</div>)}</div></section>
      <section className="rounded-2xl border border-slate-800 p-5 overflow-x-auto"><h2 className="text-xl font-bold mb-4">Standings & submissions</h2><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="p-3">Player</th><th className="p-3">{league.format === 'survivor' ? 'Status' : 'Points'}</th><th className="p-3">This round</th><th className="p-3">Picks</th></tr></thead><tbody>{[...league.members].sort((a,b) => Number(b.alive)-Number(a.alive) || b.points-a.points).map(m => <tr key={m.id} className="border-t border-slate-800"><td className="p-3 font-bold">{m.name}{m.id === league.me ? ' (you)' : ''}</td><td className="p-3">{league.format === 'survivor' ? m.alive ? 'Alive' : 'Eliminated' : m.points}</td><td className="p-3">{m.submitted}/{league.format === 'survivor' ? 1 : league.games.length}</td><td className="p-3">{league.phase === 'open' && m.id !== league.me ? 'Hidden until lock' : league.picks.filter(p => p.memberId === m.id && p.round === league.round).map(p => p.team).join(', ') || '—'}</td></tr>)}</tbody></table></section>
      {me?.commissioner && <section className="rounded-2xl border border-amber-900 bg-amber-950/20 p-6 space-y-4"><h2 className="text-xl font-bold">Commissioner controls</h2>{league.phase === 'open' ? <><p className="text-slate-300">Lock when everyone is ready. This ends joining in round one and prevents further pick changes. Missing Survivor picks will lose when results are recorded.</p><button className={button} disabled={busy} onClick={() => act('lock')}>Lock this round</button></> : league.phase === 'locked' ? <><p className="text-slate-300">Choose a practice result for every game. Recording results is final for this round.</p><div className="grid sm:grid-cols-2 gap-3">{league.games.map(g => <label key={g.id}>{g.away} at {g.home}<select className={`${field} mt-1`} value={results[g.id] || ''} onChange={e => setResults({ ...results, [g.id]: e.target.value })}><option value="">Choose result</option><option value={g.away}>{g.away} wins</option><option value={g.home}>{g.home} wins</option><option value="tie">Tie</option></select></label>)}</div><button className={button} disabled={busy || league.games.some(g => !results[g.id])} onClick={() => act('settle', { results })}>Record results & score round</button></> : <><p>Results recorded. {league.round >= 8 ? 'Practice season complete.' : 'Start the next round when you’re ready.'}</p><button className={button} disabled={busy || league.round >= 8} onClick={() => act('next')}>Start next round</button></>}</section>}
    </>}
  </div>;
}
