import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { HtmlFrameProps } from './HtmlFrame';

export type { HtmlFrameHandle, HtmlFrameProps } from './HtmlFrame';

// iframe 안에서도 앱(WebView)과 같은 방식으로 메시지를 보낼 수 있게 해 주는 연결 코드
const BRIDGE =
  '<script>window.ReactNativeWebView={postMessage:function(m){parent.postMessage({__nuk:true,data:m},"*");}};</script>';

/** 웹 버전: WebView 대신 iframe(srcdoc) */
export default function HtmlFrame({ ref, html, style, onMessage, onLoadStart }: HtmlFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const srcDoc = useMemo(() => html.replace('<head>', `<head>${BRIDGE}`), [html]);
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    onLoadStart?.();
    const listener = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as { __nuk?: boolean; data?: string };
      if (d && d.__nuk && typeof d.data === 'string') onMessageRef.current?.(d.data);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcDoc]);

  useImperativeHandle(
    ref,
    () => ({
      send: (msg) => {
        const w = frameRef.current?.contentWindow as (Window & { __fromRN?: (m: object) => void }) | null | undefined;
        w?.__fromRN?.(msg);
      },
    }),
    [],
  );

  return (
    <View style={[styles.box, style]}>
      <iframe
        ref={frameRef}
        srcDoc={srcDoc}
        allow="autoplay"
        style={{ border: 0, width: '100%', height: '100%', display: 'block', background: '#e8eaed' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#e8eaed', overflow: 'hidden' },
});
