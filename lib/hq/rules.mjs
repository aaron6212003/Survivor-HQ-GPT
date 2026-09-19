import { randomBytes, randomUUID } from 'node:crypto';
export const avatars = ['🏈','🛡️','🏆','⚡','🎯','🦅','🐅','⭐'];
export function fail(message) { throw new Error(message); }
export function label(value, field='Name', max=60) {
 if(typeof value!=='string'||value.trim().length<2||value.trim().length>max) fail(`${field} must contain 2–${max} characters.`);
 return value.trim();
}
export function integer(value,min,max,field) {
 if(!Number.isInteger(value)||value<min||value>max) fail(`${field} must be between ${min} and ${max}.`); return value;
}
export function settings(input) {
 if(!['survivor','pickem'].includes(input.format)) fail('Choose Survivor or Straight Pick’em.');
 const maxEntries=input.format==='survivor'?integer(input.maxEntries,1,100,'Maximum lives per member'):1;
 return {format:input.format,maxEntries,deadlineMode:input.format==='pickem'?'first-game':'per-game',tiebreaker:input.format==='pickem'?'monday-total':'shared',tiesLose:input.format==='survivor' ? input.tiesLose!==false : true};
}
export function normalizeLeagueConfig(league) {
 if(!league?.config) return league;
 // Lock behavior is format-specific and is repaired for older saved leagues on every load.
 league.config.deadlineMode=league.config.format==='pickem'?'first-game':'per-game';
 return league;
}
export function createLeague(input,user,profile) {
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 const code=[...randomBytes(6)].map(b=>alphabet[b%alphabet.length]).join('');
 const league={id:randomUUID(),code,name:label(input.name,'League name'),season:integer(input.season,2025,2030,'Season'),startWeek:integer(input.startWeek,1,18,'Starting week'),ownerId:user.id,coOwnerIds:[],coOwnerOf:{},config:settings(input),members:[{userId:user.id,name:profile.display_name}],entries:[],picks:[],deadlines:{},archives:[],audit:[],archived:false};
 if(league.config.format==='pickem') addEntry(league,user,{name:profile.display_name});
 return league;
}
export function addEntry(league,user,input) {
 if(league.entries.filter(e=>e.userId===user.id).length>=league.config.maxEntries) fail('You have reached this league’s entry limit.');
 const name=label(input.name,'Entry name',40);
 if(league.entries.some(e=>e.userId===user.id&&e.name.toLowerCase()===name.toLowerCase()))fail('You already have an entry with that name.');
 const entry={id:randomUUID(),userId:user.id,name,entryNumber:league.config.format==='survivor'?league.entries.filter(e=>e.userId===user.id).length+1:1};
 league.entries.push(entry);return entry;
}
export function liveGames(games) { return games.filter(g=>g.status!=='canceled'); }
export function mondayNightGame(games=[]) {
 const weekday=new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'America/New_York'});
 return [...games].filter(game=>weekday.format(new Date(game.kickoff))==='Mon').sort((a,b)=>Date.parse(b.kickoff)-Date.parse(a.kickoff))[0]||null;
}
function tiebreakerKey(entryId,week) { return `${entryId}:${week}`; }
function tiebreakerStats(league,entry,schedules,activeWeek) {
 let distance=0,resolved=0;
 for(let week=Math.max(league.startWeek,entry.joinedWeek||league.startWeek);week<=activeWeek;week++) {
  const prediction=league.tiebreakers?.[tiebreakerKey(entry.id,week)];const game=mondayNightGame(schedules[week]||[]);
  if(Number.isInteger(prediction)&&game?.status==='final') {distance+=Math.abs(prediction-(Number(game.homeScore)+Number(game.awayScore)));resolved++;}
 }
 return {tiebreakerDistance:distance,tiebreakerResolved:resolved};
}
export function weekDeadline(league,week,games) {
 // Survivor locks team-by-team. Straight Pick’em locks the entire weekly card at the first kickoff.
 if(league.config.format!=='pickem') return Infinity;
 const firstKickoff=liveGames(games).map(game=>Date.parse(game.kickoff)).filter(Number.isFinite).sort((a,b)=>a-b)[0];
 return Number.isFinite(firstKickoff)?firstKickoff:Infinity;
}
export function gameLocked(league,week,game,games,now=Date.now()) {
 return !game || game.status!=='scheduled' || !Number.isFinite(Date.parse(game.kickoff)) || now>=Math.min(Date.parse(game.kickoff),weekDeadline(league,week,games));
}
export function tiebreakerLocked(league,week,games,now=Date.now()) {
 const firstKickoff=liveGames(games).map(game=>Date.parse(game.kickoff)).filter(Number.isFinite).sort((a,b)=>a-b)[0];
 return !Number.isFinite(firstKickoff)||now>=Math.min(firstKickoff,weekDeadline(league,week,games));
}
export function outcome(pick,game) {
 if(pick.week===1&&['win','loss'].includes(pick.historicalResult)) return pick.historicalResult;
 if(!game || !['final','canceled'].includes(game.status)) return 'pending';
 if(game.status==='canceled') return 'void';
 if(game.homeScore===game.awayScore) return 'tie';
 const chosen=String(pick.teamId); const home=String(game.home.id); const away=String(game.away.id);
 const winnerCode=game.winner===home?String(game.home.code):game.winner===away?String(game.away.code):null;
 return game.winner===chosen||winnerCode===chosen?'win':'loss';
}
export function standings(league,schedules,activeWeek) {
 return league.entries.map(entry=>{
  let wins=0,losses=0,ties=0,points=0,eliminatedWeek=null;
  for(let week=Math.max(league.startWeek,entry.joinedWeek||league.startWeek);week<=activeWeek;week++) {
   if(eliminatedWeek) break;
   const games=schedules[week]||[];const picks=league.picks.filter(p=>p.entryId===entry.id&&p.week===week);
   for(const p of picks) {
    const result=outcome(p,games.find(g=>g.id===p.gameId));
    if(result==='win'){wins++;points++;}
    if(result==='loss') losses++;
    if(result==='tie') ties++;
    if(league.config.format==='survivor'&&(result==='loss'||(result==='tie'&&league.config.tiesLose))) eliminatedWeek=week;
   }
   const relevant=liveGames(games);
   const complete=games.length>0&&games.every(g=>['final','canceled'].includes(g.status));
   const required=Math.min(1,relevant.length);
   // A canceled selection is void and satisfies its slot. No retroactive substitute is required.
   if(league.config.format==='survivor'&&complete&&relevant.length&&picks.length<required) eliminatedWeek=week;
  }
  return {...entry,wins,losses,ties,points,eliminatedWeek,alive:!eliminatedWeek,...(league.config.format==='pickem'?tiebreakerStats(league,entry,schedules,activeWeek):{})};
 }).sort((a,b)=>league.config.format==='survivor' ? Number(b.alive)-Number(a.alive)||(b.eliminatedWeek||99)-(a.eliminatedWeek||99)||b.wins-a.wins : b.points-a.points||((b.tiebreakerResolved||0)&&(a.tiebreakerResolved||0)?a.tiebreakerDistance-b.tiebreakerDistance:0)||b.wins-a.wins);
}
export function savePicks(league,input,user,schedules,activeWeek,now=Date.now()) {
 const entry=league.entries.find(e=>e.id===input.entryId);
 const managedOwnerId=league.ownerId===user.id?user.id:(league.coOwnerOf||{})[user.id]||((league.coOwnerIds||[]).includes(user.id)?league.ownerId:user.id);
 if(!entry||entry.userId!==managedOwnerId) fail('You can only change entries you manage.');
 if(input.week!==activeWeek) fail('Only the active week is open for picks.');
 const games=schedules[input.week]||[];
 if(!games.length) fail('The NFL schedule is unavailable. Please retry later.');
 const standing=standings(league,schedules,activeWeek).find(e=>e.id===entry.id);
 if(league.config.format==='survivor'&&!standing.alive) fail('This Survivor entry has been eliminated.');
 if(!Array.isArray(input.picks)||input.picks.length>games.length) fail('Invalid picks.');
 const old=league.picks.filter(p=>p.entryId===entry.id&&p.week===input.week);
 const proposed=input.picks.map(p=>({entryId:entry.id,week:input.week,gameId:String(p.gameId),teamId:String(p.teamId),confidence:1,updatedAt:new Date(now).toISOString()}));
 const monday=league.config.format==='pickem'?mondayNightGame(games):null;
 const tiebreakerPrediction=input.tiebreakerPrediction===undefined||input.tiebreakerPrediction===''?undefined:Number(input.tiebreakerPrediction);
 const key=tiebreakerKey(entry.id,input.week);const priorPrediction=league.tiebreakers?.[key];
 if(monday) {
  const value=tiebreakerPrediction===undefined?priorPrediction:tiebreakerPrediction;
  if(!Number.isInteger(value)||value<0||value>150) fail('Enter a whole-number total from 0 to 150 for Monday Night Football.');
  if(tiebreakerLocked(league,input.week,games,now)&&value!==priorPrediction) fail('The Monday Night tiebreaker is locked once the week begins.');
  league.tiebreakers={...(league.tiebreakers||{}),[key]:value};
 }
 if(new Set(proposed.map(p=>p.gameId)).size!==proposed.length) fail('Choose only one winner per game.');
 if(league.config.format==='survivor') {
  const required=1;
  if(proposed.length!==required) fail('Choose exactly one Survivor team.');
  for(const p of proposed) if(league.picks.some(other=>other.entryId===entry.id&&other.week!==input.week&&other.teamId===p.teamId&&outcome(other,(schedules[other.week]||[]).find(g=>g.id===other.gameId))!=='void')) fail('This life already used that team in another week.');
 } else {
  const lockedSaved=old.filter(p=>gameLocked(league,input.week,games.find(g=>g.id===p.gameId),games,now)).length;
  const selectable=games.filter(game=>!gameLocked(league,input.week,game,games,now)).length;
  if(proposed.length!==lockedSaved+selectable) fail('Choose a winner for every game that is still open before saving your Pick’em card.');
 }
 for(const p of old) {
  const game=games.find(g=>g.id===p.gameId);const replacement=proposed.find(q=>q.gameId===p.gameId);
  if(gameLocked(league,input.week,game,games,now)&&(!replacement||replacement.teamId!==p.teamId||replacement.confidence!==p.confidence)) fail('A locked pick cannot be changed or removed.');
 }
 for(const p of proposed) {
  const g=games.find(g=>g.id===p.gameId);const previous=old.find(q=>q.gameId===p.gameId);
  if(!g||![g.home.id,g.away.id].includes(p.teamId)) fail('Choose a team playing in this game.');
  const unchanged=previous&&previous.teamId===p.teamId&&previous.confidence===p.confidence;
  if(!unchanged&&gameLocked(league,input.week,g,games,now)) fail('The game or league deadline has passed. Refresh to see the current locks.');
 }
 league.picks=[...league.picks.filter(p=>p.entryId!==entry.id||p.week!==input.week),...proposed];
}
export function viewLeague(league,user,schedules,activeWeek,selectedWeek,profileMap={},now=Date.now()) {
 const isCommissioner=league.ownerId===user.id;const coOwnerOf=(league.coOwnerOf||{})[user.id]||((league.coOwnerIds||[]).includes(user.id)?league.ownerId:null);const isCoOwner=!!coOwnerOf;
 const managedEntryIds=league.entries.filter(e=>e.userId===(isCommissioner?user.id:(coOwnerOf||user.id))).map(e=>e.id);
 const perUser=new Map();
 if(league.config.format==='survivor') for(const e of league.entries){const n=(perUser.get(e.userId)||0)+1;perUser.set(e.userId,n);e.name=`Life ${e.entryNumber||n}`;}
 const rows=standings(league,schedules,activeWeek).map(e=>({...e,playerName:profileMap[e.userId]?.display_name||league.members.find(m=>m.userId===e.userId)?.name||'Former member',avatar:profileMap[e.userId]?.avatar||'🏈'}));
 const visibleTiebreakers=Object.fromEntries(Object.entries(league.tiebreakers||{}).filter(([key])=>{
  const split=key.lastIndexOf(':');const entryId=key.slice(0,split);const week=Number(key.slice(split+1));
  if(managedEntryIds.includes(entryId)) return true;
  const game=mondayNightGame(schedules[week]||[]);
  return !!game&&gameLocked(league,week,game,schedules[week]||[],now);
 }));
 const picks=league.picks.filter(p=>{
  if(managedEntryIds.includes(p.entryId)) return true;
  const games=schedules[p.week]||[];const game=games.find(g=>g.id===p.gameId);
  return !!game&&gameLocked(league,p.week,game,games,now);
 }).map(p=>{
  const game=(schedules[p.week]||[]).find(g=>g.id===p.gameId);
  return {...p,team:game?(game.home.id===p.teamId?game.home:game.away):null,result:outcome(p,game)};
 });
 return {...league,tiebreakers:visibleTiebreakers,tiebreakerLocked:league.config.format==='pickem'&&tiebreakerLocked(league,selectedWeek,schedules[selectedWeek]||[],now),members:league.members.map(m=>({...m,name:profileMap[m.userId]?.display_name||m.name})),commissioner:profileMap[league.ownerId]?.display_name||league.members.find(m=>m.userId===league.ownerId)?.name||'Commissioner',coOwners:Object.entries(league.coOwnerOf||{}).map(([id,ownerId])=>({userId:id,name:profileMap[id]?.display_name||league.members.find(m=>m.userId===id)?.name||'Co-owner',ownerId})).concat((league.coOwnerIds||[]).filter(id=>!(league.coOwnerOf||{})[id]).map(id=>({userId:id,name:profileMap[id]?.display_name||league.members.find(m=>m.userId===id)?.name||'Co-owner',ownerId:league.ownerId}))),isCommissioner,isCoOwner,coOwnerOf,managedEntryIds,archives:league.archives.map(a=>({at:a.at,season:a.season,startWeek:a.startWeek,reason:a.reason,pickCount:a.picks.length})),entries:rows,picks,activeWeek,selectedWeek,games:(schedules[selectedWeek]||[]).map(g=>({...g,locked:gameLocked(league,selectedWeek,g,schedules[selectedWeek]||[],now)})),submissions:league.entries.map(e=>({entryId:e.id,count:league.picks.filter(p=>p.entryId===e.id&&p.week===selectedWeek).length})),me:user.id};
}
