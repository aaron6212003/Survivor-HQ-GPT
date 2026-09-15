import { NFLGame } from './types';

export interface DetailedNFLGameSpec {
  week: number;
  away: string;
  home: string;
  date: string;
  time: string;
  tv: string;
  status?: 'scheduled' | 'in_progress' | 'final';
  away_score?: number;
  home_score?: number;
  winner_team_id?: string;
}

export const DETAILED_OFFICIAL_GAMES: DetailedNFLGameSpec[] = [
  {
    "week": 1,
    "date": "Wed 9/9",
    "away": "NE",
    "home": "SEA",
    "time": "8:20p",
    "tv": "NBC",
    "status": "final",
    "away_score": 10,
    "home_score": 13,
    "winner_team_id": "SEA"
  },
  {
    "week": 1,
    "date": "Thu 9/10",
    "away": "SF",
    "home": "LAR",
    "time": "8:35p",
    "tv": "Netflix",
    "status": "final",
    "away_score": 27,
    "home_score": 7,
    "winner_team_id": "SF"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "CHI",
    "home": "CAR",
    "time": "1:00p",
    "tv": "FOX",
    "status": "final",
    "away_score": 59,
    "home_score": 37,
    "winner_team_id": "CHI"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "TB",
    "home": "CIN",
    "time": "1:00p",
    "tv": "FOX",
    "status": "final",
    "away_score": 27,
    "home_score": 33,
    "winner_team_id": "CIN"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "NO",
    "home": "DET",
    "time": "1:00p",
    "tv": "FOX",
    "status": "final",
    "away_score": 30,
    "home_score": 31,
    "winner_team_id": "DET"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "BUF",
    "home": "HOU",
    "time": "1:00p",
    "tv": "CBS",
    "status": "final",
    "away_score": 36,
    "home_score": 31,
    "winner_team_id": "BUF"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "BAL",
    "home": "IND",
    "time": "1:00p",
    "tv": "CBS",
    "status": "final",
    "away_score": 41,
    "home_score": 23,
    "winner_team_id": "BAL"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "CLE",
    "home": "JAX",
    "time": "1:00p",
    "tv": "CBS",
    "status": "final",
    "away_score": 10,
    "home_score": 34,
    "winner_team_id": "JAX"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "ATL",
    "home": "PIT",
    "time": "1:00p",
    "tv": "FOX",
    "status": "final",
    "away_score": 13,
    "home_score": 20,
    "winner_team_id": "PIT"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "NYJ",
    "home": "TEN",
    "time": "1:00p",
    "tv": "CBS",
    "status": "final",
    "away_score": 23,
    "home_score": 10,
    "winner_team_id": "NYJ"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "ARI",
    "home": "LAC",
    "time": "4:25p",
    "tv": "CBS",
    "status": "final",
    "away_score": 26,
    "home_score": 14,
    "winner_team_id": "ARI"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "MIA",
    "home": "LV",
    "time": "4:25p",
    "tv": "FOX",
    "status": "final",
    "away_score": 13,
    "home_score": 27,
    "winner_team_id": "LV"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "GB",
    "home": "MIN",
    "time": "4:25p",
    "tv": "CBS",
    "status": "final",
    "away_score": 22,
    "home_score": 39,
    "winner_team_id": "MIN"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "WAS",
    "home": "PHI",
    "time": "4:25p",
    "tv": "FOX",
    "status": "final",
    "away_score": 22,
    "home_score": 24,
    "winner_team_id": "PHI"
  },
  {
    "week": 1,
    "date": "Sun 9/13",
    "away": "DAL",
    "home": "NYG",
    "time": "8:20p",
    "tv": "NBC",
    "status": "final",
    "away_score": 20,
    "home_score": 28,
    "winner_team_id": "NYG"
  },
  {
    "week": 1,
    "date": "Mon 9/14",
    "away": "DEN",
    "home": "KC",
    "time": "8:15p",
    "tv": "ESPN/ABC",
    "status": "final",
    "away_score": 10,
    "home_score": 31,
    "winner_team_id": "KC"
  },
  {
    "week": 2,
    "date": "Thu 9/17",
    "away": "DET",
    "home": "BUF",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "CAR",
    "home": "ATL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "NO",
    "home": "BAL",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "MIN",
    "home": "CHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "CIN",
    "home": "HOU",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "PIT",
    "home": "NE",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "GB",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "CLE",
    "home": "TB",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "PHI",
    "home": "TEN",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "JAX",
    "home": "DEN",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "LV",
    "home": "LAC",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "SEA",
    "home": "ARI",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "WAS",
    "home": "DAL",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "MIA",
    "home": "SF",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 2,
    "date": "Sun 9/20",
    "away": "IND",
    "home": "KC",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 2,
    "date": "Mon 9/21",
    "away": "NYG",
    "home": "LAR",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 3,
    "date": "Thu 9/24",
    "away": "ATL",
    "home": "GB",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "LAC",
    "home": "BUF",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "CAR",
    "home": "CLE",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "NYJ",
    "home": "DET",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "HOU",
    "home": "IND",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "NE",
    "home": "JAX",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "KC",
    "home": "MIA",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "TEN",
    "home": "NYG",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "CIN",
    "home": "PIT",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "SEA",
    "home": "WAS",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "ARI",
    "home": "SF",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "MIN",
    "home": "TB",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "BAL",
    "home": "DAL",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "LV",
    "home": "NO",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 3,
    "date": "Sun 9/27",
    "away": "LAR",
    "home": "DEN",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 3,
    "date": "Mon 9/28",
    "away": "PHI",
    "home": "CHI",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 4,
    "date": "Thu 10/1",
    "away": "PIT",
    "home": "CLE",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "IND",
    "home": "WAS",
    "time": "9:30a",
    "tv": "NFL Net"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "TEN",
    "home": "BAL",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "NE",
    "home": "BUF",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "NYJ",
    "home": "CHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "JAX",
    "home": "CIN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "DAL",
    "home": "HOU",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "ARI",
    "home": "NYG",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "LAR",
    "home": "PHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "GB",
    "home": "TB",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "MIA",
    "home": "MIN",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "KC",
    "home": "LV",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "LAC",
    "home": "SEA",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "DEN",
    "home": "SF",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 4,
    "date": "Sun 10/4",
    "away": "DET",
    "home": "CAR",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 4,
    "date": "Mon 10/5",
    "away": "ATL",
    "home": "NO",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 5,
    "date": "Thu 10/8",
    "away": "TB",
    "home": "DAL",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "PHI",
    "home": "JAX",
    "time": "9:30a",
    "tv": "NFL Net"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "CIN",
    "home": "MIA",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "LV",
    "home": "NE",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "MIN",
    "home": "NO",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "CLE",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "IND",
    "home": "PIT",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "HOU",
    "home": "TEN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "NYG",
    "home": "WAS",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "DEN",
    "home": "LAC",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "DET",
    "home": "ARI",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "CHI",
    "home": "GB",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "SF",
    "home": "SEA",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 5,
    "date": "Sun 10/11",
    "away": "BAL",
    "home": "ATL",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 5,
    "date": "Mon 10/12",
    "away": "BUF",
    "home": "LAR",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 6,
    "date": "Thu 10/15",
    "away": "SEA",
    "home": "DEN",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "HOU",
    "home": "JAX",
    "time": "9:30a",
    "tv": "NFL Net"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "CHI",
    "home": "ATL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "BAL",
    "home": "CLE",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "TEN",
    "home": "IND",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "NYJ",
    "home": "NE",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "NO",
    "home": "NYG",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "CAR",
    "home": "PHI",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "PIT",
    "home": "TB",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "ARI",
    "home": "LAR",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "LAC",
    "home": "KC",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "BUF",
    "home": "LV",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 6,
    "date": "Sun 10/18",
    "away": "DAL",
    "home": "GB",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 6,
    "date": "Mon 10/19",
    "away": "WAS",
    "home": "SF",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 7,
    "date": "Thu 10/22",
    "away": "NE",
    "home": "CHI",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "PIT",
    "home": "NO",
    "time": "9:30a",
    "tv": "NFL Net"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "SF",
    "home": "ATL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "CIN",
    "home": "BAL",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "TB",
    "home": "CAR",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "NYG",
    "home": "HOU",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "IND",
    "home": "MIN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "MIA",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "CLE",
    "home": "TEN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "DEN",
    "home": "ARI",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "GB",
    "home": "DET",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "LAR",
    "home": "LV",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 7,
    "date": "Sun 10/25",
    "away": "KC",
    "home": "SEA",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 7,
    "date": "Mon 10/26",
    "away": "DAL",
    "home": "PHI",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 8,
    "date": "Thu 10/29",
    "away": "CAR",
    "home": "GB",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "BAL",
    "home": "BUF",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "TEN",
    "home": "CIN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "ARI",
    "home": "DAL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "MIN",
    "home": "DET",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "IND",
    "home": "JAX",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "LV",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "CLE",
    "home": "PIT",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "ATL",
    "home": "TB",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "LAC",
    "home": "LAR",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "KC",
    "home": "DEN",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "NE",
    "home": "MIA",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 8,
    "date": "Sun 11/1",
    "away": "PHI",
    "home": "WAS",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 8,
    "date": "Mon 11/2",
    "away": "CHI",
    "home": "SEA",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 9,
    "date": "Thu 11/5",
    "away": "JAX",
    "home": "BAL",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "CIN",
    "home": "ATL",
    "time": "9:30a",
    "tv": "NFL Net"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "DEN",
    "home": "CAR",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "DAL",
    "home": "IND",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "NYJ",
    "home": "KC",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "DET",
    "home": "MIA",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "CLE",
    "home": "NO",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "NYG",
    "home": "PHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "LAR",
    "home": "WAS",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "HOU",
    "home": "LAC",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "LV",
    "home": "SF",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "GB",
    "home": "NE",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "ARI",
    "home": "SEA",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 9,
    "date": "Sun 11/8",
    "away": "TB",
    "home": "CHI",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 9,
    "date": "Mon 11/9",
    "away": "BUF",
    "home": "MIN",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 10,
    "date": "Thu 11/12",
    "away": "WAS",
    "home": "NYG",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "NE",
    "home": "DET",
    "time": "9:30a",
    "tv": "FOX"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "KC",
    "home": "ATL",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "HOU",
    "home": "CLE",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "MIN",
    "home": "GB",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "MIA",
    "home": "IND",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "CAR",
    "home": "NO",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "BUF",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "JAX",
    "home": "TEN",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "LAR",
    "home": "ARI",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "SEA",
    "home": "LV",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "SF",
    "home": "DAL",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 10,
    "date": "Sun 11/15",
    "away": "PIT",
    "home": "CIN",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 10,
    "date": "Mon 11/16",
    "away": "LAC",
    "home": "BAL",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 11,
    "date": "Thu 11/19",
    "away": "IND",
    "home": "HOU",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "MIA",
    "home": "BUF",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "BAL",
    "home": "CAR",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "NO",
    "home": "CHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "TEN",
    "home": "DAL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "TB",
    "home": "DET",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "ARI",
    "home": "KC",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "JAX",
    "home": "NYG",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "NYJ",
    "home": "LAC",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "LV",
    "home": "DEN",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "PIT",
    "home": "PHI",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 11,
    "date": "Sun 11/22",
    "away": "MIN",
    "home": "SF",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 11,
    "date": "Mon 11/23",
    "away": "CIN",
    "home": "WAS",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 12,
    "date": "Wed 11/25",
    "away": "GB",
    "home": "LAR",
    "time": "8:00p",
    "tv": "Netflix"
  },
  {
    "week": 12,
    "date": "Thu 11/26",
    "away": "CHI",
    "home": "DET",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 12,
    "date": "Thu 11/26",
    "away": "PHI",
    "home": "DAL",
    "time": "4:30p",
    "tv": "FOX"
  },
  {
    "week": 12,
    "date": "Thu 11/26",
    "away": "KC",
    "home": "BUF",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 12,
    "date": "Fri 11/27",
    "away": "DEN",
    "home": "PIT",
    "time": "3:00p",
    "tv": "Amazon"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "NO",
    "home": "CIN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "LV",
    "home": "CLE",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "BAL",
    "home": "HOU",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "NYG",
    "home": "IND",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "NYJ",
    "home": "MIA",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "ATL",
    "home": "MIN",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "TEN",
    "home": "JAX",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "WAS",
    "home": "ARI",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "SEA",
    "home": "SF",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 12,
    "date": "Sun 11/29",
    "away": "NE",
    "home": "LAC",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 12,
    "date": "Mon 11/30",
    "away": "CAR",
    "home": "TB",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 13,
    "date": "Thu 12/3",
    "away": "KC",
    "home": "LAR",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "DET",
    "home": "ATL",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "JAX",
    "home": "CHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "CIN",
    "home": "CLE",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "GB",
    "home": "NO",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "SF",
    "home": "NYG",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "LAC",
    "home": "TB",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "WAS",
    "home": "TEN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "PHI",
    "home": "ARI",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "MIA",
    "home": "DEN",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "CAR",
    "home": "MIN",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "BUF",
    "home": "NE",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 13,
    "date": "Sun 12/6",
    "away": "HOU",
    "home": "PIT",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 13,
    "date": "Mon 12/7",
    "away": "DAL",
    "home": "SEA",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 14,
    "date": "Thu 12/10",
    "away": "MIN",
    "home": "NE",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "TB",
    "home": "BAL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "NO",
    "home": "CAR",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "ATL",
    "home": "CLE",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "TEN",
    "home": "DET",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "CHI",
    "home": "MIA",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "DEN",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "IND",
    "home": "PHI",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "HOU",
    "home": "WAS",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "LAC",
    "home": "LV",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "KC",
    "home": "CIN",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "NYG",
    "home": "SEA",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "LAR",
    "home": "SF",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 14,
    "date": "Sun 12/13",
    "away": "BUF",
    "home": "GB",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 14,
    "date": "Mon 12/14",
    "away": "PIT",
    "home": "JAX",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 15,
    "date": "Thu 12/17",
    "away": "SF",
    "home": "LAC",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 15,
    "date": "Sat 12/19",
    "away": "SEA",
    "home": "PHI",
    "time": "5:00p",
    "tv": "FOX"
  },
  {
    "week": 15,
    "date": "Sat 12/19",
    "away": "CHI",
    "home": "BUF",
    "time": "8:20p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "CIN",
    "home": "CAR",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "MIA",
    "home": "GB",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "JAX",
    "home": "HOU",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "CLE",
    "home": "NYG",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "BAL",
    "home": "PIT",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "NO",
    "home": "TB",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "IND",
    "home": "TEN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "ATL",
    "home": "WAS",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "NYJ",
    "home": "ARI",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "DAL",
    "home": "LAR",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "DEN",
    "home": "LV",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 15,
    "date": "Sun 12/20",
    "away": "DET",
    "home": "MIN",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 15,
    "date": "Mon 12/21",
    "away": "NE",
    "home": "KC",
    "time": "8:15p",
    "tv": "ESPN/ABC"
  },
  {
    "week": 16,
    "date": "Thu 12/24",
    "away": "HOU",
    "home": "PHI",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 16,
    "date": "Fri 12/25",
    "away": "GB",
    "home": "CHI",
    "time": "1:00p",
    "tv": "Netflix"
  },
  {
    "week": 16,
    "date": "Fri 12/25",
    "away": "BUF",
    "home": "DEN",
    "time": "4:30p",
    "tv": "Netflix"
  },
  {
    "week": 16,
    "date": "Fri 12/25",
    "away": "LAR",
    "home": "SEA",
    "time": "8:15p",
    "tv": "FOX"
  },
  {
    "week": 16,
    "date": "Sat 12/26",
    "away": "TB",
    "home": "ATL",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 16,
    "date": "Sat 12/26",
    "away": "CIN",
    "home": "IND",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 16,
    "date": "Sat 12/26",
    "away": "WAS",
    "home": "MIN",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 16,
    "date": "Sat 12/26",
    "away": "CAR",
    "home": "PIT",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "CLE",
    "home": "BAL",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "LAC",
    "home": "MIA",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "ARI",
    "home": "NO",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "NE",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "TEN",
    "home": "LV",
    "time": "4:05p",
    "tv": "FOX"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "SF",
    "home": "KC",
    "time": "4:25p",
    "tv": "CBS"
  },
  {
    "week": 16,
    "date": "Sun 12/27",
    "away": "JAX",
    "home": "DAL",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 16,
    "date": "Mon 12/28",
    "away": "NYG",
    "home": "DET",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 17,
    "date": "Thu 12/31",
    "away": "BAL",
    "home": "CIN",
    "time": "8:15p",
    "tv": "Amazon"
  },
  {
    "week": 17,
    "date": "Sat 1/2",
    "away": "WAS",
    "home": "JAX",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 17,
    "date": "Sat 1/2",
    "away": "KC",
    "home": "LAC",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 17,
    "date": "Sat 1/2",
    "away": "DEN",
    "home": "NE",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 17,
    "date": "Sat 1/2",
    "away": "LAR",
    "home": "TB",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "NO",
    "home": "ATL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "SEA",
    "home": "CAR",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "IND",
    "home": "CLE",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "NYG",
    "home": "DAL",
    "time": "1:00p",
    "tv": "FOX"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "BUF",
    "home": "MIA",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "MIN",
    "home": "NYJ",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "PIT",
    "home": "TEN",
    "time": "1:00p",
    "tv": "CBS"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "LV",
    "home": "ARI",
    "time": "4:05p",
    "tv": "CBS"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "DET",
    "home": "CHI",
    "time": "4:25p",
    "tv": "FOX"
  },
  {
    "week": 17,
    "date": "Sun 1/3",
    "away": "PHI",
    "home": "SF",
    "time": "8:20p",
    "tv": "NBC"
  },
  {
    "week": 17,
    "date": "Mon 1/4",
    "away": "HOU",
    "home": "GB",
    "time": "8:15p",
    "tv": "ESPN"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "SF",
    "home": "ARI",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "PIT",
    "home": "BAL",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "NYJ",
    "home": "BUF",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "ATL",
    "home": "CAR",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "CLE",
    "home": "CIN",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "LAC",
    "home": "DEN",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "DET",
    "home": "GB",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "TEN",
    "home": "HOU",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "JAX",
    "home": "IND",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "LV",
    "home": "KC",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "SEA",
    "home": "LAR",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "CHI",
    "home": "MIN",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "MIA",
    "home": "NE",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "TB",
    "home": "NO",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "PHI",
    "home": "NYG",
    "time": "TBD",
    "tv": "TBD"
  },
  {
    "week": 18,
    "date": "Sun 1/10",
    "away": "DAL",
    "home": "WAS",
    "time": "TBD",
    "tv": "TBD"
  }
];

export function parseKickoffDate(dateStr?: string, timeStr?: string, season: number = 2026): string | undefined {
  if (!dateStr) return undefined;
  const match = dateStr.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d+)\/(\d+)/i);
  if (!match) return undefined;
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = (month === 1 || month === 2) ? season + 1 : season;

  let hour = 13;
  let min = 0;
  if (timeStr && timeStr !== 'TBD') {
    const tMatch = timeStr.match(/(\d+):(\d+)([ap])/i);
    if (tMatch) {
      hour = parseInt(tMatch[1], 10);
      min = parseInt(tMatch[2], 10);
      const ampm = tMatch[3].toLowerCase();
      if (ampm === 'p' && hour < 12) hour += 12;
      if (ampm === 'a' && hour === 12) hour = 0;
    }
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  const offset = (month >= 11 || month <= 2) ? '-05:00' : '-04:00';
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(min)}:00${offset}`;
}

export function isGameLocked(
  game?: { kickoff_at?: string; status?: string; date?: string; time?: string; game_date?: string; game_time?: string },
  now = new Date()
): boolean {
  if (!game) return false;
  if (game.status === 'final' || game.status === 'in_progress') return true;
  const dateStr = game.date || game.game_date;
  const timeStr = game.time || game.game_time;
  const kickoff = game.kickoff_at || parseKickoffDate(dateStr, timeStr);
  if (kickoff) {
    return new Date(kickoff).getTime() <= now.getTime();
  }
  return false;
}

export function getCurrentNFLWeek(now = new Date()): number {
  const cutoffs: { week: number; cutoff: string }[] = [
    { week: 1, cutoff: '2026-09-15T00:00:00-04:00' },
    { week: 2, cutoff: '2026-09-22T00:00:00-04:00' },
    { week: 3, cutoff: '2026-09-29T00:00:00-04:00' },
    { week: 4, cutoff: '2026-10-06T00:00:00-04:00' },
    { week: 5, cutoff: '2026-10-13T00:00:00-04:00' },
    { week: 6, cutoff: '2026-10-20T00:00:00-04:00' },
    { week: 7, cutoff: '2026-10-27T00:00:00-04:00' },
    { week: 8, cutoff: '2026-11-03T00:00:00-05:00' },
    { week: 9, cutoff: '2026-11-10T00:00:00-05:00' },
    { week: 10, cutoff: '2026-11-17T00:00:00-05:00' },
    { week: 11, cutoff: '2026-11-24T00:00:00-05:00' },
    { week: 12, cutoff: '2026-12-01T00:00:00-05:00' },
    { week: 13, cutoff: '2026-12-08T00:00:00-05:00' },
    { week: 14, cutoff: '2026-12-15T00:00:00-05:00' },
    { week: 15, cutoff: '2026-12-22T00:00:00-05:00' },
    { week: 16, cutoff: '2026-12-29T00:00:00-05:00' },
    { week: 17, cutoff: '2027-01-05T00:00:00-05:00' },
    { week: 18, cutoff: '2027-01-12T00:00:00-05:00' },
  ];

  const nowMs = now.getTime();
  let currentWeek = 1;
  for (const c of cutoffs) {
    if (nowMs >= new Date(c.cutoff).getTime()) {
      currentWeek = c.week + 1;
    }
  }
  return Math.min(18, Math.max(1, currentWeek));
}

export function generateOfficialGames(): Omit<NFLGame, 'home_team' | 'away_team'>[] {
  return DETAILED_OFFICIAL_GAMES.map((g, index) => {
    const kickoff_at = parseKickoffDate(g.date, g.time, 2026);
    return {
      id: `G${index + 1}`,
      week: g.week,
      season: 2026,
      home_team_id: g.home,
      away_team_id: g.away,
      status: g.status || 'scheduled',
      game_date: g.date,
      game_time: g.time,
      tv_network: g.tv,
      kickoff_at,
      home_score: g.home_score,
      away_score: g.away_score,
      winner_team_id: g.winner_team_id,
    };
  });
}

