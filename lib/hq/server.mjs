import { createClient } from '@supabase/supabase-js';
import {avatars,label,integer,settings,fail,createLeague,addEntry,savePicks,viewLeague} from './rules.mjs';
import {currentNfl,nflWeek,leagueSchedules,activeWeek} from './espn.mjs';
export function adminClient() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) fail('The app’s database connection is not configured.');
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export async function profileFor(client,user) {
 const {data,error}=await client.from('hq_profiles').select('*').eq('user_id',user.id).maybeSingle();
 if(error) fail('Profile storage is unavailable.');
 if(data) return data;
 const name=String(user.user_metadata?.full_name||'NFL Fan').trim().slice(0,40);
 const row={user_id:user.id,display_name:name.length>=2?name:'NFL Fan',avatar:'🏈'};
 const saved=await client.from('hq_profiles').upsert(row,{onConflict:'user_id',ignoreDuplicates:true});
 if(saved.error) fail('Your profile could not be created.');
 return (await client.from('hq_profiles').select('*').eq('user_id',user.id).single()).data||row;
}
async function memberLeagues(client,user) {
 const {data,error}=await client.from('hq_leagues').select('id,code,state').contains('member_ids',[user.id]).order('created_at',{ascending:false});
 if(error) fail('Your leagues could not be loaded.');
 return data||[];
}
function summary(row,user,meta) {
 const s=row.state;return {id:row.id,code:row.code,name:s.name,season:s.season,format:s.config.format,memberCount:s.members.length,entryCount:s.entries.filter(e=>e.userId===user.id).length,owner:s.ownerId===user.id,activeWeek:activeWeek(s,meta),archived:s.archived};
}
async function publicView(client,league,user,meta,week) {
 const loaded=await leagueSchedules(client,league,meta,week);
 const profiles=await client.from('hq_profiles').select('user_id,display_name,avatar').in('user_id',league.members.map(m=>m.userId));
 if(profiles.error) fail('Member profiles could not be loaded.');
 const map=Object.fromEntries((profiles.data||[]).map(p=>[p.user_id,p]));
 return {...viewLeague(league,user,loaded.schedules,loaded.active,week,map),updatedAt:loaded.snapshots.find(s=>s.week===week)?.updated_at,warnings:[...new Set(loaded.snapshots.filter(s=>s.warning).map(s=>`Week ${s.week}: ${s.warning}`))],feedStale:loaded.snapshots.some(s=>s.stale),meta};
}
export async function hqAction(client,user,input) {
 const action=input.action||'bootstrap';const profile=await profileFor(client,user);
 if(action==='profile') {
  if(!avatars.includes(input.avatar)) fail('Choose an available avatar.');
  const row={user_id:user.id,display_name:label(input.displayName,'Display name',40),avatar:input.avatar,updated_at:new Date().toISOString()};
  const result=await client.from('hq_profiles').upsert(row);
  if(result.error) fail('Your profile could not be saved.');return {profile:row};
 }
 let meta;
 try {meta=await currentNfl();} catch(error) {
  if(action==='bootstrap')return {profile,user:{id:user.id,email:user.email},meta:null,leagues:(await memberLeagues(client,user)).map(r=>({...summary(r,user,{season:r.state.season,week:r.state.startWeek}),activeWeek:null})),warning:'ESPN is unavailable. Your account and saved leagues are still accessible.'};
  throw error;
 }
 if(action==='bootstrap') return {profile,user:{id:user.id,email:user.email},meta,leagues:(await memberLeagues(client,user)).map(l=>summary(l,user,meta))};
 if(action==='schedule') return {...await nflWeek(client,integer(input.season,2025,2030,'Season'),integer(input.week,1,18,'Week')),meta};
 if(action==='create') {
  for(let attempt=0;attempt<5;attempt++) {
   const league=createLeague(input,user,profile);
   if(league.season!==meta.season) fail('Create your league for the current NFL season. Use season rollover for future seasons.');
   if(league.startWeek<meta.week) fail('Choose this week or a future week for a new league.');
   const opening=await nflWeek(client,league.season,league.startWeek);
   if(opening.stale||!opening.games.length) fail('A verified schedule is required before opening this league.');
   if(opening.games.some(g=>g.status!=='scheduled'||Date.parse(g.kickoff)<=Date.now())) fail('Games have started in this week. Start the league next week so everyone has the same opportunity.');
   const result=await client.from('hq_leagues').insert({id:league.id,code:league.code,member_ids:[user.id],state:league,revision:1});
   if(!result.error) return {league:await publicView(client,league,user,meta,league.startWeek)};
   if(result.error.code!=='23505') fail('The league could not be created.');
  } fail('Could not allocate an invite code. Please retry.');
 }
 if(action==='deleteAccount') {
  if(input.confirmation!=='DELETE MY ACCOUNT') fail('Type DELETE MY ACCOUNT to confirm.');
  const leagues=await memberLeagues(client,user);
  if(leagues.some(r=>r.state.ownerId===user.id&&r.state.members.length>1)) fail('Transfer commissioner ownership in your leagues before deleting your account.');
  for(const row of leagues) {
   let done=false;
   for(let i=0;i<5;i++) {
    const fresh=await client.from('hq_leagues').select('*').eq('id',row.id).single();if(fresh.error) fail('Could not update league membership. Account has not been deleted.');
    const s=fresh.data.state;
    if(s.ownerId===user.id&&s.members.length>1) fail('Transfer commissioner ownership before deleting your account.');
    s.members=s.members.filter(m=>m.userId!==user.id);s.entries=s.entries.map(e=>e.userId===user.id?{...e,userId:null,name:'Deleted player'}:e);
    for(const a of s.archives||[]) {a.members=(a.members||[]).filter(m=>m.userId!==user.id);a.entries=(a.entries||[]).map(e=>e.userId===user.id?{...e,userId:null,name:'Deleted player'}:e);}
    if(s.ownerId===user.id) {s.ownerId=null;s.archived=true;}
    s.audit=s.audit.map(a=>a.actor===user.id?{...a,actor:null}:a);
    const write=await client.from('hq_leagues').update({state:s,member_ids:s.members.map(m=>m.userId),revision:fresh.data.revision+1}).eq('id',row.id).eq('revision',fresh.data.revision).select('id').maybeSingle();
    if(write.error) fail('Could not update league membership. Account has not been deleted.');if(write.data){done=true;break;}
   } if(!done) fail('League membership changed. Retry account deletion.');
  }
  const deleted=await client.auth.admin.deleteUser(user.id);if(deleted.error) fail('Account deletion could not finish. Please retry.');return {deleted:true};
 }
 for(let attempt=0;attempt<5;attempt++) {
  let query=client.from('hq_leagues').select('*');
  if(action==='join') query=query.eq('code',String(input.code||'').trim().toUpperCase());else query=query.eq('id',String(input.leagueId||''));
  const {data:row,error}=await query.maybeSingle();if(error||!row) fail('League not found. Check your invite code or league link.');
  const league=structuredClone(row.state);
  if(league.archived) fail('This league is archived.');
  if(action!=='join'&&!league.members.some(m=>m.userId===user.id)) fail('Join this league before viewing it.');
  const week=integer(input.week??activeWeek(league,meta),1,18,'Week');
  if(action==='view') return {league:await publicView(client,league,user,meta,week)};
  if(action==='archive') {
   const archive=league.archives[integer(input.index,0,league.archives.length-1,'Archive')];
   const safe={...archive,picks:archive.picks.filter(p=>archive.entries.some(e=>e.id===p.entryId&&e.userId===user.id))};
   return {archive:safe};
  }
  if(['settings','deadline','reset','rollover','transfer','backfill'].includes(action)&&league.ownerId!==user.id) fail('Only the commissioner can change league settings.');
  const loaded=await leagueSchedules(client,league,meta,week);
  const opening=await nflWeek(client,league.season,league.startWeek);
  const started=opening.stale||opening.games.some(g=>g.status!=='scheduled'||Date.parse(g.kickoff)<=Date.now());
  if(action==='join') {
   if(league.members.some(m=>m.userId===user.id)) return {league:await publicView(client,league,user,meta,week)};
   if(started) fail('This league has started and is closed to new members.');
   if(league.members.length>=100) fail('This league has reached its member limit.');
   league.members.push({userId:user.id,name:profile.display_name});addEntry(league,user,{name:profile.display_name});
  } else if(action==='entry') {
   if(started) fail('Add entries before the league’s first kickoff.');addEntry(league,user,input);
  } else if(action==='renameEntry') {
   const entry=league.entries.find(e=>e.id===input.entryId&&e.userId===user.id);if(!entry) fail('Choose one of your entries.');entry.name=label(input.name,'Entry name',40);
  } else if(action==='savePicks') {
   if(loaded.snapshots.some(s=>s.stale)) fail('The NFL feed is unavailable. Picks will reopen when the schedule is verified.');
   savePicks(league,input,user,loaded.schedules,loaded.active);
  } else if(action==='backfill') {
   if(league.config.format!=='survivor') fail('Historical backfill is only available for Survivor leagues.');
   if(input.confirmation!==league.name) fail('Type the league name exactly to confirm.');
   league.picks=league.picks.filter(p=>p.week!==Math.max(1,league.startWeek-1));
   const historicalWeek=Math.max(1,league.startWeek-1); const historical=await nflWeek(client,league.season,historicalWeek); if(historical.stale||!historical.games.length) fail('The historical NFL schedule is unavailable.');
   const games=historical.games; const codes=['JAX','JAX','LAC','LAC','DET','LV','PHI','PIT'];
   const mine=league.entries.filter(e=>e.userId===user.id).sort((a,b)=>a.entryNumber-b.entryNumber);
   for(let i=mine.length;i<8;i++) addEntry(league,user,{name:`Life ${i+1}`});
   const entries=league.entries.filter(e=>e.userId===user.id).sort((a,b)=>a.entryNumber-b.entryNumber);
   entries.forEach((e,i)=>{e.name=`Life ${i+1}`;});
   for(let i=0;i<codes.length;i++) {
    const entry=entries[i];
    if(!entry) fail(`Entry ${i+1} is missing. Add all eight entries before backfilling.`);
    const game=games.find(g=>g.home.code===codes[i]||g.away.code===codes[i]);
    if(!game) fail(`ESPN does not have a Week ${league.startWeek} game for ${codes[i]}.`);
    const teamId=game.home.code===codes[i]?game.home.id:game.away.id;
    league.picks.push({entryId:entry.id,week:historicalWeek,gameId:game.id,teamId,confidence:1,updatedAt:new Date().toISOString()});
   }
   league.startWeek=historicalWeek;
   league.audit.push({action:'backfill',actor:user.id,at:new Date().toISOString()});
  } else if(action==='settings') {
   const config=settings(input);
   if(config.format!==league.config.format) fail('A league’s format is fixed. Create another league for a different format.');
   if((started||league.picks.length)&&JSON.stringify({...config,buyIn:0})!==JSON.stringify({...league.config,buyIn:0})) fail('Competition rules are fixed once picks are submitted or the league starts.');
   if(league.members.some(m=>league.entries.filter(e=>e.userId===m.userId).length>config.maxEntries)) fail('The entry limit cannot be lower than a member’s current entries.');
   league.name=label(input.name,'League name');league.config=config;
  } else if(action==='deadline') {
   if(week!==loaded.active||league.picks.some(p=>p.week===week)) fail('Set the active week’s deadline before anyone submits picks.');
   const date=Date.parse(input.deadline);const games=loaded.schedules[week];
   if(!Number.isFinite(date)||date<=Date.now()||!games.length||date>Math.min(...games.map(g=>Date.parse(g.kickoff)))) fail('Choose a future deadline no later than this week’s first kickoff.');
   league.deadlines[week]=new Date(date).toISOString();
  } else if(action==='transfer') {
   if(!league.members.some(m=>m.userId===input.userId)) fail('Choose an existing league member.');league.ownerId=input.userId;
  } else if(action==='reset'||action==='rollover') {
   if(input.confirmation!==league.name) fail('Type the league name exactly to confirm.');
   const season=action==='rollover'?integer(input.season,league.season+1,2030,'New season'):league.season;
   const startWeek=integer(input.startWeek,1,18,'Starting week');
   if(season<meta.season||(season===meta.season&&startWeek<meta.week)) fail('Choose the current or a future NFL week.');
   const schedule=await nflWeek(client,season,startWeek);
   if(schedule.stale||!schedule.games.length||schedule.games.some(g=>g.status!=='scheduled'||Date.parse(g.kickoff)<=Date.now())) fail('Choose an unstarted week with a verified schedule.');
   league.archives.push({reason:action,at:new Date().toISOString(),season:league.season,startWeek:league.startWeek,picks:league.picks,entries:league.entries,members:league.members,config:league.config});
   league.picks=[];league.deadlines={};league.season=season;league.startWeek=startWeek;
  } else fail('Unknown league action.');
  league.audit.push({action,actor:user.id,at:new Date().toISOString()});
  const write=await client.from('hq_leagues').update({state:league,member_ids:league.members.map(m=>m.userId),revision:row.revision+1}).eq('id',league.id).eq('revision',row.revision).select('id').maybeSingle();
  if(write.error) fail('Your change could not be saved.');
  if(write.data) return {league:await publicView(client,league,user,meta,action==='reset'||action==='rollover'?league.startWeek:week)};
 }
 fail('The league changed while saving. Please retry.');
}
