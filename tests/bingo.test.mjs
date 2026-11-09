import test from 'node:test';
import assert from 'node:assert/strict';
import {bingoCatalog,completedCardIds,findMondayGame,linesFor} from '../lib/bingo.mjs';

const game={id:'event-1',kickoff:'2026-11-09T20:15:00Z',away:{code:'BUF',name:'Buffalo Bills'},home:{code:'MIN',name:'Minnesota Vikings'}};
test('MNF Bingo has distinct, non-stacking team and game moments',()=>{
 const cards=bingoCatalog(game);assert.equal(cards.filter(card=>card.team==='away').length,12);assert.equal(cards.filter(card=>card.team==='home').length,12);assert.ok(cards.some(card=>card.label==='BUF reach 200 passing yards'));assert.ok(!cards.filter(card=>card.team!=='game').some(card=>/score 10|score 20|score 30|250 passing/i.test(card.label)));assert.ok(cards.some(card=>card.label==='Game goes to overtime'));
});
test('MNF Bingo automatically completes independent stat cards',()=>{
 const completed=completedCardIds(game,{away:{score:30,passingYards:262,rushingYards:105,sacks:3,forcedTurnovers:2,fieldGoalsMade:2,fourthDownConversions:2,firstDowns:21,totalYards:355,passesCompleted:23,thirdDownConversions:6,halftimeLead:true,firstHalfScore:17},home:{score:20,passingYards:205,rushingYards:50,sacks:0,forcedTurnovers:0,fieldGoalsMade:0,fourthDownConversions:0,firstDowns:12,totalYards:265,passesCompleted:18,thirdDownConversions:3,halftimeLead:false,firstHalfScore:10},final:false,overtime:false,tiedSecondHalf:false,secondHalfLeadChange:false,closeAtHalftime:true});
 assert.ok(completed.includes('away:pass200'));assert.ok(completed.includes('away:totalYards350'));assert.ok(completed.includes('away:sacks3'));assert.ok(!completed.includes('away:pass250'));assert.ok(completed.includes('game:both20'));
});
test('MNF Bingo recognizes a completed 25-square line without a free space',()=>{
 const board=['away:win','away:halfLead','away:pass200','away:rush100','away:sacks3','away:turnovers2','away:fieldGoals2','away:fourthDown2','away:firstDowns20','away:totalYards350','home:win','home:halfLead','home:pass200','home:rush100','home:sacks3','home:turnovers2','home:fieldGoals2','home:fourthDown2','home:firstDowns20','home:totalYards350','game:both20','game:tieSecondHalf','game:overtime','game:leadChange','game:closeHalf'];
 assert.deepEqual(linesFor(board,new Set(board)),['row-1','row-2','row-3','row-4','row-5','column-1','column-2','column-3','column-4','column-5','diagonal-down','diagonal-up']);
});
test('MNF Bingo identifies Monday games',()=>{assert.equal(findMondayGame([{...game,kickoff:'2026-11-08T20:15:00Z'},{...game,id:'monday',kickoff:'2026-11-09T20:15:00Z'}])?.id,'monday');});
