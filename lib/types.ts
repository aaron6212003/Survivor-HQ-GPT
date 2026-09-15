export type Conference = 'AFC' | 'NFC';
export type Division = 'East' | 'North' | 'South' | 'West';
export type EntryStatus = 'alive' | 'eliminated';
export type PickStatus = 'pending' | 'submitted' | 'win' | 'loss';

export interface NFLTeam {
  id: string;
  code: string;
  name: string;
  city: string;
  nickname: string;
  conference: Conference;
  division: Division;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  bye_week: number;
  wins: number;
  losses: number;
  ties: number;
}

export interface NFLGame {
  id: string;
  week: number;
  season: number;
  home_team_id: string;
  away_team_id: string;
  status: 'scheduled' | 'in_progress' | 'final';
  game_date?: string;
  game_time?: string;
  tv_network?: string;
  kickoff_at?: string;
  home_score?: number;
  away_score?: number;
  winner_team_id?: string;
  status_detail?: string;
  clock_display?: string;
  period?: number;
  home_record?: string;
  away_record?: string;
  // Joined fields
  home_team?: NFLTeam;
  away_team?: NFLTeam;
}

export interface SurvivorEntry {
  id: string;
  entry_number: number;
  name: string;
  status: EntryStatus;
  eliminated_week?: number;
}

export interface SurvivorPick {
  id: string;
  entry_id: string;
  week: number;
  team_id: string;
  status: PickStatus;
  updated_at: string;
  // Joined fields
  team?: NFLTeam;
  game?: NFLGame;
}

export interface PickNote {
  id: string;
  entry_id: string;
  week: number;
  note_text: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  entry_id?: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface PoolSettings {
  pool_name: string;
  current_season: number;
  current_week: number;
  pick_deadline: string;
  ties_count_as_losses: boolean;
  allow_team_reuse: boolean;
  picks_per_week: number;
  double_pick_weeks: number[];
  total_entries: number;
}

export interface DashboardEntrySummary {
  entry: SurvivorEntry;
  currentPick?: SurvivorPick;
  currentOpponent?: NFLTeam;
  isHome?: boolean;
  pickTeamRecord?: string;
  pickTeamName?: string;
  pickTeamLogo?: string;
  usedTeams: { week: number; team: NFLTeam }[];
  usedTeamIds: string[];
  availableTeamsCount: number;
  pickStatus: PickStatus;
  currentNote?: string;
}
