import { createClient } from '@supabase/supabase-js';
import { Preferences } from '@capacitor/preferences';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ytequbujojswljdybbmw.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZXF1YnVqb2pzd2xqZHliYm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzODMyNjYsImV4cCI6MjEwNDk1OTI2Nn0.zqWwuQL-LCYROyIN5EDgllh5m4r2QRVFVG6v3KsgZd0';

const isNativeApp =
  typeof window !== 'undefined' &&
  ['capacitor:', 'ionic:', 'file:'].includes(window.location.protocol);

/**
 * WebView localStorage can be cleared or temporarily unavailable after an iOS
 * update. Store the auth session in Capacitor Preferences on native builds so
 * it survives normal app restarts just like a native app session should.
 */
const nativeSessionStorage = {
  async getItem(key: string) {
    return (await Preferences.get({ key })).value;
  },
  async setItem(key: string, value: string) {
    await Preferences.set({ key, value });
  },
  async removeItem(key: string) {
    await Preferences.remove({ key });
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isNativeApp ? nativeSessionStorage : undefined,
    storageKey: 'pickemhq.auth.session',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: !isNativeApp,
  },
});
