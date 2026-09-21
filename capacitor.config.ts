import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.pickemhq.app',
  appName: 'Pickem HQ',
  webDir: 'www',
  server: {
    url: 'https://pickemhq.co',
    cleartext: false,
    allowNavigation: ['pickemhq.co', 'www.pickemhq.co'],
    errorPath: '/',
  },
};

export default config;
