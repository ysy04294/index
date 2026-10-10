import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DESTINATION, ORIGIN, TEXT, type NoticeType } from '../config/scenario';

type Props = { type: NoticeType; index: number; total: number; onStart: () => void };

/** 타입 시작 화면: "A타입 시작" */
export default function TypeIntroScreen({ type, index, total, onStart }: Props) {
  const insets = useSafeAreaInsets();
  const T = TEXT.intro;
  return (
    <View style={[styles.root, { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.center}>
        <Text style={styles.progress}>{T.progress(index, total)}</Text>
        <Text style={styles.title}>{T.title(type)}</Text>
        <Text style={styles.body}>{T.body}</Text>
        <View style={styles.routeBox}>
          <Text style={styles.routeText}>🔵 {ORIGIN.name}</Text>
          <Text style={styles.routeDots}>⋮</Text>
          <Text style={styles.routeText}>📍 {DESTINATION.name}</Text>
        </View>
      </View>
      <Pressable onPress={onStart} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
        <Text style={styles.btnText}>{T.button(type)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progress: { fontSize: 15, fontWeight: '700', color: '#1a73e8' },
  title: { fontSize: 44, fontWeight: '800', color: '#202124', marginTop: 6 },
  body: { fontSize: 17, color: '#3c4043', textAlign: 'center', lineHeight: 26, marginTop: 20 },
  routeBox: { marginTop: 32, backgroundColor: '#f8f9fa', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, alignSelf: 'stretch' },
  routeText: { fontSize: 16, color: '#202124', fontWeight: '600' },
  routeDots: { fontSize: 16, color: '#9aa0a6', marginLeft: 6, marginVertical: 2 },
  btn: { height: 60, borderRadius: 16, backgroundColor: '#1a73e8', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
