const summaryBase='https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=';

const normal=(value)=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const mondayInNewYork=(date)=>new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short'}).format(new Date(date))==='Mon';

export function findMondayGame(games) {
 return [...(games||[])].filter(game=>mondayInNewYork(game.kickoff)).sort((a,b)=>Date.parse(a.kickoff)-Date.parse(b.kickoff))[0]||null;
}

export function bingoCatalog(game) {
 const teamCards=(team,side)=>[
  ['win',`${team.code} win the game`,stats=>stats.final&&stats[side].score>stats[side==='home'?'away':'home'].score],
  ['halfLead',`${team.code} lead at halftime`,stats=>stats[side].halftimeLead],
  ['pass200',`${team.code} reach 200 passing yards`,stats=>stats[side].passingYards>=200],
  ['rush100',`${team.code} reach 100 rushing yards`,stats=>stats[side].rushingYards>=100],
  ['sacks3',`${team.code} record 3 sacks`,stats=>stats[side].sacks>=3],
  ['turnovers2',`${team.code} force 2 turnovers`,stats=>stats[side].forcedTurnovers>=2],
  ['fieldGoals2',`${team.code} make 2 field goals`,stats=>stats[side].fieldGoalsMade>=2],
  ['scoreEveryQuarter',`${team.code} score in every quarter`,stats=>stats[side].scoreEveryQuarter],
  ['firstDowns20',`${team.code} record 20 first downs`,stats=>stats[side].firstDowns>=20],
  ['totalYards350',`${team.code} reach 350 total yards`,stats=>stats[side].totalYards>=350],
  ['passes20',`${team.code} complete 20 passes`,stats=>stats[side].passesCompleted>=20],
  ['turnoverBattle',`${team.code} win the turnover battle`,stats=>stats[side].turnoverBattle],
 ].map(([rule,label,complete])=>({id:`${side}:${rule}`,team:side,label,complete}));
 return [
  ...teamCards(game.away,'away'),...teamCards(game.home,'home'),

  {id:'game:both20',team:'game',label:'Both teams score 20 points',complete:stats=>stats.home.score>=20&&stats.away.score>=20},
  {id:'game:tieSecondHalf',team:'game',label:'Game is tied in the second half',complete:stats=>stats.tiedSecondHalf},
  {id:'game:overtime',team:'game',label:'Game goes to overtime',complete:stats=>stats.overtime},
  {id:'game:leadChange',team:'game',label:'Lead changes in the second half',complete:stats=>stats.secondHalfLeadChange},
  {id:'game:closeHalf',team:'game',label:'Game is within 7 points at halftime',complete:stats=>stats.closeAtHalftime},
  {id:'game:oneScoreFinal',team:'game',label:'Game ends within 7 points',complete:stats=>stats.final&&Math.abs(stats.home.score-stats.away.score)<=7},
  {id:'game:bothFirstHalf',team:'game',label:'Both teams score in the first half',complete:stats=>stats.home.firstHalfScore>0&&stats.away.firstHalfScore>0},
  {id:'game:bothPassing200',team:'game',label:'Both teams reach 200 passing yards',complete:stats=>stats.home.passingYards>=200&&stats.away.passingYards>=200},
  {id:'game:bothFirstDowns15',team:'game',label:'Both teams record 15 first downs',complete:stats=>stats.home.firstDowns>=15&&stats.away.firstDowns>=15},
  {id:'game:bothFieldGoals',team:'game',label:'Both teams make a field goal',complete:stats=>stats.home.fieldGoalsMade>=1&&stats.away.fieldGoalsMade>=1},
  {id:'game:combinedTurnovers3',team:'game',label:'3 combined turnovers',complete:stats=>stats.home.turnovers+stats.away.turnovers>=3},
  {id:'game:bothRushing100',team:'game',label:'Both teams reach 100 rushing yards',complete:stats=>stats.home.rushingYards>=100&&stats.away.rushingYards>=100},
  {id:'game:combined600Yards',team:'game',label:'600 combined total yards',complete:stats=>stats.home.totalYards+stats.away.totalYards>=600},
  {id:'game:combined50FirstDowns',team:'game',label:'50 combined first downs',complete:stats=>stats.home.firstDowns+stats.away.firstDowns>=50},
  {id:'game:fiveFieldGoals',team:'game',label:'5 combined field goals',complete:stats=>stats.home.fieldGoalsMade+stats.away.fieldGoalsMade>=5},
 ];
}

function statValue(items,names) {
 const item=(items||[]).find(item=>names.includes(normal(item.name))||names.includes(normal(item.displayName))||names.includes(normal(item.label)));
 if(!item) return 0;
 const raw=String(item.displayValue??item.value??'0');
 const first=raw.match(/-?\d+(?:\.\d+)?/);return first?Number(first[0]):0;
}
function playerGroup(summary,teamId,name) {
 const team=(summary.boxscore?.players||[]).find(item=>String(item.team?.id)===String(teamId));
 return (team?.statistics||[]).find(group=>normal(group.name)===normal(name));
}
function playerStatTotal(group,label) {
 const index=(group?.labels||[]).findIndex(item=>normal(item)===normal(label));
 if(index<0)return 0;
 return (group?.athletes||[]).reduce((total,athlete)=>{
  const value=String(athlete.stats?.[index]??'0').match(/-?\d+(?:\.\d+)?/);
  return total+(value?Number(value[0]):0);
 },0);
}
function teamStats(summary,teamId) {
 const row=(summary.boxscore?.teams||[]).find(item=>String(item.team?.id)===String(teamId));
 const stats=row?.statistics||[];
 const passing=playerGroup(summary,teamId,'passing');
 const defense=playerGroup(summary,teamId,'defensive');
 const kicking=playerGroup(summary,teamId,'kicking');
 return {
  passingYards:statValue(stats,['netpassingyards','passingyards']),rushingYards:statValue(stats,['rushingyards']),
  sacks:playerStatTotal(defense,'SACKS'),forcedTurnovers:statValue(stats,['turnovers']),
  fieldGoalsMade:playerStatTotal(kicking,'FG'),fourthDownConversions:statValue(stats,['fourthdownconversions','fourthdownconv']),
  firstDowns:statValue(stats,['firstdowns']),totalYards:statValue(stats,['totalyards']),passesCompleted:statValue(stats,['completionattempts','completionspassing','completions'])||playerStatTotal(passing,'C/ATT'),thirdDownConversions:statValue(stats,['thirddowneff','thirddownconversions','thirddownconv']),turnovers:statValue(stats,['turnovers']),
 };
}
function periodsFor(competitor) { return (competitor?.linescores||[]).map(item=>Number(item.displayValue??item.value??0)||0); }

export async function liveBingoStats(game) {
 const response=await fetch(`${summaryBase}${encodeURIComponent(game.id)}`,{cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!response.ok) throw new Error('Live Bingo data is temporarily unavailable.');
 const summary=await response.json();const competition=summary.header?.competitions?.[0];
 const home=competition?.competitors?.find(item=>item.homeAway==='home');const away=competition?.competitors?.find(item=>item.homeAway==='away');
 if(!home||!away) throw new Error('Live Bingo data is incomplete.');
 const status=summary.header?.competitions?.[0]?.status?.type||summary.header?.status?.type||{};
 // The completed-game response does not always preserve period data, so final status is authoritative for halftime rules.
 const halfComplete=Number(status.period||0)>2||!!status.completed;
 const homePeriods=periodsFor(home),awayPeriods=periodsFor(away);
 const secondHalfPairs=homePeriods.slice(2).map((score,index)=>[score,awayPeriods[index+2]||0]);
 const signs=secondHalfPairs.map(([h,a])=>Math.sign(h-a)).filter(Boolean);
 const homeStats=teamStats(summary,home.team.id),awayStats=teamStats(summary,away.team.id);
 return {
  home:{score:Number(home.score)||0,halftimeLead:halfComplete&&(homePeriods[0]||0)+(homePeriods[1]||0)>(awayPeriods[0]||0)+(awayPeriods[1]||0),firstHalfScore:(homePeriods[0]||0)+(homePeriods[1]||0),...homeStats,forcedTurnovers:awayStats.turnovers,scoreEveryQuarter:!!status.completed&&homePeriods.slice(0,4).every(score=>score>0),outgainOpponent:!!status.completed&&homeStats.totalYards>awayStats.totalYards,turnoverBattle:!!status.completed&&homeStats.turnovers<awayStats.turnovers},
  away:{score:Number(away.score)||0,halftimeLead:halfComplete&&(awayPeriods[0]||0)+(awayPeriods[1]||0)>(homePeriods[0]||0)+(homePeriods[1]||0),firstHalfScore:(awayPeriods[0]||0)+(awayPeriods[1]||0),...awayStats,forcedTurnovers:homeStats.turnovers,scoreEveryQuarter:!!status.completed&&awayPeriods.slice(0,4).every(score=>score>0),outgainOpponent:!!status.completed&&awayStats.totalYards>homeStats.totalYards,turnoverBattle:!!status.completed&&awayStats.turnovers<homeStats.turnovers},
  final:!!status.completed,overtime:Number(status.period||0)>4||/overtime/i.test(status.detail||''),
  tiedSecondHalf:secondHalfPairs.some(([h,a])=>h===a),secondHalfLeadChange:signs.some((sign,index)=>index>0&&sign!==signs[index-1]),closeAtHalftime:halfComplete&&Math.abs((homePeriods[0]||0)+(homePeriods[1]||0)-(awayPeriods[0]||0)-(awayPeriods[1]||0))<=7,
  detail:status.detail||'Scheduled',updatedAt:new Date().toISOString(),
 };
}

export function completedCardIds(game,stats) { return bingoCatalog(game).filter(card=>card.complete(stats)).map(card=>card.id); }
export function linesFor(board,completed) { const marked=new Set(completed);const cells=board.map(id=>id==='free'||marked.has(id));const lines=[];for(let row=0;row<5;row++)if(cells.slice(row*5,row*5+5).every(Boolean))lines.push(`row-${row+1}`);for(let col=0;col<5;col++)if([0,1,2,3,4].every(row=>cells[row*5+col]))lines.push(`column-${col+1}`);if([0,1,2,3,4].every(i=>cells[i*6]))lines.push('diagonal-down');if([0,1,2,3,4].every(i=>cells[(i+1)*4]))lines.push('diagonal-up');return lines; }
