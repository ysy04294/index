import type { ExpoConfig } from 'expo/config';

// Expo CLI가 .env 파일을 process.env 로 자동으로 읽어 줍니다.
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? '';

const config: ExpoConfig = {
  name: '노 어글리 코리안',
  slug: 'no-ugly-korean',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: false,
    infoPlist: {
      NSCameraUsageDescription: 'Live View 화면에서 후면 카메라를 보여 주기 위해 사용합니다.',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Live View 화면에서 후면 카메라를 보여 주기 위해 사용합니다.',
        recordAudioAndroid: false,
      },
    ],
  ],
  extra: {
    GOOGLE_MAPS_API_KEY,
  },
};

export default config;
