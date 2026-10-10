import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DESTINATION, SIMULATION, TEXT } from '../config/scenario';

type Props = {
  remainingMeters: number;
};

function etaString(minutes: number) {
  const d = new Date(Date.now() + minutes * 60_000);
  const h = d.getHours();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 하단 시트: "4분 · 300m · 도착 예정 시간" + 목적지 */
export default function NavBottomSheet({ remainingMeters }: Props) {
  const insets = useSafeAreaInsets();
  const minutes = Math.max(1, Math.ceil(remainingMeters / SIMULATION.walkingSpeedMps / 60));

  return (
    <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.handle} />
      <View style={styles.row}>
        <Text style={styles.minutes}>{TEXT.nav.minutes(minutes)}</Text>
        <Text style={styles.walk}> 🚶 {TEXT.nav.walking}</Text>
      </View>
      <Text style={styles.meta}>
        {TEXT.nav.meters(Math.round(remainingMeters / 10) * 10)} · {TEXT.nav.eta(etaString(minutes))}
      </Text>
      <Text style={styles.dest} numberOfLines={1}>
        📍 {DESTINATION.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handle: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: '#dadce0', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'baseline' },
  minutes: { fontSize: 26, fontWeight: '700', color: '#188038' },
  walk: { fontSize: 15, color: '#5f6368' },
  meta: { fontSize: 16, color: '#3c4043', marginTop: 2 },
  dest: { fontSize: 15, color: '#5f6368', marginTop: 8 },
});
