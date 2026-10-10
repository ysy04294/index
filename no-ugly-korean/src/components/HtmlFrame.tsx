import { useImperativeHandle, useRef, type Ref } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { WEBVIEW_BASE_URL } from '../config/env';

/**
 * HTML 문자열을 띄우는 상자. 앱에서는 WebView, 웹에서는 iframe(HtmlFrame.web.tsx).
 * 페이지 → 앱: window.ReactNativeWebView.postMessage(string)
 * 앱 → 페이지: send(msg) → window.__fromRN(msg)
 */
export type HtmlFrameHandle = { send: (msg: object) => void };

export type HtmlFrameProps = {
  ref?: Ref<HtmlFrameHandle>;
  html: string;
  style?: StyleProp<ViewStyle>;
  onMessage?: (data: string) => void;
  /** 페이지를 새로 읽기 시작할 때 */
  onLoadStart?: () => void;
};

export default function HtmlFrame({ ref, html, style, onMessage, onLoadStart }: HtmlFrameProps) {
  const webRef = useRef<WebView>(null);

  useImperativeHandle(
    ref,
    () => ({
      send: (msg) =>
        webRef.current?.injectJavaScript(`window.__fromRN && window.__fromRN(${JSON.stringify(msg)}); true;`),
    }),
    [],
  );

  return (
    <WebView
      ref={webRef}
      style={[styles.web, style]}
      originWhitelist={['*']}
      source={{ html, baseUrl: WEBVIEW_BASE_URL }}
      onMessage={(e) => onMessage?.(e.nativeEvent.data)}
      onLoadStart={onLoadStart}
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
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: '#e8eaed' },
});
