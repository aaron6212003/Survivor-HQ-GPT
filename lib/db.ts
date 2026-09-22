import path from 'path';
import fs from 'fs';
import { INITIAL_TEAMS } from './nflData';
import { generateOfficialGames, isGameLocked, parseKickoffDate, getCurrentNFLWeek } from './nflScheduleData';
import {
  NFLTeam,
  NFLGame,
  SurvivorEntry,
  SurvivorPick,
  PickNote,
  ActivityLog,
  PoolSettings,
  DashboardEntrySummary,
  PickStatus,
} from './types';

interface DatabaseSchema {
  teams: NFLTeam[];
  games: Omit<NFLGame, 'home_team' | 'away_team'>[];
  entries: SurvivorEntry[];
  picks: SurvivorPick[];
  notes: PickNote[];
  settings: PoolSettings;
  activity_log: ActivityLog[];
}

const IS_VERCEL = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
const PRIMARY_PATH = path.join(process.cwd(), 'data', 'survivor.json');
const TMP_PATH = path.join('/tmp', 'survivor.json');

// In-memory store fallback for serverless lambda environments
let memoryStore: DatabaseSchema | null = null;
let lastMtimeMs = 0;

function ensureDataDir() {
  if (!fs.existsSync(path.dirname(PRIMARY_PATH))) {
    try {
      fs.mkdirSync(path.dirname(PRIMARY_PATH), { recursive: true });
    } catch {}
  }
}

function getCleanInitialData(): DatabaseSchema {
  const teams = INITIAL_TEAMS.map((t) => ({
    ...t,
    wins: 0,
    losses: 0,
    ties: 0,
  }));

  const games = generateOfficialGames();

  const entries: SurvivorEntry[] = [];

  const settings: PoolSettings = {
    pool_name: 'NFL Survivor & Pick\'em Hub',
    current_season: 2026,
    current_week: 1,
    pick_deadline: 'Prior to Kickoff',
    ties_count_as_losses: true,
    allow_team_reuse: false,
    picks_per_week: 1,
    double_pick_weeks: [12, 16],
    total_entries: 0,
  };

  const now = new Date().toISOString();

  return {
    teams,
    games,
    entries,
    picks: [],
    notes: [],
    settings,
    activity_log: [
      { id: 'L1', entry_id: undefined, action: 'Pool Initialized', details: 'Clean slate 8-entry pool created for 2026 NFL Season', timestamp: now },
    ],
  };
}

export function syncAndEvaluateData(data: DatabaseSchema) {
  const officialGames = generateOfficialGames();
  const gameMap = new Map<string, Omit<NFLGame, 'home_team' | 'away_team'>>();
  for (const g of officialGames) {
    gameMap.set(g.id, g);
  }
  if (data.games && Array.isArray(data.games)) {
    for (const g of data.games) {
      const existing = gameMap.get(g.id);
      if (existing) {
        gameMap.set(g.id, { ...existing, ...Object.fromEntries(Object.entries(g).filter(([, value]) => value !== undefined)) });
      } else {
        gameMap.set(g.id, g);
      }
    }
  }

  const updatedGames = Array.from(gameMap.values());
  data.games = updatedGames;

  const teamWeekGameMap = new Map<string, typeof updatedGames[0]>();
  for (const g of updatedGames) {
    teamWeekGameMap.set(`${g.home_team_id}_W${g.week}`, g);
    teamWeekGameMap.set(`${g.away_team_id}_W${g.week}`, g);
  }

  // 1. Evaluate Pick Statuses
  for (const p of data.picks) {
    const game = teamWeekGameMap.get(`${p.team_id}_W${p.week}`);
    if (game && game.status === 'final' && game.winner_team_id) {
      if (p.team_id === game.winner_team_id) {
        p.status = 'win';
      } else {
        p.status = 'loss';
      }
    }
  }

  // 2. Evaluate Entry Statuses
  for (const entry of data.entries) {
    const entryPicks = data.picks.filter((p) => p.entry_id === entry.id);
    const lostPick = entryPicks.find((p) => p.status === 'loss');
    if (lostPick) {
      entry.status = 'eliminated';
      entry.eliminated_week = lostPick.week;
    } else {
      entry.status = 'alive';
      entry.eliminated_week = undefined;
    }
  }

  // 3. Evaluate Team Records (wins / losses / ties)
  const teamStats = new Map<string, { wins: number; losses: number; ties: number }>();
  for (const t of data.teams) {
    teamStats.set(t.id, { wins: 0, losses: 0, ties: 0 });
  }

  for (const g of updatedGames) {
    if (g.status === 'final' && g.home_score !== undefined && g.away_score !== undefined) {
      const hStats = teamStats.get(g.home_team_id) || { wins: 0, losses: 0, ties: 0 };
      const aStats = teamStats.get(g.away_team_id) || { wins: 0, losses: 0, ties: 0 };

      if (g.home_score > g.away_score) {
        hStats.wins += 1;
        aStats.losses += 1;
      } else if (g.away_score > g.home_score) {
        aStats.wins += 1;
        hStats.losses += 1;
      } else {
        hStats.ties += 1;
        aStats.ties += 1;
      }
      teamStats.set(g.home_team_id, hStats);
      teamStats.set(g.away_team_id, aStats);
    }
  }

  for (const t of data.teams) {
    const stats = teamStats.get(t.id);
    if (stats) {
      t.wins = stats.wins;
      t.losses = stats.losses;
      t.ties = stats.ties;
    }
  }

  // Automatically advance current_week every Tuesday at 12:00 AM ET
  data.settings.current_week = getCurrentNFLWeek();
}

export function readData(): DatabaseSchema {
  let data: DatabaseSchema;
  if (fs.existsSync(TMP_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_PATH, 'utf-8');
      data = JSON.parse(raw);
    } catch {
      data = getCleanInitialData();
    }
  } else if (fs.existsSync(PRIMARY_PATH)) {
    try {
      const raw = fs.readFileSync(PRIMARY_PATH, 'utf-8');
      data = JSON.parse(raw);
    } catch {
      data = getCleanInitialData();
    }
  } else if (memoryStore) {
    data = memoryStore;
  } else {
    data = getCleanInitialData();
  }

  syncAndEvaluateData(data);
  memoryStore = data;
  return data;
}

export function writeData(data: DatabaseSchema) {
  memoryStore = data;
  lastMtimeMs = Date.now();
  const jsonStr = JSON.stringify(data, null, 2);

  // 1. Atomic write to /tmp/survivor.json (guaranteed writable on Vercel)
  try {
    const tmpWritePath = `${TMP_PATH}.${Date.now()}_${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tmpWritePath, jsonStr, 'utf-8');
    fs.renameSync(tmpWritePath, TMP_PATH);
  } catch (e) {
    console.warn('Could not write to /tmp:', e);
  }

  // 2. Atomic write to local project disk if local dev
  if (!IS_VERCEL) {
    try {
      ensureDataDir();
      const localTmpPath = `${PRIMARY_PATH}.${Date.now()}_${Math.random().toString(36).slice(2)}.tmp`;
      fs.writeFileSync(localTmpPath, jsonStr, 'utf-8');
      fs.renameSync(localTmpPath, PRIMARY_PATH);
    } catch (e) {
      console.warn('Could not write to local disk:', e);
    }
  }
}

// Queries
export function getSettings(): PoolSettings {
  return readData().settings;
}

export function getAllTeams(): NFLTeam[] {
  const data = readData();
  return data.teams.sort((a, b) => a.conference.localeCompare(b.conference) || a.division.localeCompare(b.division) || a.name.localeCompare(b.name));
}

export function getTeamByCode(code: string): NFLTeam | undefined {
  const teams = getAllTeams();
  return teams.find((t) => t.code.toUpperCase() === code.toUpperCase() || t.id.toUpperCase() === code.toUpperCase());
}

export function getAllEntries(): SurvivorEntry[] {
  const data = readData();
  return data.entries.sort((a, b) => a.entry_number - b.entry_number);
}

export function getGamesForWeek(week: number): NFLGame[] {
  const teams = getAllTeams();
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const officialGames = generateOfficialGames().filter((g) => g.week === week);

  return officialGames.map((g) => ({
    ...g,
    home_team: teamMap.get(g.home_team_id),
    away_team: teamMap.get(g.away_team_id),
  }));
}

export function getAllGames(): NFLGame[] {
  const teams = getAllTeams();
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const officialGames = generateOfficialGames();

  return officialGames.map((g) => ({
    ...g,
    home_team: teamMap.get(g.home_team_id),
    away_team: teamMap.get(g.away_team_id),
  }));
}

export function getPicksForEntry(entryId: string): SurvivorPick[] {
  const data = readData();
  const picks = data.picks.filter((p) => p.entry_id === entryId).sort((a, b) => a.week - b.week);
  const teamMap = new Map(data.teams.map((t) => [t.id, t]));

  return picks.map((p) => ({
    ...p,
    team: teamMap.get(p.team_id),
  }));
}

export function getAllPicks(): SurvivorPick[] {
  const data = readData();
  const teamMap = new Map(data.teams.map((t) => [t.id, t]));

  return data.picks.map((p) => ({
    ...p,
    team: teamMap.get(p.team_id),
  }));
}

export function getNotesForEntry(entryId: string): PickNote[] {
  const data = readData();
  return data.notes.filter((n) => n.entry_id === entryId).sort((a, b) => a.week - b.week);
}

export function getActivityLogs(limit = 50): ActivityLog[] {
  const data = readData();
  return data.activity_log
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getDashboardSummaries(currentWeek: number): DashboardEntrySummary[] {
  const entries = getAllEntries();
  const teams = getAllTeams();
  const weekGames = getGamesForWeek(currentWeek);
  const data = readData();

  const summaries: DashboardEntrySummary[] = [];

  for (const entry of entries) {
    const entryPicks = getPicksForEntry(entry.id);
    const usedTeams: { week: number; team: NFLTeam }[] = [];
    const usedTeamIds: string[] = [];

    for (const p of entryPicks) {
      if (p.week < currentWeek && p.team) {
        usedTeams.push({ week: p.week, team: p.team });
        usedTeamIds.push(p.team_id);
      }
    }

    const currentPick = entryPicks.find((p) => p.week === currentWeek);
    let currentOpponent: NFLTeam | undefined = undefined;
    let isHome = false;
    let pickTeamRecord = undefined;
    let pickTeamName = undefined;
    let pickTeamLogo = undefined;

    if (currentPick && currentPick.team) {
      pickTeamName = currentPick.team.name;
      pickTeamLogo = currentPick.team.logo_url;
      pickTeamRecord = `${currentPick.team.wins}-${currentPick.team.losses}${currentPick.team.ties ? '-' + currentPick.team.ties : ''}`;

      const game = weekGames.find((g) => g.home_team_id === currentPick.team_id || g.away_team_id === currentPick.team_id);
      if (game) {
        if (game.home_team_id === currentPick.team_id) {
          isHome = true;
          currentOpponent = game.away_team;
        } else {
          isHome = false;
          currentOpponent = game.home_team;
        }
      }
    }

    const availableTeamsCount = teams.length - usedTeamIds.length;
    const note = data.notes.find((n) => n.entry_id === entry.id && n.week === currentWeek);

    summaries.push({
      entry,
      currentPick,
      currentOpponent,
      isHome,
      pickTeamRecord,
      pickTeamName,
      pickTeamLogo,
      usedTeams,
      usedTeamIds,
      availableTeamsCount,
      pickStatus: currentPick ? currentPick.status : 'pending',
      currentNote: note?.note_text,
    });
  }

  return summaries;
}

// Mutations
export function setPick(entryId: string, week: number, teamId: string, status: PickStatus = 'pending') {
  const data = readData();
  const weekGames = getGamesForWeek(week);
  const teamGame = weekGames.find((g) => g.home_team_id === teamId || g.away_team_id === teamId);
  if (teamGame && isGameLocked(teamGame)) {
    throw new Error(`The game involving team ${teamId} in Week ${week} has already started and is locked for picks.`);
  }

  const existingPicks = getPicksForEntry(entryId);
  const usedPrior = existingPicks.some((p) => p.week < week && p.team_id === teamId);

  if (usedPrior && !data.settings.allow_team_reuse) {
    throw new Error(`Team ${teamId} has already been used by this entry in a prior week.`);
  }

  const pickIndex = data.picks.findIndex((p) => p.entry_id === entryId && p.week === week);
  const id = `P_${entryId}_W${week}`;
  const now = new Date().toISOString();

  if (pickIndex >= 0) {
    data.picks[pickIndex] = {
      ...data.picks[pickIndex],
      team_id: teamId,
      status,
      updated_at: now,
    };
  } else {
    data.picks.push({
      id,
      entry_id: entryId,
      week,
      team_id: teamId,
      status,
      updated_at: now,
    });
  }

  const entry = data.entries.find((e) => e.id === entryId);
  const team = data.teams.find((t) => t.id === teamId);
  const logId = `LOG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  data.activity_log.unshift({
    id: logId,
    entry_id: entryId,
    action: 'Pick Updated',
    details: `${entry?.name || entryId} selected ${team?.code || teamId} for Week ${week}`,
    timestamp: now,
  });

  writeData(data);
}

export function setBulkPicks(
  picks: { entryId: string; week: number; teamId: string; status?: PickStatus }[]
) {
  const data = readData();
  const now = new Date().toISOString();
  const weekGamesMap = new Map<number, NFLGame[]>();

  for (const item of picks) {
    const { entryId, week, teamId, status = 'pending' } = item;
    if (!entryId || !week || !teamId) continue;

    if (!weekGamesMap.has(week)) {
      weekGamesMap.set(week, getGamesForWeek(week));
    }
    const weekGames = weekGamesMap.get(week) || [];
    const teamGame = weekGames.find((g) => g.home_team_id === teamId || g.away_team_id === teamId);
    if (teamGame && isGameLocked(teamGame)) {
      console.warn(`Skipping pick for ${teamId} in Week ${week} because the game is locked.`);
      continue;
    }

    const existingPicks = data.picks.filter((p) => p.entry_id === entryId);
    const usedPrior = existingPicks.some((p) => p.week < week && p.team_id === teamId);

    if (usedPrior && !data.settings.allow_team_reuse) {
      throw new Error(`Team ${teamId} has already been used by entry ${entryId} in a prior week.`);
    }

    const pickIndex = data.picks.findIndex((p) => p.entry_id === entryId && p.week === week);
    const id = `P_${entryId}_W${week}`;

    if (pickIndex >= 0) {
      data.picks[pickIndex] = {
        ...data.picks[pickIndex],
        team_id: teamId,
        status: status || data.picks[pickIndex].status || 'pending',
        updated_at: now,
      };
    } else {
      data.picks.push({
        id,
        entry_id: entryId,
        week,
        team_id: teamId,
        status: status || 'pending',
        updated_at: now,
      });
    }

    const entry = data.entries.find((e) => e.id === entryId);
    const team = data.teams.find((t) => t.id === teamId);
    const logId = `LOG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    data.activity_log.unshift({
      id: logId,
      entry_id: entryId,
      action: 'Pick Updated',
      details: `${entry?.name || entryId} selected ${team?.code || teamId} for Week ${week}`,
      timestamp: now,
    });
  }

  writeData(data);
}

export function updatePickStatus(entryId: string, week: number, status: PickStatus) {
  const data = readData();
  const pick = data.picks.find((p) => p.entry_id === entryId && p.week === week);

  if (pick) {
    const weekGames = getGamesForWeek(week);
    const teamGame = weekGames.find((g) => g.home_team_id === pick.team_id || g.away_team_id === pick.team_id);
    if (teamGame && isGameLocked(teamGame) && status === 'pending') {
      throw new Error(`Cannot unlock pick for ${pick.team_id} because the game has already started.`);
    }

    pick.status = status;
    pick.updated_at = new Date().toISOString();

    const entry = data.entries.find((e) => e.id === entryId);
    const logId = `LOG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    data.activity_log.unshift({
      id: logId,
      entry_id: entryId,
      action: `Pick ${status === 'submitted' ? 'Submitted' : 'Unlocked'}`,
      details: `${entry?.name || entryId} marked Week ${week} pick as ${status}`,
      timestamp: new Date().toISOString(),
    });

    writeData(data);
  }
}

export function saveNote(entryId: string, week: number, noteText: string) {
  const data = readData();
  const index = data.notes.findIndex((n) => n.entry_id === entryId && n.week === week);
  const now = new Date().toISOString();

  if (!noteText.trim()) {
    if (index >= 0) {
      data.notes.splice(index, 1);
    }
  } else {
    if (index >= 0) {
      data.notes[index] = { ...data.notes[index], note_text: noteText, created_at: now };
    } else {
      data.notes.push({
        id: `N_${entryId}_W${week}`,
        entry_id: entryId,
        week,
        note_text: noteText,
        created_at: now,
      });
    }
  }
  writeData(data);
}

export function updateEntry(id: string, name: string) {
  const data = readData();
  const entry = data.entries.find((e) => e.id === id);
  if (entry) {
    entry.name = name;
    writeData(data);
    addActivityLog(id, 'Entry Updated', `Updated entry name: "${name}"`);
  }
}

export function updateSettings(newSettings: Partial<PoolSettings>) {
  const data = readData();
  data.settings = { ...data.settings, ...newSettings };
  writeData(data);
  addActivityLog(undefined, 'Settings Updated', 'Pool settings were updated');
}

export function addActivityLog(entryId: string | undefined, action: string, details: string) {
  const data = readData();
  const id = `LOG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  data.activity_log.unshift({
    id,
    entry_id: entryId,
    action,
    details,
    timestamp: new Date().toISOString(),
  });
  writeData(data);
}

export function resetPoolData() {
  const init = getCleanInitialData();
  writeData(init);
}
