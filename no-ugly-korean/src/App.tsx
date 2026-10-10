import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Camera } from 'expo-camera';

import type { NoticeType } from './config/scenario';
import { currentType, useTestFlow, type CView } from './state/testFlow';
import { logger } from './utils/logger';
import StartScreen from './screens/StartScreen';
import TypeIntroScreen from './screens/TypeIntroScreen';
import NavScreen from './screens/NavScreen';
import EndScreen from './screens/EndScreen';
import ModeratorMenu from './components/ModeratorMenu';
import WebShell from './components/WebShell';

export default function App() {
  return (
    <WebShell>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Root />
      </SafeAreaProvider>
    </WebShell>
  );
}

function Root() {
  useKeepAwake(); // 테스트 중 화면이 꺼지지 않게
  const insets = useSafeAreaInsets();
  const [state, dispatch] = useTestFlow();
  const [menuOpen, setMenuOpen] = useState(false);
  const seq = state.typeIndex + 1;
  const isLast = state.typeIndex >= state.order.length - 1;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    // 안드로이드 뒤로가기 막기 (iOS는 화면 스택이 없어서 스와이프 뒤로가기가 없음)
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    // 웹(PC): M 키로도 진행자 메뉴 열기
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if ((e.key === 'm' || e.key === 'M') && tag !== 'INPUT' && tag !== 'TEXTAREA') setMenuOpen(true);
    };
    if (Platform.OS === 'web') window.addEventListener('keydown', onKey);
    return () => {
      sub.remove();
      if (Platform.OS === 'web') window.removeEventListener('keydown', onKey);
    };
  }, []);

  // ───────── 기록과 함께 상태 전환 ─────────
  const begin = (participantId: string, order: NoticeType[]) => {
    logger.startSession(participantId, order);
    dispatch({ type: 'begin', participantId, order });
    // C타입 도중에 권한 팝업이 뜨지 않도록 미리 요청 (웹은 C타입에서 요청)
    if (Platform.OS === 'web') return;
    Camera.getCameraPermissionsAsync()
      .then((p) => (!p.granted && p.canAskAgain ? Camera.requestCameraPermissionsAsync() : p))
      .catch(() => {});
  };

  const startType = () => {
    logger.update(seq, () => ({ startTap: Date.now(), speed: state.speed }));
    dispatch({ type: 'startType' });
  };

  const onRouteReady = useCallback((source: string) => logger.update(seq, () => ({ routeSource: source })), [seq]);

  const onNoticeShown = useCallback(
    (forced: boolean) => {
      logger.update(seq, (r) => ({ noticeShown: Date.now(), forcedNotice: r.forcedNotice || forced }));
      dispatch({ type: 'noticeShown' });
    },
    [seq, dispatch],
  );

  const onConfirm = useCallback(() => {
    logger.update(seq, () => ({ noticeConfirmed: Date.now() }));
    dispatch({ type: 'confirm' });
  }, [seq, dispatch]);

  const onDone = useCallback(() => {
    logger.update(seq, () => ({ doneTap: Date.now() }));
    if (isLast) logger.endSession();
    dispatch({ type: 'done' });
  }, [seq, isLast, dispatch]);

  const onBCard = useCallback(
    (page: number) => logger.update(seq, (r) => ({ bCardSwipes: r.bCardSwipes + 1, bMaxCard: Math.max(r.bMaxCard, page) })),
    [seq],
  );
  const onBSpeak = useCallback(() => logger.update(seq, (r) => ({ bSpeechTaps: r.bSpeechTaps + 1 })), [seq]);
  const onCView = useCallback((view: CView) => logger.update(seq, () => ({ cView: view })), [seq]);

  // ───────── 진행자 메뉴 ─────────
  const restartType = () => {
    logger.update(seq, (r) => ({
      restarts: r.restarts + 1,
      startTap: Date.now(),
      noticeShown: undefined,
      noticeConfirmed: undefined,
      doneTap: undefined,
      forcedNotice: false,
    }));
    dispatch({ type: 'restartType' });
  };
  const skipType = () => {
    logger.update(seq, () => ({ skipped: true }));
    if (isLast) logger.endSession();
    dispatch({ type: 'skipType' });
  };
  const setSpeed = (speed: number) => {
    dispatch({ type: 'setSpeed', speed });
    if (state.phase === 'navigating') logger.update(seq, () => ({ speed }));
  };

  const type = currentType(state);

  return (
    <View style={styles.root}>
      {state.phase === 'start' && <StartScreen onBegin={begin} />}
      {state.phase === 'intro' && (
        <TypeIntroScreen key={`intro-${seq}`} type={type} index={state.typeIndex} total={state.order.length} onStart={startType} />
      )}
      {(state.phase === 'navigating' || state.phase === 'noticeShown' || state.phase === 'confirmed') && (
        <NavScreen
          key={`nav-${state.runId}`}
          type={type}
          phase={state.phase}
          speed={state.speed}
          cViewOverride={state.cViewOverride}
          forceNoticeToken={state.forceNoticeToken}
          onRouteReady={onRouteReady}
          onNoticeShown={onNoticeShown}
          onConfirm={onConfirm}
          onDone={onDone}
          onBCard={onBCard}
          onBSpeak={onBSpeak}
          onCView={onCView}
        />
      )}
      {state.phase === 'end' && <EndScreen onHome={() => dispatch({ type: 'home' })} />}

      {/* 숨은 진행자 메뉴: 화면 왼쪽 위를 2초간 길게 누르기 */}
      <Pressable
        style={[styles.secret, { top: insets.top }]}
        delayLongPress={2000}
        onLongPress={() => setMenuOpen(true)}
        accessible={false}
      />
      <ModeratorMenu
        visible={menuOpen}
        state={state}
        onClose={() => setMenuOpen(false)}
        onSpeed={setSpeed}
        onRestartType={restartType}
        onForceNotice={() => dispatch({ type: 'forceNotice' })}
        onSkipType={skipType}
        onCView={(view) => dispatch({ type: 'setCView', view })}
        onHome={() => dispatch({ type: 'home' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  secret: { position: 'absolute', left: 0, width: 96, height: 56 },
});
