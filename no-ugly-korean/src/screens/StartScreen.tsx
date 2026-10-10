import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ORDER_OPTIONS, TEXT, type NoticeType } from '../config/scenario';

type Props = { onBegin: (participantId: string, order: NoticeType[]) => void };

/** 시작 화면: 참여자 ID + 순서 선택 */
export default function StartScreen({ onBegin }: Props) {
  const insets = useSafeAreaInsets();
  const [id, setId] = useState('');
  const [orderIdx, setOrderIdx] = useState(0);
  const T = TEXT.start;
  const canStart = id.trim().length > 0;

  const content = (
      <KeyboardAvoidingView behavior="padding" style={[styles.root, { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 20 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{T.title}</Text>
          <Text style={styles.subtitle}>{T.subtitle}</Text>

          <Text style={styles.label}>{T.idLabel}</Text>
          <TextInput
            value={id}
            onChangeText={setId}
            placeholder={T.idPlaceholder}
            placeholderTextColor="#9aa0a6"
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            style={styles.input}
          />

          <Text style={styles.label}>{T.orderLabel}</Text>
          <View style={styles.orders}>
            {ORDER_OPTIONS.map((o, i) => (
              <Pressable key={i} onPress={() => setOrderIdx(i)} style={[styles.order, i === orderIdx && styles.orderOn]}>
                <Text style={[styles.orderText, i === orderIdx && styles.orderTextOn]}>{o.join(' - ')}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          disabled={!canStart}
          onPress={() => onBegin(id.trim(), ORDER_OPTIONS[orderIdx])}
          style={({ pressed }) => [styles.start, !canStart && styles.startOff, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.startText}>{T.startButton}</Text>
        </Pressable>
        <Text style={styles.hint}>{T.hint}</Text>
      </KeyboardAvoidingView>
  );

  // 앱: 빈 곳을 누르면 키보드 닫기. 웹에서는 이 감싸기가 입력칸 클릭까지 막아서 쓰지 않음
  if (Platform.OS === 'web') return content;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  title: { fontSize: 30, fontWeight: '800', color: '#202124' },
  subtitle: { fontSize: 16, color: '#5f6368', marginTop: 4, marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '700', color: '#5f6368', marginBottom: 8, marginTop: 16 },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dadce0',
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#202124',
  },
  orders: { flexDirection: 'row', gap: 8 },
  order: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dadce0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderOn: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  orderText: { fontSize: 17, fontWeight: '700', color: '#3c4043' },
  orderTextOn: { color: '#fff' },
  start: { height: 56, borderRadius: 14, backgroundColor: '#1a73e8', alignItems: 'center', justifyContent: 'center' },
  startOff: { backgroundColor: '#bdc1c6' },
  startText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hint: { textAlign: 'center', fontSize: 12, color: '#9aa0a6', marginTop: 12 },
});
