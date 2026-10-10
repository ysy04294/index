
import type { NoticeType } from '../config/scenario';
import { loadText, saveText, shareFile } from './storage';

/** 타입 하나(A/B/C)를 체험한 기록 */
export type TypeRecord = {
  seq: number; // 진행 순서 1, 2, 3
  type: NoticeType;
  startTap?: number; // "X타입 시작" 탭
  noticeShown?: number; // 알림 등장
  noticeConfirmed?: number; // 알림 "확인"
  doneTap?: number; // "완료" 탭
  bCardSwipes: number; // B: 카드 넘긴 횟수
  bMaxCard: number; // B: 가장 멀리 본 카드 번호
  bSpeechTaps: number; // B: 발음 버튼 탭 횟수
  cView?: 'camera' | 'streetview'; // C: 알림 확인 시점의 위 화면
  restarts: number; // 진행자가 "처음부터"를 누른 횟수
  forcedNotice: boolean; // 진행자가 알림을 바로 띄웠는지
  skipped: boolean; // 진행자가 건너뛰었는지
  speed: number; // 이동 속도
  routeSource?: string; // 경로 출처 (routes / directions / fallback)
};

export type Session = {
  id: string;
  participantId: string;
  order: NoticeType[];
  startedAt: number;
  endedAt?: number;
  records: TypeRecord[];
};

function readAll(): Session[] {
  try {
    const text = loadText();
    return text ? (JSON.parse(text) as Session[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: Session[]) {
  saveText(JSON.stringify(list));
}

let sessions: Session[] = readAll();
let current: Session | null = null;

export function newRecord(seq: number, type: NoticeType): TypeRecord {
  return { seq, type, bCardSwipes: 0, bMaxCard: 1, bSpeechTaps: 0, restarts: 0, forcedNotice: false, skipped: false, speed: 1 };
}

export const logger = {
  startSession(participantId: string, order: NoticeType[]) {
    const now = Date.now();
    current = {
      id: `${now}`,
      participantId: participantId.trim() || 'unknown',
      order,
      startedAt: now,
      records: order.map((t, i) => newRecord(i + 1, t)),
    };
    sessions = [...sessions, current];
    writeAll(sessions);
  },

  get current() {
    return current;
  },

  /** 현재 세션의 seq번째 기록을 고침 */
  update(seq: number, patch: (r: TypeRecord) => Partial<TypeRecord>) {
    if (!current) return;
    current.records = current.records.map((r) => (r.seq === seq ? { ...r, ...patch(r) } : r));
    writeAll(sessions.map((s) => (s.id === current!.id ? current! : s)));
  },

  endSession() {
    if (!current) return;
    current.endedAt = Date.now();
    writeAll(sessions.map((s) => (s.id === current!.id ? current! : s)));
  },

  allSessions() {
    return sessions;
  },
};

// ───────── CSV ─────────
const pad = (n: number, w = 2) => String(n).padStart(w, '0');
function fmtTime(t?: number) {
  if (!t) return '';
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}
const diff = (a?: number, b?: number) => (a && b ? String(b - a) : '');
const esc = (v: string | number | boolean) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const HEADER = [
  'participant_id',
  'session_start',
  'order',
  'seq',
  'type',
  'start_tap',
  'notice_shown',
  'notice_confirmed',
  'done_tap',
  'start_to_notice_ms',
  'notice_to_confirm_ms',
  'confirm_to_done_ms',
  'start_to_done_ms',
  'b_card_swipes',
  'b_max_card',
  'b_speech_taps',
  'c_view',
  'restarts',
  'forced_notice',
  'skipped',
  'speed',
  'route_source',
];

export function toCsv(list: Session[]): string {
  const rows = [HEADER.join(',')];
  for (const s of list) {
    for (const r of s.records) {
      rows.push(
        [
          s.participantId,
          fmtTime(s.startedAt),
          s.order.join('-'),
          r.seq,
          r.type,
          fmtTime(r.startTap),
          fmtTime(r.noticeShown),
          fmtTime(r.noticeConfirmed),
          fmtTime(r.doneTap),
          diff(r.startTap, r.noticeShown),
          diff(r.noticeShown, r.noticeConfirmed),
          diff(r.noticeConfirmed, r.doneTap),
          diff(r.startTap, r.doneTap),
          r.type === 'B' ? r.bCardSwipes : '',
          r.type === 'B' ? r.bMaxCard : '',
          r.type === 'B' ? r.bSpeechTaps : '',
          r.type === 'C' ? (r.cView ?? '') : '',
          r.restarts,
          r.forcedNotice,
          r.skipped,
          r.speed,
          r.routeSource ?? '',
        ]
          .map(esc)
          .join(','),
      );
    }
  }
  // 엑셀에서 한글이 깨지지 않도록 BOM 추가
  return '﻿' + rows.join('\r\n') + '\r\n';
}

const safeName = (s: string) => s.replace(/[\\/:*?"<>|\s]+/g, '_') || 'unknown';

/** CSV 파일을 만들어 공유 시트(앱·휴대폰) 또는 다운로드(PC)로 내보냄 */
export async function shareCsv(list: Session[], baseName: string) {
  const d = new Date();
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  await shareFile(`${safeName(baseName)}_${date}.csv`, toCsv(list), 'text/csv');
}
