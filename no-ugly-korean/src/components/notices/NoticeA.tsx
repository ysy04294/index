import { StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInUp, FadeOut } from 'react-native-reanimated';

import { NOTICE_A } from '../../config/scenario';
import { AiLabel, ConfirmButton } from './common';

/** A타입 — 지도 위 상단(초록 배너 바로 아래)에 떠 있는 한 줄 카드 */
export default function NoticeA({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Animated.View entering={SlideInUp.springify().damping(16)} exiting={FadeOut} style={styles.card}>
      <AiLabel />
      <View style={styles.row}>
        <Text style={styles.emoji}>{NOTICE_A.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{NOTICE_A.title}</Text>
          <Text style={styles.body}>{NOTICE_A.body}</Text>
        </View>
      </View>
      <ConfirmButton onPress={onConfirm} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 34 },
  title: { fontSize: 18, fontWeight: '700', color: '#202124', lineHeight: 24 },
  body: { fontSize: 15, color: '#5f6368', marginTop: 2 },
});
