import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.risenonchain.rush',
  appName: 'RISEN RUSH',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#020B1A",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#2EDBFF",
      splashFullScreen: true,
      splashImmersive: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  server: {
    androidScheme: 'https',
    hostname: 'app.risenonchain.net',
    allowNavigation: [
      'js.paystack.co',
      'checkout.paystack.com',
      'api.paystack.co',
      '*.paystack.co'
    ]
  }
};

export default config;
