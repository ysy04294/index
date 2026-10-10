import { useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

import { NOTICE_B } from '../../config/scenario';
import { AiLabel, ConfirmButton } from './common';

type Props = {
  onConfirm: () => void;
  /** 카드를 넘길 때마다 (새 페이지 번호, 1부터) */
  onCardChange: (page: number) => void;
  onSpeak: (text: string) => void;
};

/** B타입 — 화면 절반까지 올라오는 하단 시트 + 좌우로 넘기는 카드 4장 */
export default function NoticeB({ onConfirm, onCardChange, onSpeak }: Props) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  const cards = NOTICE_B.cards;
  const last = page === cards.length - 1;
  const showArrows = Platform.OS === 'web';

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== pageRef.current) {
      pageRef.current = p;
      setPage(p);
      onCardChange(p + 1);
    }
  };

  // PC(마우스)에서는 끌어서 넘길 수 없으므로 화살표 버튼으로 넘김
  const goTo = (p: number) => scrollRef.current?.scrollTo({ x: p * width, animated: true });

  const speak = (text: string) => {
    onSpeak(text);
    Speech.stop();
    Speech.speak(text, { language: NOTICE_B.speechLanguage, rate: NOTICE_B.speechRate });
  };

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      exiting={SlideOutDown}
      style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 14) }]}
    >
      <View style={styles.handle} />
      <View style={styles.header}>
        <AiLabel />
        <Text style={styles.counter}>
          {page + 1} / {cards.length}
        </Text>
      </View>

      <View style={styles.pager} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            onScroll={onScroll}
            scrollEventThrottle={32}
            bounces={false}
          >
            {cards.map((c, i) => (
              <View key={i} style={[styles.page, { width }]}>
                <View style={styles.card}>
                  <Text style={styles.step}>STEP {i + 1}</Text>
                  <Text style={styles.title}>{c.title}</Text>
                  <Text style={styles.body}>{c.body}</Text>
                  {c.phrase && (
                    <View style={styles.phraseBox}>
                      <Text style={styles.phraseIt}>“{c.phrase.it}”</Text>
                      <Text style={styles.phraseKo}>{c.phrase.ko}</Text>
                      <Pressable
                        onPress={() => speak(c.phrase!.it)}
                        style={({ pressed }) => [styles.speakBtn, pressed && { opacity: 0.7 }]}
                        accessibilityRole="button"
                      >
                        <Text style={styles.speakText}>{NOTICE_B.speakLabel}</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.dotsRow}>
        {showArrows && (
          <Pressable onPress={() => goTo(page - 1)} disabled={page === 0} style={styles.arrow} hitSlop={8}>
            <Text style={[styles.arrowText, page === 0 && styles.arrowOff]}>‹</Text>
          </Pressable>
        )}
        <View style={styles.dots}>
          {cards.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotOn]} />
          ))}
        </View>
        {showArrows && (
          <Pressable onPress={() => goTo(page + 1)} disabled={last} style={styles.arrow} hitSlop={8}>
            <Text style={[styles.arrowText, last && styles.arrowOff]}>›</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        {last ? <ConfirmButton onPress={onConfirm} /> : <Text style={styles.swipeHint}>옆으로 넘겨 보세요 ›</Text>}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  handle: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: '#dadce0', marginBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  counter: { fontSize: 13, color: '#80868b', fontWeight: '600' },
  pager: { flex: 1, marginTop: 10 },
  page: { paddingHorizontal: 16 },
  card: { flex: 1, backgroundColor: '#f8f9fa', borderRadius: 18, padding: 18 },
  step: { fontSize: 12, fontWeight: '700', color: '#1a73e8', letterSpacing: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#202124', marginTop: 6, lineHeight: 28 },
  body: { fontSize: 16, color: '#3c4043', marginTop: 8, lineHeight: 23 },
  phraseBox: { marginTop: 12, backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e8eaed' },
  phraseIt: { fontSize: 19, fontWeight: '700', color: '#202124' },
  phraseKo: { fontSize: 14, color: '#5f6368', marginTop: 2 },
  speakBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
  },
  speakText: { fontSize: 15, fontWeight: '700', color: '#1967d2' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginVertical: 10 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  arrow: { width: 40, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#f1f3f4' },
  arrowText: { fontSize: 22, fontWeight: '700', color: '#1a73e8', lineHeight: 24 },
  arrowOff: { color: '#dadce0' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#dadce0' },
  dotOn: { backgroundColor: '#1a73e8' },
  footer: { paddingHorizontal: 16, height: 52, justifyContent: 'center' },
  swipeHint: { textAlign: 'center', fontSize: 15, color: '#80868b' },
});
