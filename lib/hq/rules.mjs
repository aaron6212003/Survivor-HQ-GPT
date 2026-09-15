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
 if(!['survivor','pickem','confidence'].includes(input.format)) fail('Choose Survivor, Pick’em, or Confidence.');
 if(!['per-game','first-game'].includes(input.deadlineMode)) fail('Choose a deadline rule.');
 if(!['shared','correct-picks'].includes(input.tiebreaker)) fail('Choose a tiebreaker.');
 const doubles = input.format==='survivor' ? [...new Set(input.doublePickWeeks || [])].map(w=>integer(w,1,18,'Double-pick week')).sort((a,b)=>a-b) : [];
 if(typeof input.buyIn!=='number'||!Number.isFinite(input.buyIn)||input.buyIn<0||input.buyIn>10000) fail('Buy-in must be between $0 and $10,000.');
 return {format:input.format,maxEntries:integer(input.maxEntries,1,8,'Entry limit'),buyIn:Math.round(input.buyIn*100)/100,deadlineMode:input.deadlineMode,tiebreaker:input.tiebreaker,doublePickWeeks:doubles,tiesLose:input.format==='survivor' ? input.tiesLose!==false : true};
}
export function createLeague(input,user,profile) {
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 const code=[...randomBytes(6)].map(b=>alphabet[b%alphabet.length]).join('');
 const league={id:randomUUID(),code,name:label(input.name,'League name'),season:integer(input.season,2025,2030,'Season'),startWeek:integer(input.startWeek,1,18,'Starting week'),ownerId:user.id,config:settings(input),members:[{userId:user.id,name:profile.display_name}],entries:[],picks:[],deadlines:{},archives:[],audit:[],archived:false};
 addEntry(league,user,{name:profile.display_name});
 return league;
}
export function addEntry(league,user,input) {
 if(league.entries.filter(e=>e.userId===user.id).length>=league.config.maxEntries) fail('You have reached this league’s entry limit.');
 const name=label(input.name,'Entry name',40);
 if(league.entries.some(e=>e.userId===user.id&&e.name.toLowerCase()===name.toLowerCase()))fail('You already have an entry with that name.');
 const entry={id:randomUUID(),userId:user.id,name};
 league.entries.push(entry);return entry;
}
export function liveGames(games) { return games.filter(g=>g.status!=='canceled'); }
export function weekDeadline(league,week,games) {
 const valid=liveGames(games).map(g=>Date.parse(g.kickoff)).filter(Number.isFinite);
 const custom=league.deadlines?.[week] ? Date.parse(league.deadlines[week]) : Infinity;
 return Math.min(custom,league.config.deadlineMode==='first-game'&&valid.length?Math.min(...valid):Infinity);
}
export function gameLocked(league,week,game,games,now=Date.now()) {
 return !game || game.status!=='scheduled' || !Number.isFinite(Date.parse(game.kickoff)) || now>=Math.min(Date.parse(game.kickoff),weekDeadline(league,week,games));
}
export function outcome(pick,game) {
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
  for(let week=league.startWeek;week<=activeWeek;week++) {
   if(eliminatedWeek) break;
   const games=schedules[week]||[];const picks=league.picks.filter(p=>p.entryId===entry.id&&p.week===week);
   for(const p of picks) {
    const result=outcome(p,games.find(g=>g.id===p.gameId));
    if(result==='win'){wins++;points+=league.config.format==='confidence'?p.confidence:1;}
    if(result==='loss') losses++;
    if(result==='tie') ties++;
    if(league.config.format==='survivor'&&(result==='loss'||(result==='tie'&&league.config.tiesLose))) eliminatedWeek=week;
   }
   const relevant=liveGames(games);
   const complete=games.length>0&&games.every(g=>['final','canceled'].includes(g.status));
   const required=Math.min(league.config.doublePickWeeks.includes(week)?2:1,relevant.length);
   // A canceled selection is void and satisfies its slot. No retroactive substitute is required.
   if(league.config.format==='survivor'&&complete&&relevant.length&&picks.length<required) eliminatedWeek=week;
  }
  return {...entry,wins,losses,ties,points,eliminatedWeek,alive:!eliminatedWeek};
 }).sort((a,b)=>league.config.format==='survivor' ? Number(b.alive)-Number(a.alive)||(b.eliminatedWeek||99)-(a.eliminatedWeek||99)||b.wins-a.wins : b.points-a.points||(league.config.tiebreaker==='correct-picks'?b.wins-a.wins:0));
}
export function savePicks(league,input,user,schedules,activeWeek,now=Date.now()) {
 const entry=league.entries.find(e=>e.id===input.entryId&&e.userId===user.id);
 if(!entry) fail('You can only change your own entries.');
 if(input.week!==activeWeek) fail('Only the active week is open for picks.');
 const games=schedules[input.week]||[];
 if(!games.length) fail('The NFL schedule is unavailable. Please retry later.');
 const standing=standings(league,schedules,activeWeek).find(e=>e.id===entry.id);
 if(league.config.format==='survivor'&&!standing.alive) fail('This Survivor entry has been eliminated.');
 if(!Array.isArray(input.picks)||input.picks.length>games.length) fail('Invalid picks.');
 const old=league.picks.filter(p=>p.entryId===entry.id&&p.week===input.week);
 const proposed=input.picks.map(p=>({entryId:entry.id,week:input.week,gameId:String(p.gameId),teamId:String(p.teamId),confidence:league.config.format==='confidence'?integer(p.confidence,1,games.length,'Confidence points'):1,updatedAt:new Date(now).toISOString()}));
 if(new Set(proposed.map(p=>p.gameId)).size!==proposed.length) fail('Choose only one winner per game.');
 if(league.config.format==='survivor') {
  const required=league.config.doublePickWeeks.includes(input.week)?2:1;
  if(proposed.length>required) fail(`Choose at most ${required} Survivor team${required>1?'s':''}.`);
  for(const p of proposed) if(league.picks.some(other=>other.entryId===entry.id&&other.week!==input.week&&other.teamId===p.teamId&&outcome(other,(schedules[other.week]||[]).find(g=>g.id===other.gameId))!=='void')) fail('This entry already used that team in another week.');
 }
 if(league.config.format==='confidence'&&new Set(proposed.map(p=>p.confidence)).size!==proposed.length) fail('Use each confidence value only once this week.');
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
 const rows=standings(league,schedules,activeWeek).map(e=>({...e,playerName:profileMap[e.userId]?.display_name||league.members.find(m=>m.userId===e.userId)?.name||'Former member',avatar:profileMap[e.userId]?.avatar||'🏈'}));
 const picks=league.picks.filter(p=>{
  if(league.entries.some(e=>e.id===p.entryId&&e.userId===user.id)) return true;
  const games=schedules[p.week]||[];const game=games.find(g=>g.id===p.gameId);
  return !!game&&gameLocked(league,p.week,game,games,now);
 }).map(p=>{
  const game=(schedules[p.week]||[]).find(g=>g.id===p.gameId);
  return {...p,team:game?(game.home.id===p.teamId?game.home:game.away):null,result:outcome(p,game)};
 });
 return {...league,members:league.members.map(m=>({...m,name:profileMap[m.userId]?.display_name||m.name})),archives:league.archives.map(a=>({at:a.at,season:a.season,startWeek:a.startWeek,reason:a.reason,pickCount:a.picks.length})),entries:rows,picks,activeWeek,selectedWeek,games:(schedules[selectedWeek]||[]).map(g=>({...g,locked:gameLocked(league,selectedWeek,g,schedules[selectedWeek]||[],now)})),submissions:league.entries.map(e=>({entryId:e.id,count:league.picks.filter(p=>p.entryId===e.id&&p.week===selectedWeek).length})),me:user.id};
}
