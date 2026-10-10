import Constants from 'expo-constants';

/** app.config.ts 의 extra.GOOGLE_MAPS_API_KEY (.env 에서 읽음) */
export const GOOGLE_MAPS_API_KEY: string =
  (Constants.expoConfig?.extra as { GOOGLE_MAPS_API_KEY?: string } | undefined)?.GOOGLE_MAPS_API_KEY ?? '';

/** WebView 페이지의 출처. API 키에 HTTP 리퍼러 제한을 걸 때 이 주소를 허용하세요. */
export const WEBVIEW_BASE_URL = 'https://no-ugly-korean.app/';
