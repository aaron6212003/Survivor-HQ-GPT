import React from 'react';
import { ShieldCheck, Skull, Clock, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { EntryStatus, PickStatus } from '@/lib/types';

interface Props {
  type: 'entryStatus' | 'pickStatus';
  value: EntryStatus | PickStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ type, value, size = 'md' }: Props) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md',
    lg: 'px-3 py-1.5 text-sm font-bold rounded-lg',
  };

  if (type === 'entryStatus') {
    if (value === 'alive') {
      return (
        <span className={`inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          🟢 Alive
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 bg-rose-950/80 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}>
        <Skull className="w-3.5 h-3.5 text-rose-400" />
        🔴 Eliminated
      </span>
    );
  }

  // Pick status
  switch (value) {
    case 'win':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          ✅ Win
        </span>
      );
    case 'loss':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-rose-950/80 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}>
          <XCircle className="w-3.5 h-3.5" />
          ❌ Loss
        </span>
      );
    case 'submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-blue-950/80 text-blue-400 border border-blue-500/30 ${sizeClasses[size]}`}>
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          🔒 Pick Submitted
        </span>
      );
    case 'pending':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 bg-amber-950/80 text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          🟡 Pick Pending
        </span>
      );
  }
}
