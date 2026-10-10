import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { AI_LABEL, CONFIRM_TEXT } from '../../config/scenario';

/** "✦ AI 안내 · 이 가게 리뷰 128개 기반" 라벨 */
export function AiLabel({ dark = false }: { dark?: boolean }) {
  return (
    <View style={[styles.aiChip, dark && styles.aiChipDark]}>
      <Text style={[styles.aiText, dark && styles.aiTextDark]}>{AI_LABEL.text(AI_LABEL.reviewCount)}</Text>
    </View>
  );
}

/** 엄지로 누르기 쉬운 "확인" 버튼 (높이 52pt) */
export function ConfirmButton({ onPress, style }: { onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.confirm, pressed && { opacity: 0.8 }, style]}
    >
      <Text style={styles.confirmText}>{CONFIRM_TEXT}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  aiChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3e8fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  aiChipDark: { backgroundColor: 'rgba(255,255,255,0.18)' },
  aiText: { fontSize: 12, fontWeight: '600', color: '#7b1fa2' },
  aiTextDark: { color: '#fff' },
  confirm: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
