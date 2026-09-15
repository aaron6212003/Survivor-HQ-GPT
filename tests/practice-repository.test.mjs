import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transactPractice } from '../lib/practiceRepository.mjs';

function repository() {
  const records = new Map();
  let beforeUpdate;
  const client = {
    from() {
      const filters = {};
      let mutation;
      return {
        select() { return this; },
        eq(k,v) { filters[k]=v; return this; },
        async insert(row) {
          if (records.has(row.code)) return {error:{code:'23505'}};
          records.set(row.code, structuredClone(row)); return {error:null};
        },
        update(value) { mutation=value; return this; },
        async maybeSingle() {
          if (mutation && beforeUpdate) { const fn=beforeUpdate; beforeUpdate=undefined; await fn(); }
          const row=records.get(filters.code);
          if (!row || (filters.revision !== undefined && filters.revision !== row.revision)) return {data:null,error:null};
          if (mutation) records.set(filters.code,{...row,...structuredClone(mutation)});
          return {data: structuredClone(mutation ? {code:row.code} : row),error:null};
        }
      };
    }
  };
  return {client, conflict(fn) {beforeUpdate=fn;}};
}

test('concurrent joining preserves both new players', async () => {
  const {client}=repository();
  const owner=await transactPractice(client,{action:'create',name:'Concurrency QA',playerName:'Owner',format:'survivor'});
  await Promise.all(['Player A','Player B','Player C'].map(playerName=>transactPractice(client,{action:'join',code:owner.code,playerName})));
  const view=await transactPractice(client,{action:'view',code:owner.code},owner.token);
  assert.equal(view.members.length,4);
});

test('a commissioner lock racing a pick forces fresh validation', async () => {
  const repo=repository();
  const owner=await transactPractice(repo.client,{action:'create',name:'Lock race QA',playerName:'Owner',format:'survivor'});
  const friend=await transactPractice(repo.client,{action:'join',code:owner.code,playerName:'Friend'});
  repo.conflict(()=>transactPractice(repo.client,{action:'lock',code:owner.code},owner.token));
  await assert.rejects(transactPractice(repo.client,{action:'pick',code:owner.code,gameId:'1',team:'BUF'},friend.token),/locked/);
  const view=await transactPractice(repo.client,{action:'view',code:owner.code},owner.token);
  assert.equal(view.phase,'locked');
  assert.equal(view.picks.length,0);
});
