import { StyleSheet, Text, View } from 'react-native';

import { NAV_STEPS, TEXT, type Maneuver } from '../config/scenario';

const ARROWS: Record<Maneuver, string> = {
  straight: '↑',
  right: '↱',
  left: '↰',
  arrive: '⚑',
};

type Props = {
  /** 0~1 진행률 */
  progress: number;
  /** 전체 경로 길이(m) */
  totalMeters: number;
};

/** 구글 지도 길찾기의 상단 초록 안내 배너 */
export default function NavTopBanner({ progress, totalMeters }: Props) {
  let i = 0;
  while (i < NAV_STEPS.length - 1 && progress >= NAV_STEPS[i + 1].from) i++;
  const step = NAV_STEPS[i];
  const nextFrom = NAV_STEPS[i + 1]?.from ?? 1;
  const meters = Math.max(0, (nextFrom - progress) * totalMeters);
  const showDistance = step.maneuver !== 'arrive';

  return (
    <View style={styles.banner}>
      <View style={styles.arrowBox}>
        <Text style={styles.arrow}>{ARROWS[step.maneuver]}</Text>
        {showDistance && <Text style={styles.distance}>{TEXT.nav.meters(Math.round(meters / 5) * 5)}</Text>}
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text} numberOfLines={2}>
          {step.text}
        </Text>
        {step.sub ? (
          <Text style={styles.sub} numberOfLines={1}>
            {step.sub}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d7a4a',
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 6,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 84,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  arrowBox: { width: 64, alignItems: 'center', marginRight: 10 },
  arrow: { color: '#fff', fontSize: 40, fontWeight: '700', lineHeight: 44 },
  distance: { color: '#fff', fontSize: 15, fontWeight: '600', marginTop: 2 },
  textBox: { flex: 1 },
  text: { color: '#fff', fontSize: 21, fontWeight: '700', lineHeight: 27 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 3 },
});
