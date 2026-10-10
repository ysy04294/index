import { useCallback, useImperativeHandle, useMemo, useRef, type Ref } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { DESTINATION, FALLBACK_ROUTE, ORIGIN, type LatLng } from '../config/scenario';
import { GOOGLE_MAPS_API_KEY, WEBVIEW_BASE_URL } from '../config/env';
import { buildMapHtml } from './map.html.ts';

/**
 * 지도 컴포넌트.
 * 지금은 WebView + Google Maps JavaScript API 로 그립니다 (Expo Go 에서 iOS 구글 지도를 쓰기 위해).
 * 나중에 개발 빌드(expo-dev-client)로 바꾸면 이 파일만 react-native-maps 로 교체하면 됩니다.
 * 바깥에서 쓰는 것은 아래 MapViewHandle / MapViewProps 뿐입니다.
 */
export type MapViewHandle = {
  setPosition: (p: LatLng & { heading: number }) => void;
  recenter: () => void;
};

export type RouteSource = 'routes' | 'directions' | 'fallback' | 'preset';

export type MapViewProps = {
  ref?: Ref<MapViewHandle>;
  style?: StyleProp<ViewStyle>;
  /** 경로가 확정되면 호출 (Directions 실패 시 fallback 경로) */
  onRoute: (path: LatLng[], source: RouteSource) => void;
};

// 한 번 받아 온 경로는 앱이 켜져 있는 동안 재사용 (타입마다 다시 요청하지 않음)
let cachedRoute: LatLng[] | null = null;

export default function MapView({ ref, style, onRoute }: MapViewProps) {
  const webRef = useRef<WebView>(null);
  const ready = useRef(false);
  const queue = useRef<object[]>([]);

  const html = useMemo(
    () =>
      buildMapHtml({
        apiKey: GOOGLE_MAPS_API_KEY,
        origin: ORIGIN,
        destination: DESTINATION,
        fallbackPath: FALLBACK_ROUTE,
        presetPath: cachedRoute,
      }),
    [],
  );

  const post = useCallback((msg: object) => {
    if (!ready.current) {
      // 위치는 마지막 값만 의미가 있으므로 큐에 하나만 유지
      queue.current = [...queue.current.filter((m) => (m as { type: string }).type !== (msg as { type: string }).type), msg];
      return;
    }
    webRef.current?.injectJavaScript(`window.__fromRN && window.__fromRN(${JSON.stringify(msg)}); true;`);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setPosition: (p) => post({ type: 'position', lat: p.lat, lng: p.lng, heading: p.heading }),
      recenter: () => post({ type: 'recenter' }),
    }),
    [post],
  );

  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      let msg: { type: string; path?: LatLng[]; source?: RouteSource; message?: string; status?: string };
      try {
        msg = JSON.parse(e.nativeEvent.data);
      } catch {
        return;
      }
      if (msg.type === 'ready') {
        ready.current = true;
        const pending = queue.current;
        queue.current = [];
        pending.forEach(post);
      } else if (msg.type === 'route' && msg.path && msg.source) {
        if (msg.source === 'routes' || msg.source === 'directions') cachedRoute = msg.path;
        onRoute(msg.path, msg.source);
      } else if (msg.type === 'log' && __DEV__) {
        console.log('[map]', msg.message);
      }
    },
    [onRoute, post],
  );

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
        style={styles.web}
        originWhitelist={['*']}
        source={{ html, baseUrl: WEBVIEW_BASE_URL }}
        onMessage={onMessage}
        onLoadStart={() => {
          ready.current = false;
        }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        setSupportMultipleWindows={false}
        allowsLinkPreview={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8eaed', overflow: 'hidden' },
  web: { flex: 1, backgroundColor: '#e8eaed' },
});
