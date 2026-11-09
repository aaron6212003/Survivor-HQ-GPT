import test from 'node:test';
import assert from 'node:assert/strict';
import {bingoCatalog,completedCardIds,findMondayGame,linesFor} from '../lib/bingo.mjs';

const game={id:'event-1',kickoff:'2026-11-09T20:15:00Z',away:{code:'BUF',name:'Buffalo Bills'},home:{code:'MIN',name:'Minnesota Vikings'}};
test('MNF Bingo supplies specific cards for both teams and game moments',()=>{
 const cards=bingoCatalog(game);assert.ok(cards.length>=30);assert.ok(cards.some(card=>card.label==='BUF score 30 points'));assert.ok(cards.some(card=>card.label==='MIN record 3 sacks'));assert.ok(cards.some(card=>card.label==='Game goes to overtime'));
});
test('MNF Bingo auto-completes score and team-stat cards',()=>{
 const completed=completedCardIds(game,{away:{score:30,passingYards:262,rushingYards:105,sacks:3,forcedTurnovers:2,fieldGoalsMade:2,fourthDownConversions:2,firstDowns:21,halftimeLead:true},home:{score:20,passingYards:205,rushingYards:50,sacks:0,forcedTurnovers:0,fieldGoalsMade:0,fourthDownConversions:0,firstDowns:12,halftimeLead:false},final:false,overtime:false,tiedSecondHalf:false,secondHalfLeadChange:false});
 assert.ok(completed.includes('away:points30'));assert.ok(completed.includes('away:pass250'));assert.ok(completed.includes('away:sacks3'));assert.ok(completed.includes('game:combined45'));
});
test('MNF Bingo recognizes a completed line with its Free Space',()=>{
 const board=['away:points10','away:points20','away:points30','away:pass200','away:pass250','home:points10','home:points20','home:points30','home:pass200','home:pass250','game:combined35','game:combined45','free','game:combined55','game:both20','home:rush100','home:sacks3','home:turnovers2','home:fieldGoals2','home:fourthDown2','away:rush100','away:sacks3','away:turnovers2','away:fieldGoals2','away:fourthDown2'];
 assert.deepEqual(linesFor(board,new Set(board.filter(id=>id!=='free'))),['row-1','row-2','row-3','row-4','row-5','column-1','column-2','column-3','column-4','column-5','diagonal-down','diagonal-up']);
});
test('MNF Bingo identifies Monday games',()=>{
 assert.equal(findMondayGame([{...game,kickoff:'2026-11-08T20:15:00Z'},{...game,id:'monday',kickoff:'2026-11-09T20:15:00Z'}])?.id,'monday');
});
