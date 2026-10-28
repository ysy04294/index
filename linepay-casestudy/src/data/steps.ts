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
    title: "첫 방문부터 보상이 느껴지도록",
    body: [
      "첫 진입에서는 출석을 자동으로 체크하고 **+10M 보상을 팝업과 모션으로 강조**했습니다.",
      "코인 비주얼과 움직임으로 적립 순간을 보여주고, 연속 출석 일수를 함께 배치했습니다. 오늘 받은 보상과 다음에 방문할 이유가 이어지도록 했습니다.",
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
      "현재 마일리지와 등급을 먼저 보여주고, **다음 등급까지 남은 마일리지와 받을 보상**으로 시선이 이어지도록 정보 순서를 잡았습니다.",
      "등급 그래픽은 대만을 상징하는 **매화를 모티브로 직접 디자인**했습니다. 등급이 오를수록 꽃잎이 늘어나 형태만으로도 단계의 차이가 느껴지도록 했습니다.",
      "컬러는 대만 화폐에서 착안한 초록·브라운·블루·퍼플로 구분했습니다. **형태와 컬러가 함께 바뀌는 하나의 등급 체계**로 만들었습니다.",
      "큰 등급 재화는 **화면에서 주목을 만드는 3D 오브젝트**로 제작했습니다. 작은 UI에서 쓰이는 재화와 표현의 역할을 나눴습니다.",
    ],
    points: [
      { tag: "재화 디자인", text: "매화 모티브 4단계" },
      { tag: "컬러", text: "대만 지폐 색", grade: "purple" },
      { tag: "정보 구조", text: "프로필 + 등급 + 진행도" },
    ],
    hint: "프로필 카드 오른쪽 위 ‘등급 안내’를 눌러보세요.",
  },
  {
    id: "stamp",
    nodeId: "1436:20764",
    stateTrigger: "1436:20820",
    label: "결제 스탬프",
    eyebrow: "STEP 02",
    title: "결제 기록을, 다음 보상이 보이는 길로",
    body: [
      "결제 횟수는 **스탬프가 채워지는 길로 시각화**했습니다. 현재 진행 상황과 다음 보상을 함께 보며, 얼마나 더 모으면 되는지 알 수 있도록 했습니다.",
      "접힌 상태에서는 다음 보상까지 남은 횟수만 보여줍니다. 펼치면 지금까지 모은 기록과 앞으로 받을 보상이 이어지도록 구성했습니다.",
      "메인에서 시선을 잡는 재화는 3D로, **작은 스탬프는 같은 형태를 2D로 다시 디자인**했습니다. 단순히 축소하기보다 UI에서 쓰이는 크기와 역할에 맞춰 표현을 나눴습니다.",
    ],
    points: [
      { tag: "게이미피케이션", text: "스탬프 길" },
      { tag: "인터랙션", text: "접힘 ↔ 펼침" },
      { tag: "시스템", text: "재화 아이콘 2D 재사용", grade: "green" },
    ],
    hint: "휴대폰 안을 아래로 스크롤해 ‘전체 스탬프’를 눌러 펼쳐보세요.",

  },
  {
    id: "grade",
    nodeId: "1436:20966",
    label: "등급과 혜택",
    eyebrow: "STEP 03",
    title: "다음 등급을, 받을 혜택으로 먼저 보여주기",
    body: [
      "등급 상승 자체보다 **올라갔을 때 어떤 혜택을 받는지** 먼저 이해하도록 구성했습니다. 현재 혜택과 다음 등급의 보상을 구분해 살펴볼 수 있게 했습니다.",
      "현재 등급 재화 뒤에 **다음 등급의 3D 재화를 일부 겹쳐** 배치했습니다. 그래픽으로 다음 목표에 관심을 만들고, 실제 혜택 정보가 그 관심을 이어받도록 했습니다.",
    ],
    points: [
      { tag: "동기 부여", text: "다음 등급 미리보기", grade: "blue" },
      { tag: "정보 구조", text: "현재 혜택 / 다음 보상 분리" },
      { tag: "시각 위계", text: "다음 보상 강조" },
    ],
    hint: "큰 등급 재화 위에 마우스를 올려 모션을 확인해보세요.",
  },
  {
    id: "collect",
    nodeId: "1436:21051",
    label: "마일리지 모으기",
    eyebrow: "STEP 04",
    title: "참여할 행동과 받을 보상을 함께",
    body: [
      "출석·뽑기·리워드 광고·미션을 한곳에 모았습니다. **무엇을 하면 어떤 보상을 받는지** 바로 읽고 참여하도록 행동과 혜택을 함께 보여줬습니다.",
      "**출석은 코인이 튀어 오르는 모션**으로 적립 순간을 강조하고, 뽑기는 선물상자와 보상 비주얼로 기대감을 만들었습니다. 미션은 할 행동과 적립 마일리지를 나란히 보여줍니다.",
      "리워드 광고는 **광고 소재·시청 조건·+30M 보상**을 함께 배치했습니다. 프로모션 이미지가 시선을 끌고, 바로 옆의 정보가 참여 방법을 알려주도록 설계했습니다.",
    ],
    points: [
      { tag: "리워드 광고", text: "보면 바로 +30M", grade: "bronze" },
      { tag: "게이미피케이션", text: "마일리지 뽑기" },
      { tag: "행동 유도", text: "오늘의 미션 진행도" },
    ],
    hint: "휴대폰 안을 아래로 스크롤해 ‘오늘의 출석 체크’ 오른쪽 ‘100M’ 버튼을 눌러보세요.",
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
