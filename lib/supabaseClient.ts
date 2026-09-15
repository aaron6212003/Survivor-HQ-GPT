import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ytequbujojswljdybbmw.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZXF1YnVqb2pzd2xqZHliYm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzODMyNjYsImV4cCI6MjEwNDk1OTI2Nn0.zqWwuQL-LCYROyIN5EDgllh5m4r2QRVFVG6v3KsgZd0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
