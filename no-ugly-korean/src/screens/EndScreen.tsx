import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TEXT } from '../config/scenario';
import { logger, shareCsv } from '../utils/logger';

type Props = { onHome: () => void };

const sec = (a?: number, b?: number) => (a && b ? `${((b - a) / 1000).toFixed(1)}초` : '-');

/** 종료 화면: "테스트가 끝났습니다" + 기록 내보내기 */
export default function EndScreen({ onHome }: Props) {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const session = logger.current;
  const T = TEXT.end;

  const exportCsv = async () => {
    if (busy || !session) return;
    setBusy(true);
    try {
      await shareCsv([session], session.participantId);
    } catch (e) {
      Alert.alert('내보내기 실패', String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 20 }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.title}>{T.title}</Text>
        <Text style={styles.body}>{T.body}</Text>

        {session && (
          <View style={styles.table}>
            {session.records.map((r) => (
              <View key={r.seq} style={styles.tr}>
                <Text style={styles.type}>{r.type}</Text>
                <Text style={styles.cell}>알림→확인 {sec(r.noticeShown, r.noticeConfirmed)}</Text>
                <Text style={styles.cell}>전체 {sec(r.startTap, r.doneTap)}</Text>
                {r.skipped && <Text style={styles.skip}>건너뜀</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable onPress={exportCsv} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}>
        <Text style={styles.primaryText}>{T.exportButton}</Text>
      </Pressable>
      <Pressable onPress={onHome} style={styles.secondary}>
        <Text style={[styles.secondaryText, { color: '#5f6368' }]}>{T.restart}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  title: { fontSize: 30, fontWeight: '800', color: '#202124' },
  body: { fontSize: 17, color: '#5f6368', marginTop: 8 },
  table: { marginTop: 32, backgroundColor: '#f8f9fa', borderRadius: 16, padding: 16 },
  tableTitle: { fontSize: 14, fontWeight: '700', color: '#5f6368', marginBottom: 8 },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  type: { fontSize: 18, fontWeight: '800', color: '#1a73e8', width: 24 },
  cell: { fontSize: 14, color: '#3c4043' },
  skip: { fontSize: 12, color: '#d93025' },
  primary: { height: 56, borderRadius: 14, backgroundColor: '#1a73e8', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  secondary: { height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  secondaryText: { color: '#1a73e8', fontSize: 16, fontWeight: '600' },
});
