const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read survivor.json for 32 NFL Teams
const survivorDataPath = path.join(__dirname, '../data/survivor.json');
const survivorData = JSON.parse(fs.readFileSync(survivorDataPath, 'utf8'));
const teams = survivorData.teams || [];

async function seed() {
  console.log('Seeding NFL Teams into Supabase...');
  
  const teamRecords = teams.map((t) => ({
    id: t.id,
    code: t.code,
    name: t.name,
    city: t.city,
    nickname: t.nickname,
    conference: t.conference,
    division: t.division,
    logo_url: t.logo_url,
    primary_color: t.primary_color,
    secondary_color: t.secondary_color,
    bye_week: t.bye_week,
    wins: t.wins || 0,
    losses: t.losses || 0,
    ties: t.ties || 0,
  }));

  const { data: insertedTeams, error: teamErr } = await supabase
    .from('nfl_teams')
    .upsert(teamRecords, { onConflict: 'id' });

  if (teamErr) {
    console.error('Error inserting teams:', teamErr);
  } else {
    console.log(`Successfully seeded ${teamRecords.length} NFL Teams!`);
  }
}

seed();
