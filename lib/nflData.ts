import { NFLTeam, NFLGame } from './types';

export const INITIAL_TEAMS: NFLTeam[] = [
  // AFC East
  { id: 'BUF', code: 'BUF', name: 'Buffalo Bills', city: 'Buffalo', nickname: 'Bills', conference: 'AFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png', primary_color: '#00338D', secondary_color: '#C60C30', bye_week: 12, wins: 11, losses: 6, ties: 0 },
  { id: 'MIA', code: 'MIA', name: 'Miami Dolphins', city: 'Miami', nickname: 'Dolphins', conference: 'AFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png', primary_color: '#008E97', secondary_color: '#FC4C02', bye_week: 6, wins: 8, losses: 9, ties: 0 },
  { id: 'NE', code: 'NE', name: 'New England Patriots', city: 'New England', nickname: 'Patriots', conference: 'AFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png', primary_color: '#002244', secondary_color: '#C60C30', bye_week: 14, wins: 4, losses: 13, ties: 0 },
  { id: 'NYJ', code: 'NYJ', name: 'New York Jets', city: 'New York', nickname: 'Jets', conference: 'AFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png', primary_color: '#125740', secondary_color: '#FFFFFF', bye_week: 12, wins: 5, losses: 12, ties: 0 },

  // AFC North
  { id: 'BAL', code: 'BAL', name: 'Baltimore Ravens', city: 'Baltimore', nickname: 'Ravens', conference: 'AFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png', primary_color: '#241773', secondary_color: '#000000', bye_week: 14, wins: 12, losses: 5, ties: 0 },
  { id: 'CIN', code: 'CIN', name: 'Cincinnati Bengals', city: 'Cincinnati', nickname: 'Bengals', conference: 'AFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png', primary_color: '#FB4F14', secondary_color: '#000000', bye_week: 12, wins: 9, losses: 8, ties: 0 },
  { id: 'CLE', code: 'CLE', name: 'Cleveland Browns', city: 'Cleveland', nickname: 'Browns', conference: 'AFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png', primary_color: '#311D00', secondary_color: '#FF3C00', bye_week: 10, wins: 3, losses: 14, ties: 0 },
  { id: 'PIT', code: 'PIT', name: 'Pittsburgh Steelers', city: 'Pittsburgh', nickname: 'Steelers', conference: 'AFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png', primary_color: '#FFB612', secondary_color: '#101820', bye_week: 9, wins: 10, losses: 7, ties: 0 },

  // AFC South
  { id: 'HOU', code: 'HOU', name: 'Houston Texans', city: 'Houston', nickname: 'Texans', conference: 'AFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png', primary_color: '#03202F', secondary_color: '#A71930', bye_week: 14, wins: 10, losses: 7, ties: 0 },
  { id: 'IND', code: 'IND', name: 'Indianapolis Colts', city: 'Indianapolis', nickname: 'Colts', conference: 'AFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png', primary_color: '#002C5F', secondary_color: '#A2AAAD', bye_week: 14, wins: 8, losses: 9, ties: 0 },
  { id: 'JAX', code: 'JAX', name: 'Jacksonville Jaguars', city: 'Jacksonville', nickname: 'Jaguars', conference: 'AFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png', primary_color: '#006778', secondary_color: '#D7A22A', bye_week: 12, wins: 4, losses: 13, ties: 0 },
  { id: 'TEN', code: 'TEN', name: 'Tennessee Titans', city: 'Tennessee', nickname: 'Titans', conference: 'AFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png', primary_color: '#0C2340', secondary_color: '#4B92DB', bye_week: 5, wins: 3, losses: 14, ties: 0 },

  // AFC West
  { id: 'DEN', code: 'DEN', name: 'Denver Broncos', city: 'Denver', nickname: 'Broncos', conference: 'AFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png', primary_color: '#FB4F14', secondary_color: '#002244', bye_week: 14, wins: 0, losses: 1, ties: 0 },
  { id: 'KC', code: 'KC', name: 'Kansas City Chiefs', city: 'Kansas City', nickname: 'Chiefs', conference: 'AFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png', primary_color: '#E31837', secondary_color: '#FFB81C', bye_week: 6, wins: 1, losses: 0, ties: 0 },
  { id: 'LV', code: 'LV', name: 'Las Vegas Raiders', city: 'Las Vegas', nickname: 'Raiders', conference: 'AFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png', primary_color: '#000000', secondary_color: '#A5ACAF', bye_week: 10, wins: 4, losses: 13, ties: 0 },
  { id: 'LAC', code: 'LAC', name: 'Los Angeles Chargers', city: 'Los Angeles', nickname: 'Chargers', conference: 'AFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png', primary_color: '#0080C6', secondary_color: '#FFC20E', bye_week: 5, wins: 11, losses: 6, ties: 0 },

  // NFC East
  { id: 'DAL', code: 'DAL', name: 'Dallas Cowboys', city: 'Dallas', nickname: 'Cowboys', conference: 'NFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png', primary_color: '#003594', secondary_color: '#041E42', bye_week: 7, wins: 7, losses: 10, ties: 0 },
  { id: 'NYG', code: 'NYG', name: 'New York Giants', city: 'New York', nickname: 'Giants', conference: 'NFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png', primary_color: '#0B2265', secondary_color: '#A71930', bye_week: 11, wins: 3, losses: 14, ties: 0 },
  { id: 'PHI', code: 'PHI', name: 'Philadelphia Eagles', city: 'Philadelphia', nickname: 'Eagles', conference: 'NFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png', primary_color: '#004C54', secondary_color: '#A5ACAF', bye_week: 5, wins: 14, losses: 3, ties: 0 },
  { id: 'WAS', code: 'WAS', name: 'Washington Commanders', city: 'Washington', nickname: 'Commanders', conference: 'NFC', division: 'East', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/was.png', primary_color: '#5A1414', secondary_color: '#FFB612', bye_week: 14, wins: 12, losses: 5, ties: 0 },

  // NFC North
  { id: 'CHI', code: 'CHI', name: 'Chicago Bears', city: 'Chicago', nickname: 'Bears', conference: 'NFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png', primary_color: '#0B162A', secondary_color: '#C83803', bye_week: 7, wins: 5, losses: 12, ties: 0 },
  { id: 'DET', code: 'DET', name: 'Detroit Lions', city: 'Detroit', nickname: 'Lions', conference: 'NFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png', primary_color: '#0076B6', secondary_color: '#B0B7BC', bye_week: 5, wins: 15, losses: 2, ties: 0 },
  { id: 'GB', code: 'GB', name: 'Green Bay Packers', city: 'Green Bay', nickname: 'Packers', conference: 'NFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png', primary_color: '#203731', secondary_color: '#FFB612', bye_week: 10, wins: 11, losses: 6, ties: 0 },
  { id: 'MIN', code: 'MIN', name: 'Minnesota Vikings', city: 'Minnesota', nickname: 'Vikings', conference: 'NFC', division: 'North', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png', primary_color: '#4F2683', secondary_color: '#FFC62F', bye_week: 6, wins: 14, losses: 3, ties: 0 },

  // NFC South
  { id: 'ATL', code: 'ATL', name: 'Atlanta Falcons', city: 'Atlanta', nickname: 'Falcons', conference: 'NFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png', primary_color: '#A71930', secondary_color: '#000000', bye_week: 12, wins: 8, losses: 9, ties: 0 },
  { id: 'CAR', code: 'CAR', name: 'Carolina Panthers', city: 'Carolina', nickname: 'Panthers', conference: 'NFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png', primary_color: '#0085CA', secondary_color: '#101820', bye_week: 11, wins: 5, losses: 12, ties: 0 },
  { id: 'NO', code: 'NO', name: 'New Orleans Saints', city: 'New Orleans', nickname: 'Saints', conference: 'NFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png', primary_color: '#D3BC8D', secondary_color: '#101820', bye_week: 12, wins: 5, losses: 12, ties: 0 },
  { id: 'TB', code: 'TB', name: 'Tampa Bay Buccaneers', city: 'Tampa Bay', nickname: 'Buccaneers', conference: 'NFC', division: 'South', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png', primary_color: '#D50A0A', secondary_color: '#FF7900', bye_week: 11, wins: 10, losses: 7, ties: 0 },

  // NFC West
  { id: 'ARI', code: 'ARI', name: 'Arizona Cardinals', city: 'Arizona', nickname: 'Cardinals', conference: 'NFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png', primary_color: '#97233F', secondary_color: '#000000', bye_week: 11, wins: 8, losses: 9, ties: 0 },
  { id: 'LAR', code: 'LAR', name: 'Los Angeles Rams', city: 'Los Angeles', nickname: 'Rams', conference: 'NFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png', primary_color: '#003594', secondary_color: '#FFA300', bye_week: 6, wins: 10, losses: 7, ties: 0 },
  { id: 'SF', code: 'SF', name: 'San Francisco 49ers', city: 'San Francisco', nickname: '49ers', conference: 'NFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png', primary_color: '#AA0000', secondary_color: '#B3995D', bye_week: 9, wins: 6, losses: 11, ties: 0 },
  { id: 'SEA', code: 'SEA', name: 'Seattle Seahawks', city: 'Seattle', nickname: 'Seahawks', conference: 'NFC', division: 'West', logo_url: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', primary_color: '#002244', secondary_color: '#69BE28', bye_week: 10, wins: 10, losses: 7, ties: 0 },
];

// Helper to generate full 18-week regular season schedule
export function generateSchedule(): Omit<NFLGame, 'home_team' | 'away_team'>[] {
  const games: Omit<NFLGame, 'home_team' | 'away_team'>[] = [];
  let gameId = 1;

  // Realistic pairings across 18 weeks
  const matchupsPerWeek: { [week: number]: [string, string, string, number, number][] } = {
    1: [
      ['KC', 'BAL', '2026-09-08T20:20:00Z', 27, 20],
      ['PHI', 'GB', '2026-09-09T20:15:00Z', 34, 29],
      ['BUF', 'ARI', '2026-09-11T13:00:00Z', 34, 28],
      ['CHI', 'TEN', '2026-09-11T13:00:00Z', 24, 17],
      ['CIN', 'NE', '2026-09-11T13:00:00Z', 10, 16],
      ['IND', 'HOU', '2026-09-11T13:00:00Z', 27, 29],
      ['MIA', 'JAX', '2026-09-11T13:00:00Z', 20, 17],
      ['NO', 'CAR', '2026-09-11T13:00:00Z', 47, 10],
      ['NYG', 'MIN', '2026-09-11T13:00:00Z', 6, 28],
      ['ATL', 'PIT', '2026-09-11T13:00:00Z', 10, 18],
      ['LAC', 'LV', '2026-09-11T16:05:00Z', 22, 10],
      ['SEA', 'DEN', '2026-09-11T16:05:00Z', 26, 20],
      ['TB', 'WAS', '2026-09-11T16:25:00Z', 37, 20],
      ['CLE', 'DAL', '2026-09-11T16:25:00Z', 17, 33],
      ['DET', 'LAR', '2026-09-11T20:20:00Z', 26, 20],
      ['SF', 'NYJ', '2026-09-12T20:15:00Z', 32, 19],
    ],
    2: [
      ['MIA', 'BUF', '2026-09-15T20:15:00Z', 10, 31],
      ['BAL', 'LV', '2026-09-18T13:00:00Z', 23, 26],
      ['CAR', 'LAC', '2026-09-18T13:00:00Z', 3, 26],
      ['DAL', 'NO', '2026-09-18T13:00:00Z', 19, 44],
      ['GB', 'IND', '2026-09-18T13:00:00Z', 16, 10],
      ['JAX', 'CLE', '2026-09-18T13:00:00Z', 13, 18],
      ['MIN', 'SF', '2026-09-18T13:00:00Z', 23, 17],
      ['NE', 'SEA', '2026-09-18T13:00:00Z', 20, 23],
      ['TEN', 'NYJ', '2026-09-18T13:00:00Z', 17, 24],
      ['WAS', 'NYG', '2026-09-18T13:00:00Z', 21, 18],
      ['ARI', 'LAR', '2026-09-18T16:05:00Z', 41, 10],
      ['DEN', 'PIT', '2026-09-18T16:25:00Z', 6, 13],
      ['KC', 'CIN', '2026-09-18T16:25:00Z', 26, 25],
      ['HOU', 'CHI', '2026-09-18T20:20:00Z', 19, 13],
      ['PHI', 'ATL', '2026-09-19T20:15:00Z', 21, 22],
      ['DET', 'TB', '2026-09-18T13:00:00Z', 16, 20],
    ],
    3: [
      ['NYJ', 'NE', '2026-09-22T20:15:00Z', 24, 3],
      ['CLE', 'NYG', '2026-09-25T13:00:00Z', 15, 21],
      ['IND', 'CHI', '2026-09-25T13:00:00Z', 21, 16],
      ['MIN', 'HOU', '2026-09-25T13:00:00Z', 34, 7],
      ['NO', 'PHI', '2026-09-25T13:00:00Z', 12, 15],
      ['PIT', 'LAC', '2026-09-25T13:00:00Z', 20, 10],
      ['TB', 'DEN', '2026-09-25T13:00:00Z', 7, 26],
      ['TEN', 'GB', '2026-09-25T13:00:00Z', 14, 30],
      ['LV', 'CAR', '2026-09-25T16:05:00Z', 22, 36],
      ['SEA', 'MIA', '2026-09-25T16:05:00Z', 24, 3],
      ['ARI', 'DET', '2026-09-25T16:25:00Z', 13, 20],
      ['DAL', 'BAL', '2026-09-25T16:25:00Z', 25, 28],
      ['SF', 'LAR', '2026-09-25T16:25:00Z', 24, 27],
      ['ATL', 'KC', '2026-09-25T20:20:00Z', 17, 22],
      ['BUF', 'JAX', '2026-09-26T19:30:00Z', 47, 10],
      ['CIN', 'WAS', '2026-09-26T20:15:00Z', 33, 38],
    ],
    4: [
      ['NYG', 'DAL', '2026-09-29T20:15:00Z', 15, 20],
      ['ATL', 'NO', '2026-10-02T13:00:00Z', 26, 24],
      ['CHI', 'LAR', '2026-10-02T13:00:00Z', 24, 18],
      ['GB', 'MIN', '2026-10-02T13:00:00Z', 29, 31],
      ['IND', 'PIT', '2026-10-02T13:00:00Z', 27, 24],
      ['NYJ', 'DEN', '2026-10-02T13:00:00Z', 9, 10],
      ['TB', 'PHI', '2026-10-02T13:00:00Z', 33, 16],
      ['CAR', 'CIN', '2026-10-02T13:00:00Z', 24, 34],
      ['HOU', 'JAX', '2026-10-02T13:00:00Z', 24, 20],
      ['ARI', 'WAS', '2026-10-02T16:05:00Z', 14, 42],
      ['SF', 'NE', '2026-10-02T16:05:00Z', 30, 13],
      ['LV', 'CLE', '2026-10-02T16:25:00Z', 20, 16],
      ['BAL', 'BUF', '2026-10-02T20:20:00Z', 35, 10],
      ['MIA', 'TEN', '2026-10-03T19:30:00Z', 12, 31],
      ['DET', 'SEA', '2026-10-03T20:15:00Z', 42, 29],
      ['KC', 'LAC', '2026-10-02T16:25:00Z', 17, 10],
    ],
  };

  // Populate weeks 1-4 with actual results, and generate upcoming weeks 5-18
  for (let w = 1; w <= 18; w++) {
    if (matchupsPerWeek[w]) {
      for (const [home, away, time, hScore, aScore] of matchupsPerWeek[w]) {
        let winner: string | undefined = undefined;
        if (hScore > aScore) winner = home;
        else if (aScore > hScore) winner = away;

        games.push({
          id: `G${gameId++}`,
          week: w,
          season: 2026,
          home_team_id: home,
          away_team_id: away,
          status: 'final',
          home_score: hScore,
          away_score: aScore,
          winner_team_id: winner,
        });
      }
    } else {
      // Standard schedule generator for weeks 5-18
      const weekTeams = [...INITIAL_TEAMS.map((t) => t.id)];

      // Pair up 16 games per week (or 14 if byes)
      for (let i = 0; i < weekTeams.length; i += 2) {
        const home = weekTeams[i];
        const away = weekTeams[i + 1];

        // Check if either is on bye week
        const homeObj = INITIAL_TEAMS.find((t) => t.id === home);
        const awayObj = INITIAL_TEAMS.find((t) => t.id === away);

        if (homeObj?.bye_week === w || awayObj?.bye_week === w) {
          continue; // team is on bye
        }

        games.push({
          id: `G${gameId++}`,
          week: w,
          season: 2026,
          home_team_id: home,
          away_team_id: away,
          status: 'scheduled',
        });
      }
    }
  }

  return games;
}
