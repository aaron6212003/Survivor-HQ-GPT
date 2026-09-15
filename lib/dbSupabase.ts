import { supabase } from './supabaseClient';
import { NFLTeam, NFLGame, SurvivorEntry, SurvivorPick, PoolSettings } from './types';
import { generateOfficialGames } from './nflScheduleData';

// Fetch 32 NFL Teams from Supabase (or fallback)
export async function getSupabaseTeams(): Promise<NFLTeam[]> {
  try {
    const { data, error } = await supabase
      .from('nfl_teams')
      .select('*')
      .order('name');
    
    if (error || !data || data.length === 0) {
      console.warn('Supabase teams fetch failed or empty, falling back to local dataset');
      return [];
    }
    return data as NFLTeam[];
  } catch (err) {
    console.error('Error fetching Supabase teams:', err);
    return [];
  }
}

// Fetch Weekly Games from Supabase (or fallback)
export async function getSupabaseGames(week: number): Promise<NFLGame[]> {
  try {
    const { data, error } = await supabase
      .from('nfl_games')
      .select('*')
      .eq('week', week);

    if (error || !data || data.length === 0) {
      return generateOfficialGames().filter((g) => g.week === week);
    }

    return data as NFLGame[];
  } catch (err) {
    return generateOfficialGames().filter((g) => g.week === week);
  }
}

// Save Pick to Supabase
export async function savePickToSupabase(entryId: string, week: number, teamId: string, status: string = 'pending') {
  try {
    const { data, error } = await supabase
      .from('picks')
      .upsert(
        {
          entry_id: entryId,
          week,
          team_id: teamId,
          status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'entry_id,week' }
      );

    if (error) {
      console.error('Supabase pick save error:', error);
    }
    return { success: !error, error };
  } catch (err) {
    console.error('Exception saving pick to Supabase:', err);
    return { success: false, error: err };
  }
}
