'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Table, Search, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { NFLTeam, SurvivorEntry } from '@/lib/types';
import { getLocalPicks } from '@/lib/clientStore';

interface AvailabilityRow {
  team: NFLTeam;
  entries: {
    [entryId: string]: {
      status: 'AVAILABLE' | 'USED';
      week?: number;
    };
  };
}

export default function TeamAvailabilityMatrix() {
  const [data, setData] = useState<{
    teams: NFLTeam[];
    entries: SurvivorEntry[];
    matrix: AvailabilityRow[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confFilter, setConfFilter] = useState<'ALL' | 'AFC' | 'NFC'>('ALL');
  const [selectedMobileEntry, setSelectedMobileEntry] = useState<string>('E1');

  const fetchAvailability = () => {
    fetch(`/api/availability?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((d) => {
        if (d && d.matrix) {
          const localPicks = getLocalPicks();
          if (localPicks.length > 0) {
            for (const lp of localPicks) {
              const row = d.matrix.find((r: any) => r.team.id === lp.teamId);
              if (row && row.entries[lp.entryId]) {
                row.entries[lp.entryId] = {
                  status: 'USED',
                  week: lp.week,
                };
              }
            }
          }
        }
        setData(d);
        if (d.entries?.[0]) {
          setSelectedMobileEntry((prev) => prev || d.entries[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load availability matrix:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAvailability();

    const onUpdate = () => fetchAvailability();
    window.addEventListener('focus', onUpdate);
    document.addEventListener('visibilitychange', onUpdate);
    window.addEventListener('survivor_pick_updated', onUpdate);
    window.addEventListener('storage', onUpdate);

    const interval = setInterval(onUpdate, 1000);

    return () => {
      window.removeEventListener('focus', onUpdate);
      document.removeEventListener('visibilitychange', onUpdate);
      window.removeEventListener('survivor_pick_updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
      clearInterval(interval);
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-xs">Loading Team Availability Matrix...</p>
      </div>
    );
  }

  const { entries, matrix } = data;

  const filteredMatrix = matrix.filter(({ team }) => {
    if (confFilter !== 'ALL' && team.conference !== confFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return team.name.toLowerCase().includes(q) || team.code.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5 max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Team Availability Matrix</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspect which of your 8 entries can still pick a specific NFL franchise.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-around">
            {(['ALL', 'AFC', 'NFC'] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setConfFilter(conf)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  confFilter === conf ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {conf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Single Entry Card Selector (No Side Scroll Needed) */}
      <div className="block md:hidden space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            Select Entry:
          </span>
          <select
            value={selectedMobileEntry}
            onChange={(e) => setSelectedMobileEntry(e.target.value)}
            className="bg-slate-950 text-emerald-400 font-black text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none"
          >
            {entries.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} (#{e.entry_number})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredMatrix.map(({ team, entries: entryMap }) => {
            const statusObj = entryMap[selectedMobileEntry];
            const isAvailable = statusObj?.status === 'AVAILABLE';

            return (
              <div key={team.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src={team.logo_url} alt={team.name} width={28} height={28} className="object-contain" />
                  <div>
                    <span className="font-extrabold text-sm text-white block">{team.name} ({team.code})</span>
                    <span className="text-[10px] text-slate-400">{team.conference} {team.division}</span>
                  </div>
                </div>

                {isAvailable ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] font-extrabold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    AVAILABLE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded-md text-[10px] font-semibold">
                    <XCircle className="w-3 h-3 text-rose-400" />
                    Used W{statusObj?.week}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Matrix Table Card */}
      <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            32 NFL Teams x 8 Survivor Pool Entries
          </span>
          <span className="text-xs text-slate-400">
            Green = Available • Red/Gray = Used in Week X
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 text-left sticky left-0 z-20 bg-slate-950 min-w-[180px] border-r border-slate-800 shadow-md">
                  NFL Franchise
                </th>
                {entries.map((entry) => (
                  <th key={entry.id} className="py-3.5 px-3 min-w-[110px]">
                    <span className="text-white font-extrabold text-xs">{entry.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredMatrix.map(({ team, entries: entryMap }) => (
                <tr key={team.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 text-left sticky left-0 z-10 bg-slate-900 border-r border-slate-800 shadow-md">
                    <Link
                      href={`/teams/${team.code}`}
                      className="flex items-center gap-3 hover:text-emerald-400 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded bg-slate-950 p-1 border border-slate-800 flex items-center justify-center flex-shrink-0">
                        <Image src={team.logo_url} alt={team.name} width={24} height={24} className="object-contain" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-white group-hover:text-emerald-400 block">{team.name}</span>
                        <span className="text-[11px] text-slate-400">{team.conference} {team.division}</span>
                      </div>
                    </Link>
                  </td>

                  {entries.map((entry) => {
                    const statusObj = entryMap[entry.id];
                    const isAvailable = statusObj?.status === 'AVAILABLE';

                    return (
                      <td key={entry.id} className="py-3.5 px-3 border-r border-slate-800/40">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[11px] font-extrabold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            AVAILABLE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded-md text-[11px] font-semibold">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            Used W{statusObj.week}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
