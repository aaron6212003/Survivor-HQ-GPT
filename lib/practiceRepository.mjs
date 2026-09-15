import { applyAction } from './testLeague.mjs';

// Each save is conditional on the version we read. A concurrent save triggers
// a fresh read and full rule validation, including commissioner locks.
export async function transactPractice(client, input, token = '') {
  const action = input.action || 'view';
  const code = String(input.code || '').trim().toUpperCase();
  if (action !== 'create' && !/^[A-F0-9]{8}$/.test(code)) throw new Error('Enter an eight-character practice league code.');
  for (let attempt = 0; attempt < 5; attempt++) {
    let record;
    if (action !== 'create') {
      const read = await client.from('hq_practice_leagues').select('state, revision').eq('code', code).maybeSingle();
      if (read.error) throw new Error('League storage is unavailable. Please retry shortly.');
      if (!read.data) throw new Error('League code not found.');
      record = read.data;
    }
    const db = { leagues: record ? [structuredClone(record.state)] : [] };
    const result = applyAction(db, input, token);
    if (action === 'view') return result;
    const state = db.leagues[0];
    if (!record) {
      const created = await client.from('hq_practice_leagues').insert({ code: state.code, state, revision: 1 });
      if (!created.error) return result;
      if (created.error.code === '23505') continue;
      throw new Error('Could not create the league. Please retry.');
    }
    const saved = await client.from('hq_practice_leagues').update({ state, revision: record.revision + 1 }).eq('code', code).eq('revision', record.revision).select('code').maybeSingle();
    if (saved.error) throw new Error('Could not save your change. Please retry.');
    if (saved.data) return result;
  }
  throw new Error('Other players are updating this league. Please retry your change.');
}
