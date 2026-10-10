import { useEffect } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { NOTICE_C, STREET_VIEW } from '../../config/scenario';
import { GOOGLE_MAPS_API_KEY } from '../../config/env';
import HtmlFrame from '../HtmlFrame';
import { buildStreetViewHtml } from '../map.html.ts';
import type { CView } from '../../state/testFlow';
import { AiLabel } from './common';

const streetViewHtml = buildStreetViewHtml({ apiKey: GOOGLE_MAPS_API_KEY, ...STREET_VIEW });

type Props = {
  style?: StyleProp<ViewStyle>;
  /** 진행자가 고른 화면 (없으면 카메라 권한에 따라 자동) */
  override: CView | null;
  /** 실제로 보이는 화면이 정해질 때마다 */
  onViewResolved: (view: CView) => void;
  /** AR 라벨을 보여 줄지 (알림 확인 후에도 계속 보임) */
  showLabels: boolean;
};

/** C타입 위 화면: 후면 카메라(또는 Street View) + 떠 있는 AR 라벨 */
export default function NoticeC({ style, override, onViewResolved, showLabels }: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.status === 'undetermined' && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const pending = !permission || permission.status === 'undetermined';
  const auto: CView = permission?.granted ? 'camera' : 'streetview';
  const view: CView = override ?? auto;
  const showCamera = view === 'camera' && permission?.granted;

  useEffect(() => {
    if (!pending) onViewResolved(showCamera ? 'camera' : 'streetview');
  }, [pending, showCamera, onViewResolved]);

  return (
    <Animated.View entering={SlideInUp.duration(450)} style={[styles.container, style]}>
      {pending && override !== 'streetview' ? (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
      ) : showCamera ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" mirror={false} animateShutter={false} />
      ) : (
        <HtmlFrame style={StyleSheet.absoluteFill} html={streetViewHtml} />
      )}

      {/* 좌측 상단 Live View 칩, 우측 상단 닫기(동작 없음) */}
      <View style={styles.topRow} pointerEvents="none">
        <View style={styles.chip}>
          <Text style={styles.chipText}>◉ {NOTICE_C.liveViewChip}</Text>
        </View>
        <View style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </View>
      </View>

      {showLabels && (
        <Animated.View entering={FadeIn.delay(350).duration(500)} style={StyleSheet.absoluteFill} pointerEvents="none">
          <ArLabel x={NOTICE_C.main.x} y={NOTICE_C.main.y} delay={0} big>
            <AiLabel dark />
            <Text style={styles.mainText}>{NOTICE_C.main.text}</Text>
          </ArLabel>
          {NOTICE_C.subs.map((s, i) => (
            <ArLabel key={i} x={s.x} y={s.y} delay={400 + i * 500}>
              <Text style={styles.subText}>{s.text}</Text>
            </ArLabel>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

/** 반투명 말풍선 + 꼬리 + 가리키는 점. 위아래로 천천히 떠다님 */
function ArLabel({
  x,
  y,
  delay,
  big = false,
  children,
}: {
  x: number;
  y: number;
  delay: number;
  big?: boolean;
  children: React.ReactNode;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
  }, [delay, t]);
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: t.value }] }));

  return (
    // 화면 너비만큼의 상자를 x% 기준으로 옮겨 말풍선을 가운데 정렬
    <View style={[styles.anchor, { left: `${x - 50}%`, top: `${y}%` }]}>
      <Animated.View style={[styles.labelWrap, floatStyle]}>
        <View style={[styles.bubble, big && styles.bubbleBig]}>{children}</View>
        <View style={[styles.tail, big && styles.tailBig]} />
        <View style={styles.stem} />
        <View style={styles.pin} />
      </Animated.View>
    </View>
  );
}

const BUBBLE = 'rgba(32,33,36,0.72)';

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#202124' },
  placeholder: { backgroundColor: '#202124' },
  topRow: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: { backgroundColor: 'rgba(32,33,36,0.75)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(32,33,36,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  anchor: { position: 'absolute', width: '100%', alignItems: 'center' },
  labelWrap: { alignItems: 'center' },
  bubble: {
    backgroundColor: BUBBLE,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  bubbleBig: { paddingHorizontal: 14, paddingVertical: 10, gap: 6, borderColor: 'rgba(138,180,248,0.7)' },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BUBBLE,
  },
  tailBig: { borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 11 },
  stem: { width: 2, height: 16, backgroundColor: 'rgba(255,255,255,0.8)' },
  pin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1a73e8',
    borderWidth: 3,
    borderColor: '#fff',
  },
  mainText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  subText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
