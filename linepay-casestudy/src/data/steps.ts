// 단계별 설명 데이터. 화면 이름이나 문구가 바뀌면 이 파일만 고치면 된다.

export type StepId = "start" | "main" | "motif" | "stamp" | "grade" | "collect";

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
    eyebrow: "STEP 01",
    title: "첫 방문부터 보상이 느껴지도록",
    body: [
      "마일리지 화면에 들어온 순간부터 ==“이곳에서는 행동에 대한 보상을 받을 수 있다”는 경험이 먼저 느껴지도록 출석을 첫 인터랙션으로 구성==했습니다.",
      "첫 진입 시 출석을 자동으로 체크하고 +10M 적립 결과를 팝업으로 보여줍니다. 숫자만 알리는 대신 컨페티가 터지는 모션으로 마일리지 보상을 시각적으로 강조하고 연속 출석 일수를 함께 보여줘 오늘의 보상과 다음 방문의 이유가 자연스럽게 이어지도록 했습니다.",
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
    eyebrow: "STEP 02",
    title: "현재 상태에서 다음 목표까지 한눈에",
    body: [
      "여러 리워드 서비스를 살펴보며 ==사용자가 가장 먼저 궁금해하는 것은 “지금 얼마나 가지고 있는지”와 “얼마나 더 모아야 하는지”==라고 보았습니다.",
      "그래서 상단에서는 현재 마일리지와 등급을 가장 먼저 보여주고 바로 아래에서 다음 등급까지 남은 마일리지와 받을 수 있는 보상으로 시선이 이어지도록 구성했고 메인 키비주얼을 3D로 표현해 마일리지 숫자와 함께 가장 먼저 시선이 가는 요소로 사용했습니다.",
    ],
    points: [
      { tag: "재화 디자인", text: "매화 모티브 4단계" },
      { tag: "컬러", text: "대만 지폐 색", grade: "purple" },
      { tag: "정보 구조", text: "프로필 + 등급 + 진행도" },
    ],
    hint: "등급 안내를 누르면 상세 혜택을 확인할 수 있습니다",
  },

  {
    id: "motif",
    nodeId: "1436:20764",
    label: "등급 비주얼",
    eyebrow: "STEP 03",
    title: "매화를 모티브로 한 등급 비주얼 디자인",
    body: [
      "==등급 비주얼은 대만을 상징하는 매화를 모티브로 직접 디자인==했습니다. 등급이 올라갈수록 꽃잎이 늘어나도록 해 형태만으로도 단계의 차이가 느껴지도록 하고 대만 화폐에서 가져온 그린·브라운·블루·퍼플 컬러를 함께 적용했습니다.",
      "단순히 색만 바꾸는 것이 아니라 형태와 컬러가 함께 변화하는 하나의 등급 비주얼 시스템으로 만들었습니다.",
    ],
    points: [],
    hint: "등급 안내를 누르면 상세 혜택을 확인할 수 있습니다",
  },  {
    id: "stamp",
    nodeId: "1436:20764",
    stateTrigger: "1436:20820",
    label: "결제 스탬프",
    eyebrow: "STEP 04",
    title: "결제 기록을 다음 보상이 보이는 길로",
    body: [
      "결제할수록 하나씩 채워지는 스탬프 방식의 게이미피케이션 요소를 기획했습니다. 현재 몇 번 결제했고 다음 보상까지 얼마나 남았는지 결제 횟수의 누적 과정을 한눈에 확인할 수 있도록 구성했습니다.",
      "메인 화면에서 등급과 주요 보상은 3D 재화로 강조했지만 ==반복적으로 확인하는 스탬프 영역에서는 같은 등급 그래픽의 형태를 2D 아이콘==으로 단순화했습니다. 현재 등급의 컬러를 스탬프에도 이어 사용해 작은 영역에서도 등급과 진행 상태를 직관적으로 구분하면서 메인 화면과의 시각적 일관성을 유지했습니다.",
    ],
    points: [
      { tag: "게이미피케이션", text: "스탬프 길" },
      { tag: "인터랙션", text: "접힘 ↔ 펼침" },
      { tag: "시스템", text: "재화 아이콘 2D 재사용", grade: "green" },
    ],
    hint: "스탬프 영역을 눌러 상세 진행 상황을 확인해보세요",
  },
  {
    id: "grade",
    nodeId: "1436:20966",
    label: "등급과 혜택",
    eyebrow: "STEP 05",
    title: "다음 등급을 미리 보여주며 관심을 이어가기",
    body: [
      "등급 자체보다 ==다음 등급에서 받을 수 있는 혜택에 먼저 관심이 가도록 구성==했습니다. 현재 혜택과 다음 등급의 보상을 나눠 보여줘 등급이 올라갔을 때 무엇이 달라지는지 쉽게 비교할 수 있도록 했습니다.",
      "현재 등급 재화 뒤에는 ==다음 등급의 3D 재화를 살짝 겹쳐 보여주어 다음 목표로 시선이 이어지도록== 했습니다. 그래픽으로 먼저 관심을 만들고 이어지는 혜택 정보로 다음 등급의 가치를 확인할 수 있도록 구성했습니다.",
    ],
    points: [
      { tag: "동기 부여", text: "다음 등급 미리보기", grade: "blue" },
      { tag: "정보 구조", text: "현재 혜택 / 다음 보상 분리" },
      { tag: "시각 위계", text: "다음 보상 강조" },
    ],
    hint: "재화를 움직여 다음 등급을 확인해보세요",
  },
  {
    id: "collect",
    nodeId: "1436:21051",
    label: "마일리지 모으기",
    eyebrow: "STEP 06",
    title: "콘텐츠의 역할에 따라 비주얼 방식을 나누기",
    body: [
      "출석·뽑기·리워드 광고처럼 마일리지를 모으는 다양한 콘텐츠를 한 화면에서 확인하고 바로 참여할 수 있도록 구성했습니다.",
      "각 ==콘텐츠의 성격과 역할에 따라 비주얼 표현 방식도 구분==했습니다.",
      "- **3D 그래픽** : 등급과 주요 보상처럼 시선을 집중시켜야 하는 요소\n- **2D 그래픽** : 출석과 뽑기처럼 반복적으로 사용하는 기능\n- **실사 이미지** : 실제 상품과 광고 소재가 중심이 되는 리워드 광고",
      "등급과 주요 보상은 3D 그래픽으로 강조하고 출석과 뽑기처럼 반복적으로 사용하는 기능은 2D 그래픽으로 제작했습니다. 리워드 광고는 실제 상품과 광고 소재가 중심이 되도록 실사 이미지를 사용했습니다. 서로 다른 표현 방식은 LINE Pay 컬러와 공통 그래픽 요소로 연결했습니다.",
    ],
    points: [
      { tag: "리워드 광고", text: "보면 바로 +30M", grade: "bronze" },
      { tag: "게이미피케이션", text: "마일리지 뽑기" },
      { tag: "행동 유도", text: "오늘의 미션 진행도" },
    ],
    hint: "출석과 리워드 요소를 직접 눌러보세요",
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
