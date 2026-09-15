'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Calendar, Tv, Clock } from 'lucide-react';
import { NFLTeam } from '@/lib/types';

interface ScheduleGame {
  id: string;
  week: number;
  status: 'scheduled' | 'in_progress' | 'final';
  statusDetail?: string;
  game_date?: string;
  game_time?: string;
  tv_network?: string;
  isHome: boolean;
  opponent?: NFLTeam;
  teamScore?: number;
  oppScore?: number;
  result?: 'WIN' | 'LOSS' | 'TIE';
}

export default function TeamDetailPage() {
  const params = useParams();
  const code = (params.code as string) || '';

  const [team, setTeam] = useState<NFLTeam | null>(null);
  const [schedule, setSchedule] = useState<ScheduleGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    const loadTeamData = () => {
      fetch(`/api/teams/${code}?t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.team) {
            setTeam(data.team);
            setSchedule(data.schedule || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load team details:', err);
          setLoading(false);
        });
    };

    loadTeamData();

    window.addEventListener('focus', loadTeamData);
    document.addEventListener('visibilitychange', loadTeamData);
    window.addEventListener('survivor_pick_updated', loadTeamData);
    window.addEventListener('storage', loadTeamData);

    const interval = setInterval(loadTeamData, 1000);

    return () => {
      window.removeEventListener('focus', loadTeamData);
      document.removeEventListener('visibilitychange', loadTeamData);
      window.removeEventListener('survivor_pick_updated', loadTeamData);
      window.removeEventListener('storage', loadTeamData);
      clearInterval(interval);
    };
  }, [code]);

  if (loading || !team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-xs">Loading Team Profile & Schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 sm:px-0">
      {/* Back button */}
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Teams Database
      </Link>

      {/* Team Header Banner */}
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${team.primary_color}33 0%, #0F172A 100%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-950 p-2 border border-slate-800 shadow-2xl flex items-center justify-center flex-shrink-0">
            <Image src={team.logo_url} alt={team.name} width={64} height={64} className="object-contain" />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-slate-900/80 text-slate-300 text-xs font-extrabold px-2.5 py-1 rounded-md border border-slate-700 uppercase">
                {team.conference} {team.division}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-2.5 py-1 rounded-md border border-emerald-500/30">
                Bye Week: W{team.bye_week}
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">{team.name}</h1>
          </div>
        </div>
      </div>

      {/* Regular Season Schedule Table & Mobile Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            2026 Regular Season Schedule
          </span>
          <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/50">
            18 Weeks
          </span>
        </div>

        {/* Mobile View - Compact Cards */}
        <div className="block md:hidden space-y-3 p-3 bg-slate-900/40">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => {
            const game = schedule.find((g) => g.week === w);

            if (team.bye_week === w) {
              return (
                <div key={w} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">W{w}</span>
                    <span className="font-extrabold text-xs italic text-amber-400/90">BYE WEEK</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">No Game</span>
                </div>
              );
            }

            if (!game) return null;

            const { isHome, opponent, status, game_date, game_time, tv_network, result, teamScore, oppScore } = game;

            return (
              <div key={w} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">W{w}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                      isHome ? 'bg-blue-950 text-blue-400 border border-blue-800/40' : 'bg-slate-800 text-slate-300 border border-slate-700/50'
                    }`}>
                      {isHome ? 'Home' : 'Away'}
                    </span>
                  </div>

                  {status === 'final' ? (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className={`font-black px-2.5 py-1 rounded-md text-xs whitespace-nowrap inline-flex items-center gap-1 ${
                        result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        result === 'LOSS' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {result === 'WIN' ? `W ${teamScore}-${oppScore}` : result === 'LOSS' ? `L ${teamScore}-${oppScore}` : `T ${teamScore}-${oppScore}`}
                      </span>
                      <span className="text-slate-400 text-xs font-bold whitespace-nowrap">Final</span>
                    </div>
                  ) : status === 'in_progress' ? (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="bg-rose-500/20 text-rose-400 font-black text-xs px-2.5 py-1 rounded-md border border-rose-500/30 inline-flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        LIVE: {teamScore} - {oppScore}
                      </span>
                      <span className="text-slate-300 text-xs font-mono font-bold">{game.statusDetail || 'In Progress'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-300 font-bold whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{game_date && game_time ? `${game_date} • ${game_time} ET` : 'TBD'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  {opponent ? (
                    <Link href={`/teams/${opponent.code}`} className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors group">
                      <Image src={opponent.logo_url} alt={opponent.name} width={28} height={28} className="object-contain" />
                      <div>
                        <span className="font-black text-sm text-white group-hover:text-emerald-400 block">{opponent.name}</span>
                        <span className="text-xs text-slate-400 font-semibold">({opponent.code})</span>
                      </div>
                    </Link>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}

                  {status !== 'final' && tv_network && (
                    <span className="bg-slate-900 text-emerald-400 font-extrabold text-[10px] px-2 py-0.5 rounded border border-slate-800 uppercase flex items-center gap-1">
                      <Tv className="w-3 h-3 text-emerald-400" />
                      {tv_network}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View - Wide Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 w-20">Week</th>
                <th className="py-3.5 px-4">Opponent</th>
                <th className="py-3.5 px-4 w-28">Location</th>
                <th className="py-3.5 px-4 w-64">Kickoff & Broadcast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => {
                const game = schedule.find((g) => g.week === w);

                if (team.bye_week === w) {
                  return (
                    <tr key={w} className="bg-slate-950/40 text-slate-500">
                      <td className="py-3.5 px-4 font-bold text-slate-400">W{w}</td>
                      <td className="py-3.5 px-4 font-bold italic text-amber-400/80">BYE WEEK</td>
                      <td className="py-3.5 px-4 text-slate-600">—</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-semibold">
                          No Game Scheduled
                        </span>
                      </td>
                    </tr>
                  );
                }

                if (!game) return null;

                const { isHome, opponent, status, game_date, game_time, tv_network, result, teamScore, oppScore } = game;

                return (
                  <tr key={w} className={`transition-colors ${status === 'in_progress' ? 'bg-rose-950/20 border-l-2 border-l-rose-500' : 'hover:bg-slate-800/40'}`}>
                    <td className="py-3.5 px-4 font-extrabold text-white">W{w}</td>

                    <td className="py-3.5 px-4">
                      {opponent ? (
                        <Link
                          href={`/teams/${opponent.code}`}
                          className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors group"
                        >
                          <Image src={opponent.logo_url} alt={opponent.name} width={24} height={24} className="object-contain" />
                          <span className="font-extrabold text-sm text-slate-100 group-hover:text-emerald-400">{opponent.name}</span>
                          <span className="text-xs font-mono text-slate-400 font-semibold">({opponent.code})</span>
                        </Link>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-bold whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase whitespace-nowrap ${
                        isHome ? 'bg-blue-950 text-blue-400 border border-blue-800/40' : 'bg-slate-800 text-slate-300 border border-slate-700/50'
                      }`}>
                        {isHome ? 'Home' : 'Away'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      {status === 'final' ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className={`font-black px-2.5 py-1 rounded-md text-xs whitespace-nowrap inline-flex items-center gap-1.5 ${
                            result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            result === 'LOSS' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {result === 'WIN' ? `W ${teamScore}-${oppScore}` : result === 'LOSS' ? `L ${teamScore}-${oppScore}` : `T ${teamScore}-${oppScore}`}
                          </span>
                          <span className="text-slate-400 text-xs font-bold whitespace-nowrap">Final</span>
                        </div>
                      ) : status === 'in_progress' ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="bg-rose-500/20 text-rose-400 font-black text-xs px-2.5 py-1 rounded-md border border-rose-500/30 inline-flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            LIVE: {teamScore} - {oppScore}
                          </span>
                          <span className="text-slate-300 text-xs font-mono font-bold">{game.statusDetail || 'In Progress'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                          {game_date && game_time ? (
                            <span className="font-bold text-slate-200 flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {game_date} • {game_time} ET
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium whitespace-nowrap">TBD</span>
                          )}

                          {tv_network && (
                            <span className="bg-slate-800 text-emerald-400 font-extrabold text-[10px] px-2 py-0.5 rounded border border-slate-700 uppercase tracking-wide flex items-center gap-1 whitespace-nowrap">
                              <Tv className="w-2.5 h-2.5 text-emerald-400" />
                              {tv_network}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
