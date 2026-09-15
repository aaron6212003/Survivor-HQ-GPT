let metaCache;
const base='https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
async function fetchJson(url) {
 const res=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!res.ok) throw new Error('ESPN is temporarily unavailable.');
 return res.json();
}
export async function currentNfl() {
 if(metaCache&&Date.now()-metaCache.at<60000) return metaCache.value;
 try {
  const data=await fetchJson(base);
  const season=Number(data.season?.year); const week=Number(data.week?.number);
  if(!Number.isInteger(season)||!Number.isInteger(week)) throw new Error('ESPN did not provide the current NFL week.');
  const value={season,week:data.season?.type===3?18:data.season?.type===1?1:Math.min(18,Math.max(1,week)),seasonType:data.season?.type};
  metaCache={at:Date.now(),value};return value;
 } catch(error) {
  if(metaCache) return {...metaCache.value,warning:'Current NFL week could not refresh.'};
  throw error;
 }
}
const team=c=>({id:String(c.team.id),code:c.team.abbreviation,name:c.team.displayName,logo:c.team.logo,record:c.records?.find(r=>r.type==='total')?.summary||''});
export async function nflWeek(client,season,week) {
 const {data:cached,error:readError}=await client.from('hq_nfl_weeks').select('*').eq('season',season).eq('week',week).maybeSingle();
 if(readError) throw new Error('NFL schedule storage is not configured.');
 if(cached&&Date.now()-Date.parse(cached.updated_at)<60000) return {...cached,stale:false};
 const fetchedAt=new Date().toISOString();
 try {
  const data=await fetchJson(`${base}?dates=${season}&seasontype=2&week=${week}`);
  if(Number(data.season?.year)!==season||Number(data.week?.number)!==week||Number(data.season?.type)!==2||!Array.isArray(data.events)) throw new Error('ESPN returned a different season or week.');
  const games=data.events.map(event=>{
   const home=event.competitions?.[0]?.competitors?.find(c=>c.homeAway==='home');
   const away=event.competitions?.[0]?.competitors?.find(c=>c.homeAway==='away');
   if(!home||!away||!event.id||!Number.isFinite(Date.parse(event.date))) throw new Error('ESPN returned an incomplete matchup.');
   const type=event.status?.type||{};
   const status=type.name==='STATUS_CANCELED'?'canceled':type.name==='STATUS_POSTPONED'?'postponed':type.completed?'final':type.state==='in'?'live':'scheduled';
   const homeScore=Number(home.score);const awayScore=Number(away.score);
   if(status==='final'&&(!Number.isFinite(homeScore)||!Number.isFinite(awayScore))) throw new Error('A final score is incomplete.');
   return {id:String(event.id),season,week,kickoff:event.date,home:team(home),away:team(away),homeScore:Number.isFinite(homeScore)?homeScore:0,awayScore:Number.isFinite(awayScore)?awayScore:0,status,detail:type.detail||type.description||'',winner:status==='final'&&homeScore!==awayScore?String(homeScore>awayScore?home.team.id:away.team.id):null};
  }).sort((a,b)=>Date.parse(a.kickoff)-Date.parse(b.kickoff));
  if(!games.length) throw new Error('ESPN has not published games for this week.');
  const row={season,week,games,updated_at:fetchedAt};
  const saved=cached?await client.from('hq_nfl_weeks').update(row).eq('season',season).eq('week',week).lt('updated_at',fetchedAt):await client.from('hq_nfl_weeks').insert(row);
  if(saved.error&&saved.error.code!=='23505') throw new Error('The NFL schedule could not be saved.');
  return {...row,stale:false};
 } catch(error) {
  if(cached) return {...cached,stale:true,warning:'ESPN could not refresh. Showing the last saved schedule; new picks are paused until it reconnects.'};
  return {season,week,games:[],updated_at:null,stale:true,warning:error instanceof Error?error.message:'NFL schedule unavailable.'};
 }
}
export function activeWeek(league,meta) {return Math.max(league.startWeek,league.season<meta.season?18:league.season>meta.season?league.startWeek:meta.week);}
export async function leagueSchedules(client,league,meta,selectedWeek) {
 const active=activeWeek(league,meta);const weeks=[...new Set([...Array(active-league.startWeek+1)].map((_,i)=>league.startWeek+i).concat(selectedWeek))];
 const snapshots=[];
 for(let i=0;i<weeks.length;i+=4) snapshots.push(...await Promise.all(weeks.slice(i,i+4).map(w=>nflWeek(client,league.season,w))));
 return {active,schedules:Object.fromEntries(snapshots.map(s=>[s.week,s.games])),snapshots};
}
