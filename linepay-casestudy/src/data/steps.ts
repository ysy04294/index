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
    title: "매화를 모티브한 재화 아이콘으로 구분되는 등급",
    body: [
      "현재 마일리지와 등급을 먼저 보여주고 **다음 등급까지 남은 마일리지와 받을 보상**으로 시선이 이어지도록 정보 순서를 잡았습니다.",
      "등급 그래픽은 대만을 상징하는 **매화를 모티브로 직접 디자인**했습니다. 등급이 오를수록 꽃잎이 늘어나 형태만으로도 단계의 차이가 느껴지도록 했습니다.",
      "컬러는 대만 화폐에서 착안한 그린·브라운·블루·퍼플로 구분했습니다. **형태와 컬러가 함께 바뀌는 하나의 등급 체계**로 만들었습니다.",
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
    title: "결제 기록을 다음 보상이 보이는 길로",
    body: [
      "결제할수록 스탬프가 채워지는 **게이미피케이션 요소를 기획해** 현재 진행 상황과 다음 보상을 직관적으로 확인할 수 있도록 했습니다.",
      "모든 결제 기록과 보상을 처음부터 펼쳐 보여주기보다, **기본 상태에서는 다음 보상까지 남은 횟수처럼 필요한 정보만 간결하게 보여주고 필요할 때 펼쳐서 상세 내용을 확인할 수 있도록 구성했습니다.**",
      "**등급 그래픽의 형태를 기반으로 스탬프용 그래픽을 다시 디자인해 전체 스타일의 일관성을 유지했습니다.** 메인 화면에서는 등급 재화를 3D로 표현해 시선을 집중시키고 작은 스탬프에서는 같은 형태를 2D 아이콘으로 단순화해 작은 영역에서도 쉽게 구분할 수 있도록 했습니다.",
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
    title: "다음 등급을 미리 보여주며 관심을 이어가기",
    body: [
      "등급 자체보다 **다음 등급에서 받을 수 있는 혜택**에 먼저 관심이 가도록 구성했습니다. 현재 혜택과 다음 등급의 보상을 나눠 보여줘 등급이 올라갔을 때 무엇이 달라지는지 쉽게 비교할 수 있도록 했습니다.",
      "현재 등급 재화 뒤에는 **다음 등급의 3D 재화를 살짝 겹쳐 보여주어** 자연스럽게 다음 목표에 시선이 이어지도록 했습니다. 그래픽으로 먼저 관심을 만들고 이어지는 혜택 정보로 다음 등급의 가치를 확인할 수 있도록 구성했습니다.",
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
      "미션의 버튼을 누르면 포인트 인터랙션을 통해 **마일리지 적립 순간을 강조**하여 비주얼로 기대감을 만들었습니다.",
      "마일리지 모으는 페이지에서 바로 결제하며 마일리지를 모을 수 있도록 하단에 버튼을 배치해, 화면 확인과 결제 행동이 이어지도록 설계했습니다.",
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
