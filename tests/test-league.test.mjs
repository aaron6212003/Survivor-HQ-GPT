import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { transact } from '../lib/testLeague.mjs';

test('complete multi-player Survivor flow, permissions, privacy and persistence', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'hq-test-'));
  process.env.TEST_LEAGUE_FILE = path.join(dir, 'db.json');
  try {
    const owner = transact({ action: 'create', name: 'Our league', playerName: 'Aaron', format: 'survivor' });
    const friend = transact({ action: 'join', code: owner.code.toLowerCase(), playerName: 'Friend' });
    const missed = transact({ action: 'join', code: owner.code, playerName: 'Missed' });
    const call = (action, extra = {}, token = owner.token) => transact({ action, code: owner.code, ...extra }, token);
    assert.throws(() => call('view', {}, 'wrong'), /access/);
    assert.throws(() => call('join', { playerName: 'Aaron' }), /taken/);
    assert.throws(() => call('lock', {}, friend.token), /commissioner/);
    assert.throws(() => call('settle', { results: {} }), /Lock/);
    assert.throws(() => call('pick', { gameId: '1', team: 'KC' }), /matchup/);
    call('pick', { gameId: '1', team: 'BUF' });
    call('pick', { gameId: '2', team: 'KC' });
    assert.equal(call('view').picks.length, 1);
    assert.equal(call('view', {}, friend.token).picks.length, 0);
    call('pick', { gameId: '1', team: 'MIA' }, friend.token);
    assert.equal(call('view', {}, friend.token).members.find(m => m.id === owner.me).submitted, 1);
    assert.ok(!JSON.stringify(call('view')).includes('tokenHash'));
    call('lock');
    assert.equal(call('view', {}, friend.token).picks.length, 2);
    assert.throws(() => call('pick', { gameId: '1', team: 'BUF' }), /locked/);
    assert.throws(() => call('join', { playerName: 'Late friend' }), /started/);
    assert.throws(() => call('settle', { results: { 1: 'BUF' } }), /every game/);
    const scored = call('settle', { results: { 1: 'BUF', 2: 'KC', 3: 'tie', 4: 'SF' } });
    assert.equal(scored.members.find(m => m.id === friend.me).alive, false);
    assert.equal(scored.members.find(m => m.id === missed.me).alive, false);
    assert.equal(scored.members.find(m => m.id === owner.me).points, 1);
    assert.throws(() => call('settle', { results: {} }), /Lock/);
    call('next');
    assert.throws(() => call('pick', { gameId: '2', team: 'KC' }), /already used/);
    assert.throws(() => call('pick', { gameId: '1', team: 'BUF' }, friend.token), /eliminated/);
    const other = transact({ action: 'create', name: 'Other league', playerName: 'Other', format: 'pickem' });
    assert.throws(() => transact({ action: 'view', code: other.code }, owner.token), /access/);
    assert.equal(call('view').round, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('Pick’em saves each game, scores once, ties earn zero, no elimination', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'hq-test-'));
  process.env.TEST_LEAGUE_FILE = path.join(dir, 'db.json');
  try {
    const owner = transact({ action: 'create', name: 'Pickem league', playerName: 'Aaron', format: 'pickem' });
    const call = (action, extra = {}) => transact({ action, code: owner.code, ...extra }, owner.token);
    for (const [gameId, team] of [['1','BUF'], ['2','KC'], ['3','DAL'], ['4','SF']]) call('pick', { gameId, team });
    call('pick', { gameId: '1', team: 'MIA' });
    assert.equal(call('view').picks.length, 4);
    call('lock');
    const scored = call('settle', { results: { 1: 'MIA', 2: 'DEN', 3: 'tie', 4: 'SF' } });
    assert.equal(scored.members[0].points, 2);
    assert.equal(scored.members[0].alive, true);
    assert.throws(() => call('settle'), /Lock/);
    call('next');
    call('pick', { gameId: '1', team: 'MIA' });
    assert.equal(call('view').members[0].submitted, 1);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
