import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SIMULATION, TEXT } from '../config/scenario';
import type { CView, FlowState } from '../state/testFlow';

type Props = {
  visible: boolean;
  state: FlowState;
  onClose: () => void;
  onSpeed: (speed: number) => void;
  onRestartType: () => void;
  onForceNotice: () => void;
  onSkipType: () => void;
  onCView: (view: CView) => void;
  onHome: () => void;
};

/** 숨은 진행자 메뉴 (화면 왼쪽 위 2초 길게 누르기) */
export default function ModeratorMenu(p: Props) {
  const T = TEXT.moderator;
  const inTest = p.state.phase !== 'end';
  const act = (fn: () => void) => () => {
    fn();
    p.onClose();
  };

  return (
    <Modal visible={p.visible} transparent animationType="fade" onRequestClose={p.onClose} supportedOrientations={['portrait']}>
      <Pressable style={styles.backdrop} onPress={p.onClose}>
        <Pressable style={styles.panel} onPress={() => {}}>
          <ScrollView bounces={false}>
            <Text style={styles.title}>{T.title}</Text>
            <Text style={styles.meta}>
              {p.state.order.join('-')} · {p.state.phase}
              {inTest ? ` · ${p.state.order[p.state.typeIndex]}타입` : ''}
            </Text>

            <Text style={styles.section}>{T.speed}</Text>
            <View style={styles.row}>
              {SIMULATION.speedOptions.map((s) => (
                <Seg key={s} label={`${s}x`} on={p.state.speed === s} onPress={() => p.onSpeed(s)} />
              ))}
            </View>

            <Text style={styles.section}>{T.cView}</Text>
            <View style={styles.row}>
              <Seg label={T.camera} on={p.state.cViewOverride === 'camera'} onPress={() => p.onCView('camera')} />
              <Seg label={T.streetView} on={p.state.cViewOverride === 'streetview'} onPress={() => p.onCView('streetview')} />
            </View>

            <Item label={T.restartType} disabled={!inTest} onPress={act(p.onRestartType)} />
            <Item label={T.forceNotice} disabled={p.state.phase !== 'navigating'} onPress={act(p.onForceNotice)} />
            <Item label={T.skipType} disabled={!inTest} onPress={act(p.onSkipType)} />
            <Item label={T.home} danger onPress={act(p.onHome)} />
            <Item label={T.close} onPress={p.onClose} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Seg({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.seg, on && styles.segOn]}>
      <Text style={[styles.segText, on && styles.segTextOn]}>{label}</Text>
    </Pressable>
  );
}

function Item({ label, onPress, disabled, danger }: { label: string; onPress: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.item, pressed && !disabled && { backgroundColor: '#f1f3f4' }]}
    >
      <Text style={[styles.itemText, danger && { color: '#d93025' }, disabled && { color: '#bdc1c6' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 },
  panel: { backgroundColor: '#fff', borderRadius: 18, padding: 18, maxHeight: '85%' },
  title: { fontSize: 20, fontWeight: '800', color: '#202124' },
  meta: { fontSize: 13, color: '#80868b', marginTop: 4 },
  section: { fontSize: 13, fontWeight: '700', color: '#5f6368', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  seg: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dadce0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segOn: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  segText: { fontSize: 15, fontWeight: '600', color: '#3c4043' },
  segTextOn: { color: '#fff' },
  item: { height: 50, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e8eaed', marginTop: 4 },
  itemText: { fontSize: 16, fontWeight: '600', color: '#1a73e8' },
});
