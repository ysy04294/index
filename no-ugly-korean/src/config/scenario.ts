/**
 * 시나리오 설정 — 좌표, 경로, 화면 문구를 모두 여기서 고칩니다.
 * 코드를 건드리지 않고 이 파일만 수정해도 테스트 내용을 바꿀 수 있어요.
 */

export type LatLng = { lat: number; lng: number };
export type NoticeType = 'A' | 'B' | 'C';

// ─────────────────────────────────────────────
// 1. 장소 (근사 좌표 — 지도에서 확인 후 수정하세요)
// ─────────────────────────────────────────────
export const ORIGIN: LatLng & { name: string } = {
  name: 'Piazza Navona',
  lat: 41.8992,
  lng: 12.4731,
};

export const DESTINATION: LatLng & { name: string; address: string } = {
  name: "Sant'Eustachio Il Caffè",
  address: 'Piazza di S. Eustachio 82, Roma',
  lat: 41.8982,
  lng: 12.4753,
};

/**
 * 경로를 받아 오지 못할 때 쓰는 도보 경로 (출발지 → 도착지 순서).
 * Piazza Navona → Corsia Agonale → Corso del Rinascimento → Via dei Canestrari → Piazza di S. Eustachio
 */
export const FALLBACK_ROUTE: LatLng[] = [
  { lat: 41.8992, lng: 12.4731 },
  { lat: 41.89915, lng: 12.47335 },
  { lat: 41.89912, lng: 12.47375 },
  { lat: 41.89908, lng: 12.47425 },
  { lat: 41.8987, lng: 12.4744 },
  { lat: 41.8985, lng: 12.47448 },
  { lat: 41.89842, lng: 12.4749 },
  { lat: 41.8983, lng: 12.47518 },
  { lat: 41.8982, lng: 12.4753 },
];

/** C타입 Street View 대체 화면: 가게 입구를 바라보는 위치와 방향 */
export const STREET_VIEW = {
  lat: 41.89814,
  lng: 12.47518,
  heading: 70, // 0 = 북, 90 = 동
  pitch: 5,
  fov: 80,
};

// ─────────────────────────────────────────────
// 2. 이동 시뮬레이션
// ─────────────────────────────────────────────
export const SIMULATION = {
  /** 1x 속도에서 출발 → 도착까지 걸리는 시간(초) */
  durationSec: 40,
  /** 도착 몇 m 전에 AI 알림을 띄울지 (geofence) */
  geofenceMeters: 30,
  /** 알림이 뜨면 점을 그 자리에서 멈출지(true), 가게 문 앞까지 마저 걸어갈지(false) */
  stopAtGeofence: false,
  /** 하단 시트의 남은 시간 계산용 실제 보행 속도(m/s) */
  walkingSpeedMps: 1.2,
  /** 진행자 메뉴에서 고를 수 있는 속도 */
  speedOptions: [0.5, 1, 2] as const,
};

/** 기본 진행 순서(시작 화면에서 고름) */
export const ORDER_OPTIONS: NoticeType[][] = [
  ['A', 'B', 'C'],
  ['B', 'C', 'A'],
  ['C', 'A', 'B'],
];

// ─────────────────────────────────────────────
// 3. 길찾기 안내 배너
//    progress(0~1) 지점부터 해당 안내가 보입니다. 남은 거리는 다음 안내 지점까지 계산됩니다.
// ─────────────────────────────────────────────
export type Maneuver = 'straight' | 'right' | 'left' | 'arrive';

export const NAV_STEPS: { from: number; maneuver: Maneuver; text: string; sub?: string }[] = [
  { from: 0, maneuver: 'straight', text: 'Corsia Agonale 방향으로 직진', sub: '광장 동쪽 출구' },
  { from: 0.3, maneuver: 'right', text: 'Corso del Rinascimento에서 우회전' },
  { from: 0.48, maneuver: 'left', text: 'Via dei Canestrari로 좌회전' },
  { from: 0.7, maneuver: 'right', text: 'Piazza di S. Eustachio 방향으로 우회전' },
  { from: 0.88, maneuver: 'arrive', text: '목적지가 오른쪽에 있어요', sub: DESTINATION.name },
];

// ─────────────────────────────────────────────
// 4. 화면 문구
// ─────────────────────────────────────────────
export const TEXT = {
  start: {
    title: '노 어글리 코리안',
    subtitle: '유저테스트 프로토타입',
    idLabel: '참여자 ID',
    idPlaceholder: '예: P01',
    orderLabel: '진행 순서',
    startButton: '테스트 시작',
    hint: '진행자 메뉴: 화면 왼쪽 위를 2초간 길게 누르기',
  },
  intro: {
    title: (type: NoticeType) => `${type}타입`,
    progress: (index: number, total: number) => `${index + 1} / ${total}`,
    body: '로마 나보나 광장에서\n근처 카페까지 걸어가는 중이에요.\n화면을 보며 걷는다고 상상해 주세요.',
    button: (type: NoticeType) => `${type}타입 시작`,
  },
  nav: {
    headerLabel: (type: NoticeType) => `${type}타입`,
    done: '완료',
    minutes: (m: number) => `${m}분`,
    meters: (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`),
    eta: (time: string) => `도착 예정 ${time}`,
    walking: '도보',
  },
  end: {
    title: '테스트가 끝났습니다',
    body: '참여해 주셔서 감사합니다.',
    exportButton: '기록 내보내기 (CSV)',
    exportAllButton: '이 폰의 전체 기록 내보내기',
    restart: '처음 화면으로',
  },
  moderator: {
    title: '진행자 메뉴',
    speed: '이동 속도',
    restartType: '현재 타입 처음부터',
    forceNotice: '알림 바로 띄우기',
    skipType: '다음 타입으로 건너뛰기',
    cView: 'C타입 화면',
    camera: '카메라',
    streetView: 'Street View',
    home: '처음 화면으로',
    close: '닫기',
  },
};

// ─────────────────────────────────────────────
// 5. AI 알림 문구 (A / B / C)
// ─────────────────────────────────────────────
export const AI_LABEL = {
  reviewCount: 128,
  text: (count: number) => `✦ AI 안내 · 이 가게 리뷰 ${count}개 기반`,
};

export const CONFIRM_TEXT = '확인';

export const NOTICE_A = {
  emoji: '☕',
  title: '이 바는 계산대에서 먼저 결제해요',
  body: '서서 마시면 더 저렴해요',
};

export type NoticeBCard = {
  title: string;
  body: string;
  /** 이탈리아어 표현 (원문 + 뜻). speak 가 있으면 🔊 버튼이 나타남 */
  phrase?: { it: string; ko: string };
};

export const NOTICE_B = {
  speakLabel: '🔊 발음 듣기',
  speechLanguage: 'it-IT',
  speechRate: 0.85,
  cards: [
    {
      title: '먼저 정하세요',
      body: '서서 마실까요, 앉을까요?\n서서 = 더 저렴 / 앉으면 = 테이블 가격',
    },
    {
      title: '계산대(Cassa)에서 먼저 결제',
      body: '주문할 메뉴를 말하고 먼저 돈을 내요.',
      phrase: { it: 'Un caffè, per favore', ko: '에스프레소 한 잔 주세요' },
    },
    {
      title: '영수증을 바리스타에게',
      body: '바 앞에서 영수증을 보여 주고\n주문하세요.',
    },
    {
      title: '설탕이 기본으로 들어가요',
      body: '빼고 싶다면 이렇게 말해요.',
      phrase: { it: 'Senza zucchero', ko: '설탕 빼 주세요' },
    },
  ] as NoticeBCard[],
};

/**
 * C타입 AR 라벨. x, y 는 카메라 화면 안에서의 위치(%)
 * x = 말풍선 가운데, y = 말풍선 윗변
 */
export const NOTICE_C = {
  liveViewChip: 'Live View',
  main: {
    text: "Sant'Eustachio · 먼저 계산대에서 결제",
    x: 50,
    y: 18,
  },
  subs: [
    { text: '① Cassa 계산대 → 결제', x: 30, y: 52 },
    { text: '② Bar → 영수증 주고 주문', x: 70, y: 66 },
  ],
  /** 카메라 화면이 차지하는 비율 (나머지는 지도) */
  cameraRatio: 0.55,
};
