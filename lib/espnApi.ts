import { NFLGame, NFLTeam } from './types';
import { generateOfficialGames } from './nflScheduleData';

// Map ESPN abbreviation to Survivor HQ team code (UPPERCASE)
export function mapEspnAbbrToTeamId(abbr: string): string {
  if (!abbr) return '';
  const clean = abbr.trim().toUpperCase();
  switch (clean) {
    case 'WSH':
    case 'WAS':
      return 'WAS';
    case 'LAR':
    case 'LA':
      return 'LAR';
    case 'LVR':
    case 'LV':
      return 'LV';
    default:
      return clean;
  }
}

export interface EspnGameResult {
  espnId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  homeRecord?: string;
  awayRecord?: string;
  statusState: 'pre' | 'in' | 'post';
  statusDetail: string;
  clockDisplay?: string;
  period?: number;
  isCompleted: boolean;
  winnerTeamId?: string;
  tvNetwork?: string;
}

export async function fetchEspnLiveScoreboard(week: number = 1): Promise<EspnGameResult[]> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}&seasontype=2`;
    const res = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      console.warn(`ESPN API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.events || !Array.isArray(data.events)) {
      return [];
    }

    const results: EspnGameResult[] = [];

    for (const event of data.events) {
      const competition = event.competitions?.[0];
      if (!competition || !competition.competitors) continue;

      const homeComp = competition.competitors.find((c: any) => c.homeAway === 'home');
      const awayComp = competition.competitors.find((c: any) => c.homeAway === 'away');

      if (!homeComp || !awayComp) continue;

      const homeTeamId = mapEspnAbbrToTeamId(homeComp.team?.abbreviation);
      const awayTeamId = mapEspnAbbrToTeamId(awayComp.team?.abbreviation);

      const homeScore = homeComp.score !== undefined ? parseInt(homeComp.score, 10) : undefined;
      const awayScore = awayComp.score !== undefined ? parseInt(awayComp.score, 10) : undefined;

      const homeRecord = homeComp.records?.[0]?.summary || '';
      const awayRecord = awayComp.records?.[0]?.summary || '';

      const isCompleted = event.status?.type?.completed === true || event.status?.type?.state === 'post';
      let winnerTeamId: string | undefined = undefined;

      if (homeComp.winner) {
        winnerTeamId = homeTeamId;
      } else if (awayComp.winner) {
        winnerTeamId = awayTeamId;
      } else if (isCompleted && homeScore !== undefined && awayScore !== undefined) {
        if (homeScore > awayScore) winnerTeamId = homeTeamId;
        else if (awayScore > homeScore) winnerTeamId = awayTeamId;
      }

      const broadcasts = competition.broadcasts?.[0]?.names;
      const tvNetwork = broadcasts && broadcasts.length > 0 ? broadcasts[0] : 'NFL Net';
      const statusDetail = event.status?.type?.detail || event.status?.type?.shortDetail || (isCompleted ? 'Final' : 'Scheduled');
      const clockDisplay = event.status?.displayClock || '0:00';
      const period = event.status?.period || 0;

      results.push({
        espnId: event.id,
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        homeRecord,
        awayRecord,
        statusState: event.status?.type?.state || (isCompleted ? 'post' : 'pre'),
        statusDetail,
        clockDisplay,
        period,
        isCompleted,
        winnerTeamId,
        tvNetwork,
      });
    }

    return results;
  } catch (err) {
    console.error('Error fetching ESPN Live Scoreboard:', err);
    return [];
  }
}

// Merge live ESPN scores into base official schedule
export async function getLiveMergedSchedule(week: number): Promise<NFLGame[]> {
  const baseGames = generateOfficialGames().filter((g) => g.week === week);
  const liveEspnData = await fetchEspnLiveScoreboard(week);

  if (liveEspnData.length === 0) {
    return baseGames;
  }

  const espnMap = new Map<string, EspnGameResult>();
  for (const espn of liveEspnData) {
    espnMap.set(`${espn.homeTeamId}_${espn.awayTeamId}`, espn);
    espnMap.set(`${espn.awayTeamId}_${espn.homeTeamId}`, espn);
  }

  return baseGames.map((game) => {
    const homeCode = game.home_team_id.toUpperCase();
    const awayCode = game.away_team_id.toUpperCase();
    const liveMatch = espnMap.get(`${homeCode}_${awayCode}`);
    if (!liveMatch) return game;

    let finalStatus: 'scheduled' | 'in_progress' | 'final' = game.status;
    if (liveMatch.isCompleted) {
      finalStatus = 'final';
    } else if (liveMatch.statusState === 'in') {
      finalStatus = 'in_progress';
    }

    return {
      ...game,
      home_score: liveMatch.homeScore ?? game.home_score,
      away_score: liveMatch.awayScore ?? game.away_score,
      status: finalStatus,
      status_detail: liveMatch.statusDetail || (finalStatus === 'final' ? 'Final' : game.status_detail),
      clock_display: liveMatch.clockDisplay || game.clock_display,
      period: liveMatch.period || game.period,
      home_record: liveMatch.homeRecord || game.home_record,
      away_record: liveMatch.awayRecord || game.away_record,
      winner_team_id: liveMatch.winnerTeamId ?? game.winner_team_id,
      tv_network: liveMatch.tvNetwork || game.tv_network,
    };
  });
}
