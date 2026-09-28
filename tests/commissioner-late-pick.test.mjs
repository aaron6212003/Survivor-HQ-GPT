import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addEntry,commissionerLatePick,createLeague} from '../lib/hq/rules.mjs';

const game={id:'game-1',status:'scheduled',kickoff:'2026-09-28T17:00:00.000Z',home:{id:'BUF',code:'BUF',name:'Buffalo Bills'},away:{id:'MIA',code:'MIA',name:'Miami Dolphins'}};

function league(){
 const user={id:'commissioner'};const profile={display_name:'Commissioner'};
 const created=createLeague({name:'Sunday Survivor',season:2026,startWeek:1,format:'survivor',maxEntries:2,tiesLose:true},user,profile);
 addEntry(created,user,{name:'Life 1'});
 return created;
}

test('commissioner late pick replaces a missed active-week Survivor selection only after explicit confirmation',()=>{
 const current=league();const entry=current.entries[0];
 const saved=commissionerLatePick(current,{entryId:entry.id,week:1,gameId:'game-1',teamId:'BUF',reason:'Pick was sent before kickoff.',confirmation:'LATE PICK'},{1:[game]},1);
 assert.equal(saved.teamId,'BUF');
 assert.equal(current.picks.length,1);
 assert.equal(current.picks[0].commissionerOverride,true);
 assert.throws(()=>commissionerLatePick(current,{entryId:entry.id,week:1,gameId:'game-1',teamId:'MIA',reason:'Correction',confirmation:'late pick'},{1:[game]},1),/Type LATE PICK/);
});

test('commissioner late pick keeps Survivor team-use rules intact',()=>{
 const current=league();const entry=current.entries[0];
 current.picks.push({entryId:entry.id,week:2,gameId:'old-game',teamId:'BUF'});
 assert.throws(()=>commissionerLatePick(current,{entryId:entry.id,week:1,gameId:'game-1',teamId:'BUF',reason:'Missed pick',confirmation:'LATE PICK'},{1:[game],2:[{...game,id:'old-game',status:'scheduled'}]},1),/already used/);
});
