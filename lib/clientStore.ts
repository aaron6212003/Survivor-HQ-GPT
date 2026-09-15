import { SurvivorPick, PickStatus } from './types';
import { DETAILED_OFFICIAL_GAMES } from './nflScheduleData';

const STORAGE_KEY = 'survivor_hq_picks_v2';
const LAST_UPDATED_KEY = 'survivor_hq_last_updated';

export interface SavedPickItem {
  entryId: string;
  week: number;
  teamId: string;
  status: PickStatus;
  updatedAt: string;
}

export function evaluatePickAgainstOfficialGames(teamId: string, week: number): PickStatus | null {
  if (!teamId || !week) return null;
  const game = DETAILED_OFFICIAL_GAMES.find(
    (g) => g.week === week && (g.away === teamId || g.home === teamId)
  );
  if (game && game.status === 'final') {
    if (game.winner_team_id) {
      return teamId === game.winner_team_id ? 'win' : 'loss';
    }
  }
  return null;
}

export function getLocalPicks(): SavedPickItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local picks:', e);
    return [];
  }
}

export function saveLocalPick(entryId: string, week: number, teamId: string, status: PickStatus = 'pending') {
  if (typeof window === 'undefined') return;
  try {
    const picks = getLocalPicks();
    const idx = picks.findIndex((p) => p.entryId === entryId && p.week === week);
    const officialEval = evaluatePickAgainstOfficialGames(teamId, week);
    const finalStatus = officialEval || status;

    const item: SavedPickItem = {
      entryId,
      week,
      teamId,
      status: finalStatus,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      picks[idx] = item;
    } else {
      picks.push(item);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
    localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
    window.dispatchEvent(new Event('survivor_pick_updated'));
  } catch (e) {
    console.error('Error saving local pick:', e);
  }
}

export function updateLocalLockStatus(entryId: string, week: number, status: PickStatus) {
  if (typeof window === 'undefined') return;
  try {
    const picks = getLocalPicks();
    const idx = picks.findIndex((p) => p.entryId === entryId && p.week === week);
    if (idx >= 0) {
      const officialEval = evaluatePickAgainstOfficialGames(picks[idx].teamId, week);
      picks[idx].status = officialEval || status;
      picks[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
      localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
      window.dispatchEvent(new Event('survivor_pick_updated'));
    }
  } catch (e) {
    console.error('Error updating local lock status:', e);
  }
}

export function saveLocalBulkPicks(bulkItems: { entryId: string; week: number; teamId: string; status?: PickStatus }[]) {
  if (typeof window === 'undefined') return;
  try {
    const picks = getLocalPicks();
    const now = new Date().toISOString();

    for (const item of bulkItems) {
      if (!item.entryId || !item.week || !item.teamId) continue;
      const idx = picks.findIndex((p) => p.entryId === item.entryId && p.week === item.week);
      const officialEval = evaluatePickAgainstOfficialGames(item.teamId, item.week);

      const entry: SavedPickItem = {
        entryId: item.entryId,
        week: item.week,
        teamId: item.teamId,
        status: officialEval || item.status || 'pending',
        updatedAt: now,
      };
      if (idx >= 0) {
        picks[idx] = entry;
      } else {
        picks.push(entry);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
    localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
    window.dispatchEvent(new Event('survivor_pick_updated'));
  } catch (e) {
    console.error('Error saving local bulk picks:', e);
  }
}

export function syncServerPicksToLocal(serverPicks: SurvivorPick[]) {
  if (typeof window === 'undefined') return;
  try {
    const localPicks = getLocalPicks();
    const localMap = new Map(localPicks.map((p) => [`${p.entryId}_W${p.week}`, p]));

    for (const sp of serverPicks) {
      if (!sp.entry_id || !sp.week || !sp.team_id) continue;
      const key = `${sp.entry_id}_W${sp.week}`;
      const local = localMap.get(key);
      const officialEval = evaluatePickAgainstOfficialGames(sp.team_id, sp.week);
      const finalStatus = officialEval || sp.status || 'pending';

      if (!local) {
        localMap.set(key, {
          entryId: sp.entry_id,
          week: sp.week,
          teamId: sp.team_id,
          status: finalStatus,
          updatedAt: sp.updated_at || new Date().toISOString(),
        });
      } else {
        local.teamId = sp.team_id;
        local.status = finalStatus;
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(localMap.values())));
  } catch (e) {
    console.error('Error syncing server picks to local:', e);
  }
}

export function getMergedPicks(serverPicks: SurvivorPick[] = []): SurvivorPick[] {
  syncServerPicksToLocal(serverPicks);

  const localPicks = getLocalPicks();
  if (localPicks.length === 0) return serverPicks;

  const serverMap = new Map(serverPicks.map((p) => [`${p.entry_id}_W${p.week}`, p]));
  const mergedMap = new Map<string, SurvivorPick>();

  for (const sp of serverPicks) {
    const key = `${sp.entry_id}_W${sp.week}`;
    const officialEval = evaluatePickAgainstOfficialGames(sp.team_id, sp.week);
    mergedMap.set(key, {
      ...sp,
      status: officialEval || sp.status,
    });
  }

  for (const lp of localPicks) {
    const key = `${lp.entryId}_W${lp.week}`;
    const serverMatch = serverMap.get(key);
    const officialEval = evaluatePickAgainstOfficialGames(lp.teamId, lp.week);

    const effectiveStatus =
      officialEval ||
      (serverMatch?.status === 'win' || serverMatch?.status === 'loss'
        ? serverMatch.status
        : lp.status);

    mergedMap.set(key, {
      id: serverMatch ? serverMatch.id : `P_${lp.entryId}_W${lp.week}`,
      entry_id: lp.entryId,
      week: lp.week,
      team_id: serverMatch ? serverMatch.team_id : lp.teamId,
      status: effectiveStatus,
      updated_at: lp.updatedAt,
      team: serverMatch?.team,
    });
  }

  const resultList = Array.from(mergedMap.values());

  // Clean local storage if an official evaluation changed status to win or loss
  if (typeof window !== 'undefined') {
    try {
      let changed = false;
      const updatedLocal = localPicks.map((lp) => {
        const officialEval = evaluatePickAgainstOfficialGames(lp.teamId, lp.week);
        if (officialEval && lp.status !== officialEval) {
          changed = true;
          return { ...lp, status: officialEval };
        }
        return lp;
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
      }
    } catch {}
  }

  return resultList;
}
