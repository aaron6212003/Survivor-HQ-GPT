import { randomBytes, createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import path from 'node:path';

const games = [
  { id: '1', away: 'BUF', home: 'MIA' }, { id: '2', away: 'KC', home: 'DEN' },
  { id: '3', away: 'DAL', home: 'PHI' }, { id: '4', away: 'SF', home: 'SEA' },
];
const hash = value => createHash('sha256').update(value).digest('hex');
const fail = message => { throw new Error(message); };
const clean = (value, label) => typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= 60 ? value.trim() : fail(`${label} must be 2–60 characters.`);

// Pure rules engine shared by the hosted repository and the local regression tests.
export function applyAction(db, input, token = '') {
  const action = input.action || 'view';
  let league = db.leagues.find(l => l.code === String(input.code || '').trim().toUpperCase());
  let issuedToken;
  if (action === 'create' || action === 'join') {
    const name = clean(input.playerName, 'Player name');
    if (action === 'create') {
      if (!['survivor', 'pickem'].includes(input.format)) fail('Choose a supported format.');
      let code;
      do { code = randomBytes(4).toString('hex').toUpperCase(); } while (db.leagues.some(l => l.code === code));
      league = { code, name: clean(input.name, 'League name'), format: input.format, round: 1, phase: 'open', members: [], picks: [], results: {} };
      db.leagues.push(league);
    }
    if (!league) fail('League code not found.');
    if (league.phase !== 'open' || league.round !== 1) fail('This league has already started.');
    if (league.members.some(m => m.name.toLowerCase() === name.toLowerCase())) fail('That name is already taken. Use your saved player access or choose another name.');
    if (league.members.length >= 50) fail('This test league is full.');
    issuedToken = randomBytes(32).toString('hex');
    league.members.push({ id: randomBytes(12).toString('hex'), name, tokenHash: hash(issuedToken), commissioner: action === 'create', alive: true, points: 0 });
    token = issuedToken;
  }
  if (!league) fail('League code not found.');
  const me = league.members.find(m => m.tokenHash === hash(token));
  if (!me) fail('Player access is missing or invalid. Join with the league code or restore your player key.');
  const commissionerActions = ['lock', 'settle', 'next'];
  if (commissionerActions.includes(action) && !me.commissioner) fail('Only the commissioner can do that.');
  if (action === 'pick') {
    if (league.phase !== 'open') fail('Picks are locked.');
    if (!me.alive) fail('Your Survivor entry has been eliminated.');
    const game = games.find(g => g.id === input.gameId);
    if (!game || ![game.home, game.away].includes(input.team)) fail('Choose a team in this matchup.');
    if (league.format === 'survivor' && league.picks.some(p => p.memberId === me.id && p.round < league.round && p.team === input.team)) fail('You already used that team.');
    league.picks = league.picks.filter(p => !(p.memberId === me.id && p.round === league.round && (league.format === 'survivor' || p.gameId === input.gameId)));
    league.picks.push({ memberId: me.id, round: league.round, gameId: game.id, team: input.team });
  } else if (action === 'lock') {
    if (league.phase !== 'open') fail('This round is already locked.');
    league.phase = 'locked';
  } else if (action === 'settle') {
    if (league.phase !== 'locked') fail('Lock the round before recording results.');
    if (!input.results || games.some(g => ![g.home, g.away, 'tie'].includes(input.results[g.id]))) fail('Choose a result for every game.');
    const results = Object.fromEntries(games.map(g => [g.id, input.results[g.id]]));
    league.results[league.round] = results;
    for (const member of league.members) {
      const picks = league.picks.filter(p => p.memberId === member.id && p.round === league.round);
      const wins = picks.filter(p => results[p.gameId] === p.team).length;
      member.points += wins;
      if (league.format === 'survivor' && member.alive && wins === 0) member.alive = false;
    }
    league.phase = 'settled';
  } else if (action === 'next') {
    if (league.phase !== 'settled') fail('Record results before starting the next round.');
    if (league.round >= 8) fail('The eight-round practice season is complete.');
    league.round++;
    league.phase = 'open';
  } else if (!['view', 'create', 'join'].includes(action)) fail('Unknown action.');
  const { members, picks, ...rest } = league;
  return { ...rest, games, me: me.id, token: issuedToken, members: members.map(({ tokenHash, ...m }) => ({ ...m, submitted: picks.filter(p => p.memberId === m.id && p.round === league.round).length })), picks: picks.filter(p => p.memberId === me.id || p.round < league.round || league.phase !== 'open') };
}

// Local development adapter. Production uses the Supabase repository.
export function transact(input, token = '') {
  const file = process.env.TEST_LEAGUE_FILE || path.join(process.cwd(), 'data', 'test-leagues.json');
  const db = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { leagues: [] };
  const result = applyAction(db, input, token);
  if ((input.action || 'view') !== 'view') {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(`${file}.tmp`, JSON.stringify(db), { mode: 0o600 });
    renameSync(`${file}.tmp`, file);
  }
  return result;
}
