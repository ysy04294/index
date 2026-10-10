import { useReducer } from 'react';

import { ORDER_OPTIONS, type NoticeType } from '../config/scenario';

/**
 * 테스트 진행 상태 머신
 *
 *   start ─▶ intro ─▶ navigating ─▶ noticeShown ─▶ confirmed ─▶ (다음 타입 intro | end)
 *
 * - start      : 참여자 ID / 순서 입력
 * - intro      : "X타입 시작" 화면
 * - navigating : 파란 점이 이동 중
 * - noticeShown: 가게 30m 전, AI 알림이 떠 있음 ("완료" 비활성)
 * - confirmed  : 알림 "확인" 완료 ("완료" 활성)
 * - end        : 종료 화면
 */
export type Phase = 'start' | 'intro' | 'navigating' | 'noticeShown' | 'confirmed' | 'end';
export type CView = 'camera' | 'streetview';

export type FlowState = {
  phase: Phase;
  participantId: string;
  order: NoticeType[];
  typeIndex: number;
  speed: number;
  /** C타입 위 화면: 자동(권한에 따라) 또는 진행자가 고른 값 */
  cViewOverride: CView | null;
  /** 같은 타입을 처음부터 다시 시작할 때마다 증가 → 길찾기 화면을 새로 만듦 */
  runId: number;
  /** 진행자가 "알림 바로 띄우기"를 누를 때마다 증가 */
  forceNoticeToken: number;
};

export type FlowAction =
  | { type: 'begin'; participantId: string; order: NoticeType[] }
  | { type: 'startType' }
  | { type: 'noticeShown' }
  | { type: 'confirm' }
  | { type: 'done' }
  | { type: 'restartType' }
  | { type: 'forceNotice' }
  | { type: 'skipType' }
  | { type: 'setSpeed'; speed: number }
  | { type: 'setCView'; view: CView }
  | { type: 'home' };

const initialState: FlowState = {
  phase: 'start',
  participantId: '',
  order: ORDER_OPTIONS[0],
  typeIndex: 0,
  speed: 1,
  cViewOverride: null,
  runId: 0,
  forceNoticeToken: 0,
};

function nextType(s: FlowState): FlowState {
  const last = s.typeIndex >= s.order.length - 1;
  return last ? { ...s, phase: 'end' } : { ...s, phase: 'intro', typeIndex: s.typeIndex + 1 };
}

function reducer(s: FlowState, a: FlowAction): FlowState {
  switch (a.type) {
    case 'begin':
      return { ...initialState, speed: s.speed, phase: 'intro', participantId: a.participantId, order: a.order };
    case 'startType':
      return s.phase === 'intro' ? { ...s, phase: 'navigating', runId: s.runId + 1 } : s;
    case 'noticeShown':
      return s.phase === 'navigating' ? { ...s, phase: 'noticeShown' } : s;
    case 'confirm':
      return s.phase === 'noticeShown' ? { ...s, phase: 'confirmed' } : s;
    case 'done':
      // 알림을 확인하기 전에는 "완료"가 동작하지 않음
      return s.phase === 'confirmed' ? nextType(s) : s;
    case 'restartType':
      return s.phase === 'start' || s.phase === 'end' ? s : { ...s, phase: 'navigating', runId: s.runId + 1 };
    case 'forceNotice':
      return s.phase === 'navigating' ? { ...s, forceNoticeToken: s.forceNoticeToken + 1 } : s;
    case 'skipType':
      return s.phase === 'start' || s.phase === 'end' ? s : nextType(s);
    case 'setSpeed':
      return { ...s, speed: a.speed };
    case 'setCView':
      return { ...s, cViewOverride: a.view };
    case 'home':
      return { ...initialState, speed: s.speed };
  }
}

export function useTestFlow() {
  return useReducer(reducer, initialState);
}

export const currentType = (s: FlowState): NoticeType => s.order[s.typeIndex];
