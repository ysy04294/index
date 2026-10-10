import { Pressable, StyleSheet, Text } from 'react-native';

import { TEXT } from '../config/scenario';

type Props = { enabled: boolean; onPress: () => void };

/** 화면 상단 우측 "완료" 버튼 — 알림을 확인하기 전에는 회색(비활성) */
export default function DoneButton({ enabled, onPress }: Props) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      style={({ pressed }) => [styles.btn, enabled ? styles.on : styles.off, pressed && enabled && styles.pressed]}
    >
      <Text style={[styles.text, enabled ? styles.textOn : styles.textOff]}>{TEXT.nav.done}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minWidth: 72, height: 36, paddingHorizontal: 16, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: '#1a73e8' },
  off: { backgroundColor: '#e0e0e0' },
  pressed: { opacity: 0.75 },
  text: { fontSize: 16, fontWeight: '700' },
  textOn: { color: '#fff' },
  textOff: { color: '#9e9e9e' },
});
