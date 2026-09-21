import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.pickemhq.app',
  appName: 'Pickem HQ',
  webDir: 'www',
  server: {
    url: 'https://pickemhq.co',
    cleartext: false,
  },
};

export default config;
