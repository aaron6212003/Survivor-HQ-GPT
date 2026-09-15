'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Database, Search, ChevronRight, Shield, Trophy } from 'lucide-react';
import { NFLTeam } from '@/lib/types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<NFLTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confFilter, setConfFilter] = useState<'ALL' | 'AFC' | 'NFC'>('ALL');

  useEffect(() => {
    fetch('/api/teams')
      .then((res) => res.json())
      .then((data) => {
        setTeams(data.teams || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load teams:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm animate-pulse">Loading NFL Team Database...</p>
      </div>
    );
  }

  const filteredTeams = teams.filter((t) => {
    if (confFilter !== 'ALL' && t.conference !== confFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.city.toLowerCase().includes(q);
    }
    return true;
  });

  const divisions = ['East', 'North', 'South', 'West'] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">NFL Team Database</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse all 32 NFL franchises, records, bye weeks, and complete regular season schedules.
          </p>
        </div>

        {/* Search & Conference Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search team or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            {(['ALL', 'AFC', 'NFC'] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setConfFilter(conf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  confFilter === conf ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {conf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped by Conference & Division */}
      {(['AFC', 'NFC'] as const)
        .filter((c) => confFilter === 'ALL' || confFilter === c)
        .map((conference) => (
          <div key={conference} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className={`w-3 h-3 rounded-full ${conference === 'AFC' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <h2 className="text-xl font-black text-white tracking-wide">{conference} Conference</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {divisions.map((division) => {
                const divisionTeams = filteredTeams.filter(
                  (t) => t.conference === conference && t.division === division
                );

                if (divisionTeams.length === 0) return null;

                return (
                  <div key={division} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span>{conference} {division}</span>
                      <span className="text-[10px] text-slate-500">{divisionTeams.length} Teams</span>
                    </h3>

                    <div className="space-y-2.5">
                      {divisionTeams.map((team) => (
                        <Link
                          key={team.id}
                          href={`/teams/${team.code}`}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center flex-shrink-0">
                              <Image src={team.logo_url} alt={team.name} width={28} height={28} className="object-contain" />
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                                {team.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span className="font-bold text-slate-300">W-L: {team.wins}-{team.losses}</span>
                                <span>•</span>
                                <span>Bye: W{team.bye_week}</span>
                              </div>
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
