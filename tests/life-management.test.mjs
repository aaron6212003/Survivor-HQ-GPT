import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addEntry,commissionerBackfillPick,commissionerBackfillPicks,createLeague,manageLife,standings} from '../lib/hq/rules.mjs';

const week=(id,home,away,status='final',winner=home)=>({id,status,kickoff:'2026-09-20T17:00:00.000Z',home:{id:home,code:home,name:home},away:{id:away,code:away,name:away},homeScore:winner===home?24:10,awayScore:winner===away?24:10,winner});
function survivor(){
 const user={id:'commissioner'};
 const league=createLeague({name:'Simple Survivor',season:2026,startWeek:1,format:'survivor',maxEntries:5,tiesLose:true},user,{display_name:'Commissioner'});
 return {league,user,entry:addEntry(league,user,{name:'Life 1'})};
}

test('a life marked not started is not eliminated for missed weeks',()=>{
 const {league,entry}=survivor();
 manageLife(league,{entryId:entry.id,lifeAction:'not_started',effectiveWeek:1},2);
 const row=standings(league,{1:[week('w1','BUF','MIA')]},2).find(item=>item.id===entry.id);
 assert.equal(row.lifeStatus,'not_started');
 assert.equal(row.alive,false);
 assert.equal(row.eliminatedWeek,null);
});

test('commissioner can start a life and backfill a past week',()=>{
 const {league,entry}=survivor();
 manageLife(league,{entryId:entry.id,lifeAction:'not_started',effectiveWeek:1},2);
 manageLife(league,{entryId:entry.id,lifeAction:'activate',effectiveWeek:1},2);
 commissionerBackfillPick(league,{entryId:entry.id,week:1,gameId:'w1',teamId:'BUF',reason:'Pick was received before kickoff.'},{1:[week('w1','BUF','MIA')]},2);
 const row=standings(league,{1:[week('w1','BUF','MIA')]},1).find(item=>item.id===entry.id);
 assert.equal(row.alive,true);
 assert.equal(row.wins,1);
});

test('historical corrections preserve one-team-per-life rule',()=>{
 const {league,entry}=survivor();
 commissionerBackfillPick(league,{entryId:entry.id,week:1,gameId:'w1',teamId:'BUF',reason:'First correction.'},{1:[week('w1','BUF','MIA')]},2);
 assert.throws(()=>commissionerBackfillPick(league,{entryId:entry.id,week:2,gameId:'w2',teamId:'BUF',reason:'Duplicate team.'},{1:[week('w1','BUF','MIA')],2:[week('w2','BUF','NYJ')]},2),/already used/);
});

test('batch corrections save several weeks and allow a two-week correction together',()=>{
 const {league,entry}=survivor();
 league.picks.push({entryId:entry.id,week:1,gameId:'w1',teamId:'BUF'},{entryId:entry.id,week:2,gameId:'w2',teamId:'NYJ'});
 commissionerBackfillPicks(league,{entryId:entry.id,picks:[{week:1,gameId:'w1',teamId:'MIA'},{week:2,gameId:'w2',teamId:'NE'}]},{1:[week('w1','BUF','MIA','final','MIA')],2:[week('w2','NYJ','NE','final','NE')]},2);
 assert.deepEqual(league.picks.map(pick=>pick.teamId),['MIA','NE']);
});

test('a revival resumes a life from the selected week',()=>{
 const {league,entry}=survivor();
 league.picks.push({entryId:entry.id,week:1,gameId:'w1',teamId:'MIA'});
 manageLife(league,{entryId:entry.id,lifeAction:'revive',effectiveWeek:2},2);
 commissionerBackfillPick(league,{entryId:entry.id,week:2,gameId:'w2',teamId:'NYJ',reason:'Commissioner revival.'},{1:[week('w1','BUF','MIA')],2:[week('w2','NYJ','NE')]},2);
 const row=standings(league,{1:[week('w1','BUF','MIA')],2:[week('w2','NYJ','NE')]},2).find(item=>item.id===entry.id);
 assert.equal(row.alive,true);
 assert.equal(row.lifeStatus,'revived');
});
