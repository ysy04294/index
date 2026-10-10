import type { ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { TEXT } from '../config/scenario';

const PHONE_W = 390;
const PHONE_H = 844;
const BEZEL = 12;

/**
 * 웹 버전 화면 틀.
 * - 휴대폰(좁은 화면): 전체 화면 그대로
 * - PC(넓은 화면): 가운데 아이폰 모양 프레임 안에 앱을 보여 줌
 */
export default function WebShell({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 700 && height >= 560;
  if (!isDesktop) return <View style={styles.full}>{children}</View>;

  // 창 높이에 맞춰 프레임 크기 조절
  const scale = Math.min(1, (height - 48) / (PHONE_H + BEZEL * 2));
  const w = Math.round(PHONE_W * scale);
  const h = Math.round(PHONE_H * scale);

  return (
    <View style={styles.desk}>
      <View style={[styles.phone, { width: w + BEZEL * 2, height: h + BEZEL * 2 }]}>
        <View style={[styles.screen, { width: w, height: h }]}>
          <FakeStatusBar />
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      </View>
      {width >= 1100 && (
        <View style={styles.side}>
          <Text style={styles.sideTitle}>{TEXT.start.title}</Text>
          <Text style={styles.sideText}>{TEXT.start.subtitle}</Text>
          <Text style={styles.sideHint}>📱 휴대폰으로 이 주소를 열면 전체 화면 앱으로 보여요</Text>
          <Text style={styles.sideHint}>🛠 진행자 메뉴: 화면 왼쪽 위 2초 누르기 또는 M 키</Text>
        </View>
      )}
    </View>
  );
}

function FakeStatusBar() {
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  return (
    <View style={styles.status}>
      <Text style={styles.statusTime}>{time}</Text>
      <View style={styles.island} />
      <Text style={styles.statusIcons}>5G ▮▮▮</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, height: '100%', backgroundColor: '#fff' },
  desk: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#1f2124',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 56,
  },
  phone: {
    backgroundColor: '#0b0b0c',
    borderRadius: 56,
    padding: BEZEL,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
  },
  screen: { borderRadius: 44, overflow: 'hidden', backgroundColor: '#fff' },
  status: {
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  statusTime: { fontSize: 16, fontWeight: '700', color: '#000', width: 70 },
  island: { width: 120, height: 34, borderRadius: 17, backgroundColor: '#000' },
  statusIcons: { fontSize: 13, fontWeight: '700', color: '#000', width: 70, textAlign: 'right' },
  side: { maxWidth: 300, gap: 10 },
  sideTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  sideText: { fontSize: 16, color: '#bdc1c6', marginBottom: 12 },
  sideHint: { fontSize: 14, color: '#e8eaed', lineHeight: 21 },
});
