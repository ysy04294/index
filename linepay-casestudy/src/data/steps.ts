// 단계별 설명 데이터. 화면 이름이나 문구가 바뀌면 이 파일만 고치면 된다.

export type StepId = "start" | "main" | "stamp" | "grade" | "collect";

export type Step = {
  id: StepId;
  nodeId: string; // Figma node ID (":" 형식)
  stateTrigger?: string; // NEW_STATE로 들어오는 단계면 컴포넌트 node ID
  label: string; // 단계 점 툴팁용 짧은 이름
  eyebrow: string; // "STEP 01"
  title: string;
  body: string[]; // 문단 배열. **굵게** 표기를 지원한다
  points: { tag: string; text: string; grade?: GradeColor }[]; // 포인트 칩
  hint?: string; // "이 부분을 눌러보세요" 안내
  manualHint?: string; // 수동 모드에서 hint 대신 보여주는 안내
};

export type GradeColor = "green" | "bronze" | "blue" | "purple";

export const FIGMA_FILE_KEY = "71jSPcfmc8ldKwZtJVVVkt";
export const FIGMA_FILE_NAME = "LINE-Pay-Mileage";

export const steps: Step[] = [
  {
    id: "start",
    nodeId: "1496:22698",
    label: "출석 완료",
    eyebrow: "STEP 00",
    title: "들어오기만 해도 보상이 터진다",
    body: [
      "마일리지 화면에 들어오면 출석이 자동으로 체크됩니다.",
      "별도의 버튼 없이 진입과 동시에 보상 팝업이 터지는 모션을 넣어, 첫 화면부터 \"받았다\"는 경험을 주도록 설계했습니다.",
      "팝업에는 오늘 받은 +10M과 연속 출석 일수를 함께 보여주어, 내일 다시 들어올 이유를 만듭니다.",
    ],
    points: [
      { tag: "게이미피케이션", text: "진입 즉시 보상" },
      { tag: "모션", text: "팡 터지는 출석 팝업" },
      { tag: "리텐션", text: "연속 출석 일수" },
    ],
    hint: "팝업을 닫으면 메인 화면으로 이동합니다",
  },
  {
    id: "main",
    nodeId: "1436:20764",
    label: "메인",
    eyebrow: "STEP 01",
    title: "프로필과 등급을 한 카드에",
    body: [
      "상단 카드에 유저 프로필(썸네일·아이디), 현재 등급, 보유 마일리지, 다음 등급까지 남은 양을 한 번에 묶었습니다. 사용자가 가장 먼저 궁금한 \"나는 지금 어디쯤인가\"에 바로 답합니다.",
      "등급마다 재화 아이콘을 4단계로 디자인했습니다. 대만을 상징하는 **매화**를 모티브로, 등급이 오를수록 꽃잎이 늘어나 최고 등급에서 다섯 장의 매화가 완성됩니다.",
      "컬러는 **대만 지폐 색**에서 가져왔습니다. 200원권 초록, 500원권 갈색, 1000원권 파랑, 2000원권 보라를 순서대로 그린 → 브론즈 → 블루 → 퍼플 등급에 대응시켜, 대만 사용자에게 \"가치가 커진다\"는 감각이 자연스럽게 전달되도록 했습니다.",
    ],
    points: [
      { tag: "재화 디자인", text: "매화 모티브 4단계" },
      { tag: "컬러", text: "대만 지폐 색", grade: "purple" },
      { tag: "정보 구조", text: "프로필 + 등급 + 진행도" },
    ],
    hint: "\"등급 안내\"나 \"퍼플이 되면 받는 보상\"을 눌러보세요",
  },
  {
    id: "stamp",
    nodeId: "1436:20764",
    stateTrigger: "1436:20820",
    label: "결제 스탬프",
    eyebrow: "STEP 02",
    title: "결제할수록 길이 채워진다",
    body: [
      "마일리지를 모으는 핵심 행동인 결제를 **스탬프 모으기**로 게이미피케이션했습니다.",
      "접힌 상태에서는 다음 보상까지 남은 횟수만 간단히 보여주고, \"전체 스탬프\"를 누르면 펼쳐지면서 지금까지 모아온 과정과 앞으로의 보상이 길 형태로 나타납니다.",
      "찍힌 스탬프에는 등급 재화 아이콘을 2D로 단순화해 적용했습니다. 결제가 곧 마일리지 재화로 쌓인다는 것을 시각적으로 연결했습니다.",
    ],
    points: [
      { tag: "게이미피케이션", text: "스탬프 길" },
      { tag: "인터랙션", text: "접힘 ↔ 펼침" },
      { tag: "시스템", text: "재화 아이콘 2D 재사용", grade: "green" },
    ],
    hint: "\"전체 스탬프\"를 눌러 펼쳐보세요",
    manualHint: "‘전체 스탬프’를 눌러보세요",
  },
  {
    id: "grade",
    nodeId: "1436:20966",
    label: "등급과 혜택",
    eyebrow: "STEP 03",
    title: "다음 등급이 궁금해지도록",
    body: [
      "메인에서 \"등급 안내\"나 보상 영역을 누르면 등급과 혜택 화면으로 이동합니다.",
      "다음 등급으로 관심을 끌기 위해, 현재 등급의 메인 코인 뒤로 **다음 등급 재화가 살짝 보이도록** 겹쳐 배치했습니다.",
      "등급 혜택 영역에서는 네 등급의 혜택을 차례로 보여주고, 다음 등급에서 받을 수 있는 더 큰 보상은 별도 카드로 분리해 강조했습니다.",
    ],
    points: [
      { tag: "동기 부여", text: "다음 등급 미리보기", grade: "blue" },
      { tag: "정보 구조", text: "현재 혜택 / 다음 보상 분리" },
      { tag: "시각 위계", text: "다음 보상 강조" },
    ],
    hint: "왼쪽 위 뒤로 가기로 메인에 돌아갈 수 있어요",
  },
  {
    id: "collect",
    nodeId: "1436:21051",
    label: "마일리지 모으기",
    eyebrow: "STEP 04",
    title: "마일리지 모으는 모든 방법",
    body: [
      "메인의 \"오늘 마일리지 모으기\" 배너를 누르면 마일리지 모으기 화면으로 이동합니다.",
      "등급 챌린지, 마일리지 뽑기, 출석, 리워드 광고, 오늘의 미션까지, 마일리지를 모을 수 있는 방법을 한 화면에 모았습니다.",
      "광고 배너는 가맹점 광고를 보면 바로 마일리지가 쌓이는 리워드 광고로 설계해, 광고가 사용자에게도 보상이 되도록 했습니다.",
    ],
    points: [
      { tag: "리워드 광고", text: "보면 바로 +30M", grade: "bronze" },
      { tag: "게이미피케이션", text: "마일리지 뽑기" },
      { tag: "행동 유도", text: "오늘의 미션 진행도" },
    ],
    hint: "배너와 미션을 눌러보세요",
  },
];

/** 화면(frame) node ID → 단계. 같은 화면을 쓰는 stateTrigger 단계는 제외한다. */
export function stepIndexForFrame(nodeId: string): number {
  return steps.findIndex((s) => s.nodeId === nodeId && !s.stateTrigger);
}

/** 컴포넌트 state 변경 → 단계 */
export function stepIndexForState(nodeId: string): number {
  return steps.findIndex((s) => s.stateTrigger && nodeId.includes(s.stateTrigger));
}
