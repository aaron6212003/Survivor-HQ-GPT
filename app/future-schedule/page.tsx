'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarRange, Filter, Search, Home, Navigation, Shield } from 'lucide-react';
import { NFLTeam } from '@/lib/types';

interface FutureScheduleRow {
  team: NFLTeam;
  weeks: {
    [week: number]: {
      isHome: boolean;
      isBye: boolean;
      opponent?: {
        id: string;
        code: string;
        name: string;
        logo?: string;
      };
    };
  };
}

export default function FutureScheduleView() {
  const [matrix, setMatrix] = useState<FutureScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [confFilter, setConfFilter] = useState<'ALL' | 'AFC' | 'NFC'>('ALL');
  const [divFilter, setDivFilter] = useState<'ALL' | 'East' | 'North' | 'South' | 'West'>('ALL');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'HOME' | 'AWAY'>('ALL');

  useEffect(() => {
    const loadFutureSchedule = () => {
      fetch(`/api/future-schedule?t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          setMatrix(data.matrix || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load future schedule matrix:', err);
          setLoading(false);
        });
    };

    loadFutureSchedule();

    window.addEventListener('focus', loadFutureSchedule);
    document.addEventListener('visibilitychange', loadFutureSchedule);
    window.addEventListener('survivor_pick_updated', loadFutureSchedule);
    window.addEventListener('storage', loadFutureSchedule);

    const interval = setInterval(loadFutureSchedule, 1000);

    return () => {
      window.removeEventListener('focus', loadFutureSchedule);
      document.removeEventListener('visibilitychange', loadFutureSchedule);
      window.removeEventListener('survivor_pick_updated', loadFutureSchedule);
      window.removeEventListener('storage', loadFutureSchedule);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm animate-pulse">Loading Season Future Schedule Planning Matrix...</p>
      </div>
    );
  }

  const weeks = Array.from({ length: 18 }, (_, i) => i + 1);

  const filteredMatrix = matrix.filter(({ team }) => {
    if (confFilter !== 'ALL' && team.conference !== confFilter) return false;
    if (divFilter !== 'ALL' && team.division !== divFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return team.name.toLowerCase().includes(q) || team.code.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Future Schedule Planning Matrix</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Look multiple weeks ahead across all 32 NFL teams to plan optimal Survivor pick conservation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded bg-blue-500/20 border border-blue-500" />
            HOME
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
            AWAY
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500" />
            BYE
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800/90 p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Conference Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'AFC', 'NFC'] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setConfFilter(conf)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  confFilter === conf ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {conf}
              </button>
            ))}
          </div>

          {/* Division Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'East', 'North', 'South', 'West'] as const).map((div) => (
              <button
                key={div}
                onClick={() => setDivFilter(div)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  divFilter === div ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'HOME', 'AWAY'] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  locationFilter === loc ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            32 NFL Teams Schedule Matrix ({filteredMatrix.length} Teams Shown)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-800">
                <th className="py-3.5 px-4 text-left sticky left-0 z-20 bg-slate-950 min-w-[150px] border-r border-slate-800 shadow-md">
                  Team
                </th>
                {weeks.map((w) => (
                  <th key={w} className="py-3 px-2 min-w-[65px]">
                    W{w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredMatrix.map(({ team, weeks: weekMatchups }) => (
                <tr key={team.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Sticky Team Column */}
                  <td className="py-3 px-4 text-left sticky left-0 z-10 bg-slate-900 border-r border-slate-800 shadow-md">
                    <Link
                      href={`/teams/${team.code}`}
                      className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
                    >
                      <Image src={team.logo_url} alt={team.name} width={22} height={22} className="object-contain" />
                      <div>
                        <span className="font-extrabold text-xs text-white group-hover:text-emerald-400 block">{team.code}</span>
                        <span className="text-[10px] text-slate-400 block">{team.wins}-{team.losses}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Week 1 to 18 Matchup Cells */}
                  {weeks.map((w) => {
                    const cell = weekMatchups[w];
                    if (!cell) {
                      return <td key={w} className="py-3 px-1 border-r border-slate-800/40 text-slate-600">—</td>;
                    }

                    if (cell.isBye) {
                      return (
                        <td key={w} className="py-3 px-1 border-r border-slate-800/40">
                          <span className="inline-block px-1.5 py-1 rounded text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40 w-full text-center">
                            BYE
                          </span>
                        </td>
                      );
                    }

                    const isHome = cell.isHome;
                    const oppCode = cell.opponent ? cell.opponent.code : '?';

                    // Apply location filter check
                    if (locationFilter === 'HOME' && !isHome) {
                      return <td key={w} className="py-3 px-1 border-r border-slate-800/40 opacity-20 text-slate-600">—</td>;
                    }
                    if (locationFilter === 'AWAY' && isHome) {
                      return <td key={w} className="py-3 px-1 border-r border-slate-800/40 opacity-20 text-slate-600">—</td>;
                    }

                    return (
                      <td key={w} className="py-2 px-1 border-r border-slate-800/40">
                        <div
                          className={`flex flex-col items-center justify-center p-1 rounded-md border text-[11px] font-bold transition-all hover:scale-105 ${
                            isHome
                              ? 'bg-blue-950/70 text-blue-300 border-blue-800/50'
                              : 'bg-slate-950 text-slate-300 border-slate-800'
                          }`}
                          title={`${team.name} ${isHome ? 'Home vs' : 'Away at'} ${cell.opponent?.name || oppCode}`}
                        >
                          <span className="font-mono">{oppCode}</span>
                        </div>
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
