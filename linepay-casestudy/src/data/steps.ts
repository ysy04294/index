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
    title: "방문을 보상받는 경험으로",
    body: [
      "이번 과제는 **현재 마일리지와 다음 보상을 쉽게 이해하고, 직접 모아보고 싶어지는 화면**으로 풀었습니다. 비주얼도 시선을 끄는 데서 끝나지 않고 다음 행동을 돕도록 사용했습니다.",
      "첫 진입에서는 출석을 자동으로 체크하고 +10M 보상을 팝업과 모션으로 보여줍니다. 받은 보상과 연속 출석 일수를 함께 알려줘, 오늘의 혜택과 다음에 방문할 이유가 연결되도록 했습니다.",
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
    title: "한눈에 읽히는 현황, 모양으로 구분되는 등급",
    body: [
      "상단 카드에 **프로필 → 현재 마일리지·등급 → 다음 등급까지 남은 양과 보상**을 묶었습니다. 내 현황을 먼저 파악한 뒤 다음 목표로 시선이 이어지도록 순서를 잡았습니다.",
      "등급 재화는 대만을 상징하는 매화를 모티브로 만들었습니다. 등급이 오를수록 꽃잎이 늘고, 퍼플에서 다섯 장의 매화가 완성됩니다. 3D 그래픽이 장식에 머물지 않고 등급의 차이를 보여주도록 했습니다.",
      "색은 대만 지폐의 초록·갈색·파랑·보라에서 가져왔습니다. 형태와 색을 함께 바꿔 네 등급을 구분하고, 익숙한 화폐의 색으로 재화의 가치를 표현했습니다.",
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
    title: "결제 기록을, 다음 보상이 보이는 길로",
    body: [
      "결제 횟수를 읽는 대신 **스탬프를 채우며 다음 보상까지의 거리를 보게** 했습니다. 결제와 마일리지 적립을 하나의 흐름으로 연결한 게이미피케이션입니다.",
      "접힌 화면은 다음 보상까지 남은 횟수만 보여줘 복잡함을 줄였습니다. 펼치면 모은 기록과 받을 보상이 길처럼 이어져, 진행 상황과 다음 목표를 함께 확인할 수 있습니다.",
      "등급 재화는 작은 스탬프에서도 읽히도록 2D로 다시 그렸습니다. 큰 3D 재화와 작은 UI 아이콘이 같은 시각 언어를 쓰도록 맞췄습니다.",
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
    title: "등급의 차이를, 받을 혜택의 차이로",
    body: [
      "등급을 올리라는 메시지보다 **올리면 무엇을 받는지** 먼저 보여주고 싶었습니다. 현재 등급의 혜택과 다음 등급의 보상을 나눠 비교할 수 있게 했습니다.",
      "현재 재화 뒤에는 다음 등급 재화를 살짝 겹쳤습니다. 그래픽으로 다음 목표에 관심을 만들고, 구체적인 혜택 정보가 그 관심을 이어받도록 구성했습니다.",
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
    title: "출석 한 번에도, 보상이 느껴지도록",
    body: [
      "마일리지를 모으는 방법을 찾고 바로 참여할 수 있도록 출석·뽑기·리워드 광고·미션을 한곳에 모았습니다. **참여할 행동과 받을 혜택을 함께 보여주는 것**에 중점을 뒀습니다.",
      "‘오늘의 출석 체크’를 누르면 코인이 튀어 오르는 모션을 넣었습니다. 완료 문구만 바꾸는 대신, 누른 행동이 보상으로 돌아왔다는 느낌을 움직임으로 전달했습니다.",
      "리워드 광고는 광고 소재와 +30M 보상을 함께 보여줍니다. 프로모션 비주얼로 관심을 끌되, 사용자가 무엇을 하면 어떤 혜택을 받는지 바로 읽히도록 했습니다.",
    ],
    points: [
      { tag: "리워드 광고", text: "보면 바로 +30M", grade: "bronze" },
      { tag: "게이미피케이션", text: "마일리지 뽑기" },
      { tag: "행동 유도", text: "오늘의 미션 진행도" },
    ],
    hint: "아래로 스크롤해 ‘오늘의 출석 체크’를 눌러보세요. 코인이 튀어 오릅니다.",
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
