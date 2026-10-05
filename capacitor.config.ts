import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amotixayush.habittracker',
  appName: 'Habit Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
