import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { FALLBACK_ROUTE, NOTICE_C, SIMULATION, TEXT, type LatLng, type NoticeType } from '../config/scenario';
import MapView, { type MapViewHandle, type RouteSource } from '../components/MapView';
import NavTopBanner from '../components/NavTopBanner';
import NavBottomSheet from '../components/NavBottomSheet';
import DoneButton from '../components/DoneButton';
import NoticeA from '../components/notices/NoticeA';
import NoticeB from '../components/notices/NoticeB';
import NoticeC from '../components/notices/NoticeC';
import { ConfirmButton } from '../components/notices/common';
import type { CView, Phase } from '../state/testFlow';
import { buildRoute, pointAt, type Route } from '../utils/geo';

type Props = {
  type: NoticeType;
  phase: Phase;
  speed: number;
  cViewOverride: CView | null;
  forceNoticeToken: number;
  onRouteReady: (source: RouteSource | 'timeout') => void;
  onNoticeShown: (forced: boolean) => void;
  onConfirm: () => void;
  onDone: () => void;
  onBCard: (page: number) => void;
  onBSpeak: () => void;
  onCView: (view: CView) => void;
};

const TICK_MS = 100;
/** WebView 가 경로를 끝내 보내지 않으면 이 시간 뒤 fallback 경로로 출발 */
const ROUTE_WAIT_MS = 20000;

/** 길찾기 화면 (공통 베이스) + 타입별 알림 */
export default function NavScreen(p: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapViewHandle>(null);

  const [route, setRoute] = useState<Route | null>(null);
  const [distance, setDistance] = useState(0);

  const distRef = useRef(0);
  const speedRef = useRef(p.speed);
  const firedRef = useRef(false);
  const stoppedRef = useRef(false);
  const tokenAtMount = useRef(p.forceNoticeToken);
  const cb = useRef(p);
  useEffect(() => {
    cb.current = p;
    speedRef.current = p.speed;
  });

  const noticeActive = p.phase === 'noticeShown';
  const cSplit = p.type === 'C' && (p.phase === 'noticeShown' || p.phase === 'confirmed');

  // 경로 받기 (처음 한 번만 — 출발 후에는 바꾸지 않음)
  const routeSetRef = useRef(false);
  const acceptRoute = useCallback((path: LatLng[], source: RouteSource | 'timeout') => {
    if (routeSetRef.current) return;
    routeSetRef.current = true;
    setRoute(buildRoute(path));
    cb.current.onRouteReady(source);
  }, []);
  const onRoute = useCallback((path: LatLng[], source: RouteSource) => acceptRoute(path, source), [acceptRoute]);

  useEffect(() => {
    const t = setTimeout(() => acceptRoute(FALLBACK_ROUTE, 'timeout'), ROUTE_WAIT_MS);
    return () => clearTimeout(t);
  }, [acceptRoute]);

  const fireNotice = useCallback((forced: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    cb.current.onNoticeShown(forced);
  }, []);

  // 이동 시뮬레이션
  useEffect(() => {
    if (!route) return;
    mapRef.current?.setPosition(pointAt(route, distRef.current));
    const mps = route.total / SIMULATION.durationSec;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;
      if (stoppedRef.current) return;

      let d = Math.min(route.total, distRef.current + mps * speedRef.current * dt);
      const geofenceAt = Math.max(0, route.total - SIMULATION.geofenceMeters);
      if (!firedRef.current && d >= geofenceAt) {
        if (SIMULATION.stopAtGeofence) {
          d = geofenceAt;
          stoppedRef.current = true;
        }
        fireNotice(false);
      }
      if (d >= route.total) stoppedRef.current = true;

      distRef.current = d;
      setDistance(d);
      mapRef.current?.setPosition(pointAt(route, d));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [route, fireNotice]);

  // 진행자: 알림 바로 띄우기 → 점을 geofence 지점으로 옮기고 알림
  useEffect(() => {
    if (p.forceNoticeToken === tokenAtMount.current || firedRef.current) return;
    const r = route ?? buildRoute(FALLBACK_ROUTE);
    const d = Math.max(distRef.current, r.total - SIMULATION.geofenceMeters);
    distRef.current = d;
    if (SIMULATION.stopAtGeofence) stoppedRef.current = true;
    setDistance(d);
    if (!route) acceptRoute(FALLBACK_ROUTE, 'fallback');
    mapRef.current?.setPosition(pointAt(r, d));
    fireNotice(true);
  }, [p.forceNoticeToken, route, fireNotice, acceptRoute]);

  const total = route?.total ?? buildRoute(FALLBACK_ROUTE).total;
  const progress = total > 0 ? distance / total : 0;

  return (
    <View style={styles.root}>
      {/* 상단: 상태바 + 헤더(왼쪽 타입 표시 / 오른쪽 완료 버튼) */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerLabel}>{TEXT.nav.headerLabel(p.type)}</Text>
          <DoneButton enabled={p.phase === 'confirmed'} onPress={p.onDone} />
        </View>
      </View>

      <View style={styles.body}>
        {cSplit && (
          <NoticeC
            key="c"
            style={{ flex: NOTICE_C.cameraRatio }}
            override={p.cViewOverride}
            onViewResolved={p.onCView}
            showLabels
          />
        )}
        {!cSplit && <NavTopBanner key="banner" progress={progress} totalMeters={total} />}

        <View
          key="map"
          style={{ flex: cSplit ? 1 - NOTICE_C.cameraRatio : 1 }}
          onLayout={() => mapRef.current?.recenter()}
        >
          <MapView ref={mapRef} onRoute={onRoute} />
          {!route && (
            <View style={styles.loading} pointerEvents="none">
              <Text style={styles.loadingText}>경로 불러오는 중…</Text>
            </View>
          )}
          {noticeActive && p.type === 'A' && <NoticeA onConfirm={p.onConfirm} />}
        </View>

        {!cSplit && <NavBottomSheet key="sheet" remainingMeters={Math.max(0, total - distance)} />}

        {noticeActive && p.type === 'B' && <NoticeB onConfirm={p.onConfirm} onCardChange={p.onBCard} onSpeak={p.onBSpeak} />}

        {noticeActive && p.type === 'C' && (
          <View style={[styles.cConfirm, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <ConfirmButton onPress={p.onConfirm} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#fff', zIndex: 10 },
  headerRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  headerLabel: { fontSize: 15, fontWeight: '700', color: '#5f6368' },
  body: { flex: 1, backgroundColor: '#fff' },
  loading: {
    position: 'absolute',
    alignSelf: 'center',
    top: 12,
    backgroundColor: 'rgba(32,33,36,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loadingText: { color: '#fff', fontSize: 13 },
  cConfirm: { position: 'absolute', left: 16, right: 16, bottom: 0 },
});
